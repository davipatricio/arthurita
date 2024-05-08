import { PlayerState, type Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { handleLoginStart } from './login';
import { handleClientSettings } from './play';
import { handlePingRequest, handleStatusRequest } from './status';

export function packetHandler(packet: UncompressedPacket, player: Player) {
  switch (player.state) {
    case PlayerState.Status: {
      handleStatusPackets(packet, player);
      break;
    }

    case PlayerState.Login: {
      handleLoginPackets(packet, player);
      break;
    }

    case PlayerState.Play: {
      handlePlayPackets(packet, player);
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

function handleLoginPackets(packet: UncompressedPacket, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleLoginStart(packet, player);
      break;
  }
}

function handlePlayPackets(packet: UncompressedPacket, player: Player) {
  console.log(packet.id);
  switch (packet.id) {
    case 0x15:
      handleClientSettings(packet, player);
      break;
  }
}
