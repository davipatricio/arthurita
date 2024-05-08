import { MCServer } from '../dist/index.js';

const server = new MCServer({ port: 25565 });
await server.start();

console.log('[Minecraft Server] Listening on tcp/25565.');
