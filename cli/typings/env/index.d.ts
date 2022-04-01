declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'production' | 'development';
			SERVER_WS_URL: string;
		}
	}
}

export {};