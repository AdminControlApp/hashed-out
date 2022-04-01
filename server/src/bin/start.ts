import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
	port: 4000,
});

const app = fastify();

app.get('/health', async (request, reply) => {
	await reply.send('Operational!');
});


wss.on('connection', (socket) => {
	console.debug('Connection!');

	socket.on('message', (data) => {
		const str = String(data);
		console.log(str);
	});
});

wss.on('listening', function () {
	const address = this.address();
	if (typeof address === 'string') {
		console.info(`Listening at ${address}`);
	} else {
		console.info(`Listening at ${address.address}:${address.port}`);
	}
});
