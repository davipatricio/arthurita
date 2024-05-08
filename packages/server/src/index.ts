import { createServer } from 'node:net';
import { UncompressedPacket } from './structures/UncompressedPacket';
import { readString, readUnsignedShort, readVarInt } from '@arthurita/encoding';
import { PlayerState, UnknownPlayer } from './structures/UnknownPlayer';

const server = createServer();

server.on('connection', (socket) => {
  socket.on('data', (data) => {
    const player = new UnknownPlayer(socket);

    const packet = UncompressedPacket.fromBuffer(data);
    switch (player.state) {
      case PlayerState.Handshaking: {
        if (packet.id === 0x00) {
          let offset = 0;
          const protocolVersion = readVarInt(packet.data);
          offset += protocolVersion.length;

          const serverAddress = readString(packet.data.subarray(offset));
          offset += serverAddress.length;

          const serverPort = readUnsignedShort(packet.data.subarray(offset));
          offset += serverPort.length;

          const nextState = readVarInt(packet.data.subarray(offset));
          offset += nextState.length;

          console.log({
            protocolVersion: protocolVersion.value,
            serverAddress: serverAddress.value,
            serverPort: serverPort.value,
            nextState: nextState.value
          });
        }
      }
    }
  });
});

server.listen(25565, () => {
  console.log('Listening on 25565.');
});
