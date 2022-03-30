/**
 * Updates the user's password and saves the hash in Bitwarden
 */

import process from 'node:process';
import dayjs from 'dayjs';
import isRoot from 'is-root';
import { createHash } from '~/utils/hash.js';
import * as bw from '~/utils/bitwarden.js';
import * as macos from '~/utils/macos.js';
import 'dotenv/config';

if (!isRoot()) {
	console.error('This command should be run with root.');
	process.exit(1);
}

await bw.ensureLoggedIn();
const hash = await createHash();
await bw.createItem({
	itemName: `Admin Password Hash on ${dayjs().format('DD/MM/YYYY')}`,
	username: 'admin',
	password: hash,
});
await macos.changePassword(hash);
