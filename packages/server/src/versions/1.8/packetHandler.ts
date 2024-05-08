import { PlayerState, type Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { handlePingRequest, handleStatusRequest } from './status';

export function packetHandler(packet: UncompressedPacket, player: Player) {
  switch (player.state) {
    case PlayerState.Status: {
      handleStatusPackets(packet, player);
      break;
    }

    default: {
      console.log('unknown player state', player.state);
      player.socket.destroy();
      break;
    }
  }
}

function handleStatusPackets(packet: UncompressedPacket, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleStatusRequest(packet, player);
      break;
    case 0x01:
      handlePingRequest(packet, player);
      break;
  }
}
