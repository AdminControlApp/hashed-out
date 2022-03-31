import { decipherHash } from '~/utils/hash.js';

const password = await decipherHash();
console.info(`The password is ${password}`);
