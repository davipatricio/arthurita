import type { Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { packetHandler as unknown_version_packetHandler } from './unknown/packetHandler';
import { packetHandler as v1_8_packetHandler } from './1.8/packetHandler';

export default function handleIncomingPacket(packet: UncompressedPacket, player: Player) {
  switch (player.version) {
    case -1:
      unknown_version_packetHandler(packet, player);
      break;
    case 47:
      v1_8_packetHandler(packet, player);
      break;
    default: {
      player.socket.destroy();
      break;
    }
  }
}
