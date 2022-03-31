import fastify from 'fastify';
import { WebsocketServer } from 'ws';

const app = fastify();

app.post('/', () => {
	const wss = new WebsocketServer({
		port: 8080,
	})
});



