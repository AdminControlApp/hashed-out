import { Buffer } from 'node:buffer';
import { execaCommand as exec } from 'execa';
import type { BitwardenItem, BitwardenLoginItem } from '~/types/bitwarden.js';

export async function ensureLoggedIn() {
	const bwProcess = await exec('bw status');
	const { status } = JSON.parse(bwProcess.stdout) as {
		status: string;
	};

	if (status === 'unauthenticated') {
		await exec('bw login', { stdio: 'inherit' });
	}
}

type CreateItemProps = {
	itemName: string;
	username: string;
	password: string;
};
export async function createItem({
	itemName,
	username,
	password,
}: CreateItemProps) {
	const bwTemplateItemProcess = await exec('bw get template item');
	const bwItem = JSON.parse(bwTemplateItemProcess.stdout) as BitwardenItem;
	bwItem.name = itemName;

	const bwTemplateItemLoginProcess = await exec('bw get template item.login');
	const bwItemLogin = JSON.parse(
		bwTemplateItemLoginProcess.stdout
	) as BitwardenLoginItem;
	bwItemLogin.username = username;
	bwItemLogin.password = password;
	bwItem.login = bwItemLogin;

	const base64Item = Buffer.from(JSON.stringify(bwItem)).toString('base64');
	await exec(`bw create item ${JSON.stringify(base64Item)}`);
}
