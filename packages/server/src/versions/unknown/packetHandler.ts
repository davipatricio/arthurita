import { PlayerState, type Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { handleHandshake } from './handshake';

export function packetHandler(packet: UncompressedPacket, player: Player) {
  switch (player.state) {
    case PlayerState.Handshaking: {
      handleHandshakePackets(packet, player);
      break;
    }

    default: {
      player.socket.destroy();
      break;
    }
  }
}

function handleHandshakePackets(packet: UncompressedPacket, player: Player) {
  switch (packet.id) {
    case 0x00: {
      handleHandshake(packet, player);
      break;
    }
  }
}
