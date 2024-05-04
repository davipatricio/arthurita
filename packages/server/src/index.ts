import { createServer } from 'node:net';
import { RawUncompressedPacket } from './structures/RawPacket';

const server = createServer();

server.on('connection', (socket) => {
  console.log('connection');

  socket.on('data', (data) => {
    const packet = new RawUncompressedPacket(data);
    console.log(packet);
  });
});

server.listen(25565, () => {
  console.log('Listening on 25565.');
});
