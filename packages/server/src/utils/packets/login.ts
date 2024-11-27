import { WritableByteBuffer } from '@arthurita/encoding';
import {
  ConfigurationClientboundKnownPacksPacket,
  ConfigurationClientboundPluginMessagePacket,
  LoginClientboundLoginSuccessPacket,
  LoginServerboundLoginStartPacket
} from '@arthurita/packets';
import { PlayerState } from '#structures/Player';
import type { HandleIncomingPacketOptions } from './handle-incoming';
import Protocol from '@arthurita/packets/src/utils/packets';

const loginPackets = Protocol.login.serverbound;

function getPacketId<T extends keyof typeof loginPackets>(resource: T) {
  return loginPackets[resource as T].protocol_id;
}

export function handleLoginPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case getPacketId('minecraft:hello'): {
      const loginStartPacket = new LoginServerboundLoginStartPacket(packet.buffer);
      player.username = loginStartPacket.username;
      player.uuid = loginStartPacket.uuid;

      const loginSuccessPacket = new LoginClientboundLoginSuccessPacket({
        username: player.username,
        uuid: player.uuid
      });
      player.sendPacket(loginSuccessPacket);
      break;
    }

    case getPacketId('minecraft:login_acknowledged'): {
      player.setState(PlayerState.Configuration);

      const serverBrandPacket = new ConfigurationClientboundPluginMessagePacket({
        channel: 'minecraft:brand',
        data: new WritableByteBuffer().putString('arthurita|development').buffer
      });
      player.sendPacket(serverBrandPacket);

      const knownPackets = new ConfigurationClientboundKnownPacksPacket([{ namespace: 'minecraft', id: 'core', version: '1.21.3' }]);
      player.sendPacket(knownPackets);
      break;
    }
  }
}
