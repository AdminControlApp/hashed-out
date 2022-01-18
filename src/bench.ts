import bcrypt from 'bcrypt';
import { succ } from 'succ-js';

const possibleStrings = [];
let nextString = 'aaa';
while (nextString.length === 3) {
	possibleStrings.push(nextString);
	nextString = succ(nextString);
}

const hash = await bcrypt.hash('pod', 10);

for (const str of possibleStrings) {
	console.log(str);
	await bcrypt.compare(str, hash);
}

console.log(possibleStrings);