import bcrypt from 'bcrypt';
import inquirer from 'inquirer';
import consoleClear from 'console-clear';

export async function decipherHash() {
	const { rawHash } = await inquirer.prompt<{ rawHash: string }>([
		{
			name: 'rawHash',
			type: 'input',
			message: 'Enter the hash:',
		},
	]);

	const hash = rawHash.trim();

	try {
		const password = await Promise.any(
			[...Array.from({ length: 10_000 }).keys()].map(async (i) => {
				const passwordString = i.toString().padStart(4, '0');
				if (await bcrypt.compare(passwordString, hash)) {
					return passwordString;
				} else {
					console.log(`Tried password ${i}, failed.`);
					// eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
					return Promise.reject();
				}
			})
		);

		return password;
	} catch {
		throw new Error('No hash found.');
	}
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
		throw new Error('Password must be 4 numbers');
	}

	consoleClear();
	return bcrypt.hash(password, 15);
}
