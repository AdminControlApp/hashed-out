import bcrypt from 'bcrypt';
import prompt from 'prompt';

prompt.start();

const { password: rawPassword } = await prompt.get<{ password: string }>(['password'])
const password = rawPassword.trim();
if (password.length !== 4 || ![...password].every((c) => c >= '0' && c <= '9')) {
	throw new Error('password must be 4 numbers');
}

console.clear();
console.log(await bcrypt.hash(password, 10));
