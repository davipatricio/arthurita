import type { UnknownPlayer } from '@/structures/UnknownPlayer';
import { readLong, writeLong, writeString, writeVarInt } from '@arthurita/encoding';
import type { UncompressedPacket } from '@arthurita/packets';

export function handleStatusRequest(_packet: UncompressedPacket, player: UnknownPlayer) {
  const data = {
    version: {
      name: '1.8.9',
      protocol: 47
    },
    players: {
      max: 100,
      online: 0,
      sample: []
    },
    description: {
      text: 'Hello world!\nMulti-line support with §a§lcolors!'
    },
    enforcesSecureChat: false,
    previewsChat: false
  };

  const packetId = writeVarInt(0);
  const string = writeString(JSON.stringify(data));

  player.socket.write(Buffer.from([...writeVarInt(packetId.length + string.length), ...packetId, ...string]));
}

export function handlePingRequest(packet: UncompressedPacket, player: UnknownPlayer) {
  const payload = readLong(packet.data);

  const packetId = writeVarInt(0x01);
  const packetData = writeLong(payload.value);

  player.socket.write(Buffer.from([...writeVarInt(packetId.length + packetData.length), ...packetId, ...packetData]));
  player.socket.destroy();
}
