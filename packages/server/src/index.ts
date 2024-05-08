import { createServer } from 'node:net';
import { UncompressedPacket } from '@arthurita/packets';
import { UnknownPlayer } from './structures/UnknownPlayer';
import handleIncomingPacket from './versions/packetHandler';

const server = createServer();

server.on('connection', (socket) => {
  console.log('connection');
  const player = new UnknownPlayer(socket);

  socket.on('data', (data) => {
    const packets = UncompressedPacket.fromBuffer(data);

    for (const packet of packets) {
      console.log(packet);
      handleIncomingPacket(packet, player);
    }
  });
});

server.listen(25565, () => {
  console.log('Listening on 25565.');
});
