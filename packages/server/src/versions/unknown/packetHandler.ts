import { PlayerState, type UnknownPlayer } from '@/structures/UnknownPlayer';
import type { UncompressedPacket } from '@arthurita/packets';
import { handleHandshake } from './handshake';

export function packetHandler(packet: UncompressedPacket, player: UnknownPlayer) {
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

function handleHandshakePackets(packet: UncompressedPacket, player: UnknownPlayer) {
  switch (packet.id) {
    case 0x00: {
      handleHandshake(packet, player);
      break;
    }
  }
}
