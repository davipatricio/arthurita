import type { Packet } from '@arthurita/packets';
import { type Player, PlayerState } from '#structures/Player';
import { handleConfigurationPackets } from './configuration';
import { handleHandshakingPackets } from './handshaking';
import { handleLoginPackets } from './login';
import { handleStatusPackets } from './status';

export interface HandleIncomingPacketOptions {
  player: Player;
  packet: Packet;
}

export function handleIncomingPacket({ player, packet }: HandleIncomingPacketOptions) {
  switch (player.state) {
    case PlayerState.Handshaking: {
      handleHandshakingPackets({ player, packet });
      break;
    }
    case PlayerState.Status: {
      handleStatusPackets({ player, packet });
      break;
    }
    case PlayerState.Configuration: {
      handleConfigurationPackets({ player, packet });
      break;
    }
    case PlayerState.Login: {
      handleLoginPackets({ player, packet });
      break;
    }
    case PlayerState.Play: {
      break;
    }
  }
}
