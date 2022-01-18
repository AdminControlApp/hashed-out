import process from 'node:process';
import bcrypt from 'bcrypt';
import inquirer from 'inquirer';

export async function decipherHash() {
	const { rawHash } = await inquirer.prompt<{ rawHash: string }>([
		{
			name: 'rawHash',
			type: 'input',
			message: 'Enter the hash:'
		},
	]);

	const hash = rawHash.trim();

	await Promise.all(
		[...Array.from({ length: 10_000 }).keys()].map(async (i) => {
			const passwordString = i.toString().padStart(4, '0');
			if (await bcrypt.compare(passwordString, hash)) {
				console.log(passwordString);
				// eslint-disable-next-line unicorn/no-process-exit
				process.exit(0);
			}
		})
	);

	console.log('no hash found :(');
}

export async function createHash() {
	const { rawPassword } = await inquirer.prompt<{ rawPassword: string }>([
		{
			name: 'rawPassword',
			message: 'Enter a 4-digit password:',
			type: 'input',
		},
	]);

	const password = rawPassword.trim();
	if (
		password.length !== 4 ||
		![...password].every((c) => c >= '0' && c <= '9')
	) {
		throw new Error('password must be 4 numbers');
	}

	console.clear();
	console.log(await bcrypt.hash(password, 15));
}
