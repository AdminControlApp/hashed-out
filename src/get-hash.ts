import process from 'node:process';
import bcrypt from 'bcrypt';
import prompt from 'prompt';

prompt.start();

const { hash: rawHash } = await prompt.get<{ hash: string }>(['hash'])
const hash = rawHash.trim();

await Promise.all([...Array.from({ length: 10_000 }).keys()].map(async (i) => {
	const passwordString = i.toString().padStart(4, '0');
	if (await bcrypt.compare(passwordString, hash)) {
		console.log(passwordString);
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(0);
	}
}))

console.log('no hash found :(');
