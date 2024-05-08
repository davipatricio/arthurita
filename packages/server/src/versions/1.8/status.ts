import type { UnknownPlayer } from '@/structures/UnknownPlayer';
import { readLong } from '@arthurita/encoding';
import type { UncompressedPacket } from '@arthurita/packets';
import { getVersionPackets } from '@arthurita/packets';

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

export function handleStatusRequest(_packet: UncompressedPacket, player: UnknownPlayer) {
  const packets = getVersionPackets(player.version);
  const packet = new packets.StatusClientboundStatusResponsePacket(data);

  player.sendPacket(packet);
}

export function handlePingRequest(packet: UncompressedPacket, player: UnknownPlayer) {
  const packets = getVersionPackets(player.version);
  const payload = readLong(packet.data);

  const responsePacket = new packets.StatusClientboundPingResponsePacket(payload.value);

  player.sendPacket(responsePacket);
  player.socket.destroy();
}
