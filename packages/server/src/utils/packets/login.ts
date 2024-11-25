import { WritableByteBuffer } from '@arthurita/encoding';
import {
  ConfigurationClientboundKnownPacksPacket,
  ConfigurationClientboundPluginMessagePacket,
  LoginClientboundLoginSuccessPacket,
  LoginServerboundLoginStartPacket
} from '@arthurita/packets';
import { Protocol } from '@arthurita/packets/src/utils/packets';
import { PlayerState } from '#structures/Player';
import type { HandleIncomingPacketOptions } from './handle-incoming';

export function handleLoginPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case Protocol.Login.Serverbound.LoginStart.Id: {
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

    case Protocol.Login.Serverbound.PluginResponse.Id: {
      player.setState(PlayerState.Configuration);

      const serverBrandPacket = new ConfigurationClientboundPluginMessagePacket({
        channel: 'minecraft:brand',
        data: new WritableByteBuffer().putString('arthurita|development').buffer
      });
      player.sendPacket(serverBrandPacket);

      const knownPackets = new ConfigurationClientboundKnownPacksPacket([
        { namespace: 'minecraft', id: 'core', version: '1.21.3' },
        { namespace: 'minecraft', id: 'core', version: '1.21.2' }
      ]);
      player.sendPacket(knownPackets);
      break;
    }
  }
}
