import { ByteBuffer } from '@arthurita/encoding';
import { NBT } from '@arthurita/nbt';
import {
  ConfigurationClientboundFinishConfigurationPacket,
  ConfigurationClientboundKnownPacksPacket,
  ConfigurationClientboundPluginMessagePacket,
  ConfigurationServerboundAcknowledgeFinishConfigurationPacket,
  ConfigurationServerboundClientInformationPacket,
  ConfigurationServerboundKnownPacksPacket,
  ConfigurationServerboundPluginMessagePacket,
  HandshakingServerboundHandshakePacket,
  HandshakingServerboundPingRequestPacket,
  LoginClientboundLoginSuccessPacket,
  LoginServerboundLoginStartPacket,
  Packet,
  PlayClientboundLoginPacket,
  StatusClientboundPongResponsePacket,
  StatusClientboundStatusResponsePacket
} from '@arthurita/packets';
import { type Player, PlayerState } from '#structures/Player';
import { cachedRegistries } from '@arthurita/registry';

interface HandleIncomingPacketOptions {
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
      console.log('Play state');
      break;
    }
  }
}

function handleHandshakingPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case 0x00: {
      const pkt = new HandshakingServerboundHandshakePacket(packet.buffer);
      player.setState(pkt.nextState);
      break;
    }
  }
}

function handleStatusPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case 0x00: {
      const pkt = new StatusClientboundStatusResponsePacket({
        version: {
          name: '1.21.3',
          protocol: 768
        },
        players: {
          max: 2024,
          online: 1,
          sample: [{ name: 'thinkofdeath', id: 'a566329f-c907-48ee-8d71-d7ba5aa00d20' }]
        },
        description: {
          text: 'Hello, world!'
        }
      });

      player.sendPacket(pkt);
      break;
    }

    case 0x01: {
      const received = new HandshakingServerboundPingRequestPacket(packet.buffer);
      const pkt = new StatusClientboundPongResponsePacket({ timestamp: received.timestamp });
      player.sendPacket(pkt);
      player.socket.end();
      break;
    }
  }
}

function handleConfigurationPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case 0x00: {
      const clientInformationPacket = new ConfigurationServerboundClientInformationPacket(packet.buffer);
      player.metadata.client.locale = clientInformationPacket.locale;
      player.metadata.client.viewDistance = clientInformationPacket.viewDistance;
      player.metadata.client.chatMode = clientInformationPacket.chatMode;
      player.metadata.client.chatColors = clientInformationPacket.chatColors;
      player.metadata.client.displayedSkinParts = clientInformationPacket.displayedSkinParts;
      player.metadata.client.isCharacterRightHanded = clientInformationPacket.mainHand === 1;
      player.metadata.client.textFiltering = clientInformationPacket.enableTextFiltering;
      player.metadata.client.allowServerList = clientInformationPacket.allowServerListings;
      break;
    }

    case 0x02: {
      const configPluginMessagePacket = new ConfigurationServerboundPluginMessagePacket(packet.buffer);

      if (configPluginMessagePacket.channel === 'minecraft:brand') {
        const brand = configPluginMessagePacket.readString();
        player.metadata.client.brand = brand;
      }

      break;
    }
    case 0x03: {
      new ConfigurationServerboundAcknowledgeFinishConfigurationPacket(packet.buffer);
      player.setState(PlayerState.Play);

      const loginPlacket = new PlayClientboundLoginPacket({
        entityId: 1,
        dimensions: ['minecraft:overworld'],
        doLimitedCrafting: false,
        enableRespawnScreen: true,
        enforceSecureChat: false,
        gameMode: 0,
        hardcore: false,
        hasDeathLocation: false,
        // deathDimensionName: 'minecraft:overworld',
        // deathLocation: {
        //   x: 1,
        //   y: 2,
        //   z: 3
        // },
        hashedSeed: 3199999999n,
        isDebug: false,
        isFlat: false,
        maxPlayers: 2024,
        portalCooldown: 20,
        previousGameMode: 0,
        reducedDebugInfo: false,
        simulationDistance: 4,
        viewDistance: 4,
        currentDimensionType: 0,
        currentDimensionName: 'minecraft:overworld',
        seaLevel: 63
      });
      player.sendPacket(loginPlacket);

      const syncPlayerPosPacket = new Packet({ id: 1 });
      syncPlayerPosPacket.putDouble(1);
      syncPlayerPosPacket.putDouble(2);
      syncPlayerPosPacket.putDouble(3);
      syncPlayerPosPacket.putFloat(1);
      syncPlayerPosPacket.putFloat(1);
      syncPlayerPosPacket.putByte(0);
      syncPlayerPosPacket.putVarInt(1);
      // player.sendPacket(syncPlayerPosPacket);
      break;
    }
    case 0x07: {
      new ConfigurationServerboundKnownPacksPacket(packet.buffer);

      // send registries
      for (const registry of cachedRegistries) {
        const registryPacket = new Packet({ id: 0x07 });

        registryPacket.putString(registry.registryId);
        registryPacket.putVarInt(registry.entries.length);

        for (const entry of registry.entries) {
          registryPacket.putString(entry.entryId);

          if (entry.data instanceof NBT) {
            registryPacket.putBoolean(true);
            registryPacket.putBuffer(entry.data.networkBuffer);
            continue;
          }

          registryPacket.putBoolean(false);
        }

        player.sendPacket(registryPacket);
      }

      const finishConfigurationPacket = new ConfigurationClientboundFinishConfigurationPacket();
      player.sendPacket(finishConfigurationPacket);
      break;
    }
  }
}

function handleLoginPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case 0x00: {
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

    case 0x03: {
      player.setState(PlayerState.Configuration);

      const serverBrandPacket = new ConfigurationClientboundPluginMessagePacket({
        channel: 'minecraft:brand',
        data: new ByteBuffer().putString('arthurita|development').buffer
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
