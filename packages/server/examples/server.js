import { MCServer } from '../dist/index.js';

const server = new MCServer({ port: 25565 });
await server.start();

console.log('[Minecraft Server] Listening on tcp/25565.');

server.on('serverListPing', (event) => {
  event.setDescription('Example of changing the server MOTD!');
});
