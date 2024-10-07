import { MCServer } from '@/structures';

const server = new MCServer({ port: 25565, debugUnsupportedPackets: false });
await server.start();

console.log('[Minecraft Server] Listening on tcp/25565.');

server.on('serverListPing', (event) => {
  event.setDescription('Example of changing the server MOTD!');
});

server.on('playerJoin', (event) => {
  console.log(`[Minecraft Server] ${event.player.name} joined the server!`);
  server.broadcast('chatbox', `§e${event.player.name} joined the server.`);
});

server.on('playerQuit', (event) => {
  console.log(`[Minecraft Server] ${event.player.name} left the server!`);
  server.broadcast('chatbox', `§e${event.player.name} left the server.`);
});
