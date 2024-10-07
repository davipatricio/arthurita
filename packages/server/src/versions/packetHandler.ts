import type { Player } from '@/structures';
import type { UncompressedPacket } from '@arthurita/packets';
import { packetHandler as unknown_version_packetHandler } from './unknown/packetHandler';

export default function handleIncomingPacket(packet: UncompressedPacket, player: Player) {
  switch (player.version) {
    case -1:
      unknown_version_packetHandler(packet, player);
      break;
    case 47: {
      const { packetHandler } = require('./1.8/packetHandler') as typeof import('./1.8/packetHandler');
      packetHandler(packet, player);
      break;
    }
    default: {
      player.socket.destroy();
      break;
    }
  }
}
