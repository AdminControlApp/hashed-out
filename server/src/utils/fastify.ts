import process from 'node:process';
import fastify from 'fastify';
import twilio from 'twilio';
import fastifyFormbody from 'fastify-formbody';
import bcrypt from 'bcrypt';
import { getCallSpinner } from '~/utils/spinner.js';
import { Gather } from 'twilio/lib/twiml/VoiceResponse';

const { twiml } = twilio;

export async function startFastifyServer() {
	const app = fastify({
		logger: process.env.DEBUG === '1',
	});

	await app.register(fastifyFormbody);

	app.get('/health', async (_request, reply) => {
		await reply.send('Operational!');
	});

	app.post<{ Body: { Digits: string } }>('/input', async (request, reply) => {
		const voice = new twiml.VoiceResponse();

		const digits = request.body.Digits;

		if (digits === undefined) {
			voice.redirect('/voice');
		} else {
			if (/^\d{4}$/.test(digits)) {
				const hashedPassword = bcrypt.hash(digits, 15);
				voice.say('Thank you!');
			} else {
				voice.say("Sorry, that wasn't four digits. Please try again.");
			}
		}

		await reply.type('text/xml').send(voice.toString());
	});

	app.post<{ Body: { Digits: string } }>(
		'/confirm-passcode',
		async (request, reply) => {
			const voice = new twiml.VoiceResponse();

			const gather = voice.gather({
				numDigits: 4,
				action: '/input',
				method: 'POST',
			});

			gather.say('Please type in the same four-digit passcode again.');

			voice.redirect('/voice');

			await reply.type('text/xml').send(voice.toString());
		}
	);

	app.post('/voice', async (request, reply) => {
		console.log(request.body);

		const callSpinner = getCallSpinner();

		callSpinner.start(
			'Call answered. Waiting for new 4-digit passcode input...'
		);

		const voice = new twiml.VoiceResponse();

		const gather = voice.gather({
			numDigits: 4,
			action: '/confirm-passcode',
			method: 'POST',
		});

		gather.say('Please type in a new four-digit passcode.');

		voice.redirect('/voice');

		await reply.type('text/xml').send(voice.toString());
	});
}
