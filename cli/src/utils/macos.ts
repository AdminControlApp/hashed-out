import { execaCommand } from 'execa';
import inquirer from 'inquirer';

export async function changePassword(newPassword: string) {
	const { oldPassword } = await inquirer.prompt<{ oldPassword: string }>({
		name: 'oldPassword',
		message: 'Please enter the old password:',
		type: 'password',
	});
	const passwdProcess = execaCommand('passwd');
	passwdProcess.stdin?.write(`${oldPassword}\n`);
	passwdProcess.stdin?.write(`${newPassword}\n${newPassword}\n`);
}
