export type BitwardenLoginItem = {
	uris: string[];
	username: string;
	password: string;
	totp: string;
};

export type BitwardenItem = {
	organizationId: string | null;
	collectionIds: string[] | null;
	folderId: string | null;
	type: number;
	name: string;
	notes: string;
	favorite: false;
	fields: string[];
	login: BitwardenLoginItem;
	secureNote: string | null;
	card: string | null;
	identity: string | null;
	reprompt: number;
};
