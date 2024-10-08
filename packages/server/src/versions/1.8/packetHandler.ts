import { type Player, PlayerState } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { handleLoginStart } from './login';
import { handleClientSettings, handleKeepAlive } from './play';
import { handlePingRequest, handleStatusRequest } from './status';

// https://wiki.vg/index.php?title=Protocol&oldid=7368
// https://wiki.vg/index.php?title=Protocol_FAQ&oldid=8076

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
    default: {
      if (player.server.options.debugUnsupportedPackets) {
        console.log(`Player sent an unsupported packet. State: status | Packet Id ${packet.id}`);
      }
      break;
    }
  }
}

function handleLoginPackets(packet: UncompressedPacket, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleLoginStart(packet, player);
      break;
    default: {
      if (player.server.options.debugUnsupportedPackets) {
        console.log(`Player sent an unsupported packet. State: login | Packet Id ${packet.id}`);
      }
      break;
    }
  }
}

function handlePlayPackets(packet: UncompressedPacket, player: Player) {
  switch (packet.id) {
    case 0x00:
      handleKeepAlive(packet, player);
      break;
    case 0x17:
      // TODO: Plugin Message MC|Brand
      break;
    case 0x15:
      handleClientSettings(packet, player);
      break;
    case 0x04:
      // TODO: Update Player position
      break;
    case 0x06:
      // TODO: Player Position And Look
      break;
    default: {
      if (player.server.options.debugUnsupportedPackets) {
        console.log(`Player sent an unsupported packet. State: play | Packet Id ${packet.id}`);
      }
      break;
    }
  }
}
