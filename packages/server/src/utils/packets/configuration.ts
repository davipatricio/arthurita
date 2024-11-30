import {
  ConfigurationClientboundFinishConfigurationPacket,
  ConfigurationClientboundRegistryDataPacket,
  ConfigurationServerboundClientInformationPacket,
  ConfigurationServerboundFinishConfigurationPacket,
  ConfigurationServerboundKnownPacksPacket,
  ConfigurationServerboundPluginMessagePacket,
  Packet,
  PlayClientboundLoginPacket,
  PlayClientboundSyncPlayerPosPacket
} from '@arthurita/packets';
import { getCachedRegistries } from '@arthurita/registry';
import { PlayerState } from '#structures/Player';
import type { HandleIncomingPacketOptions } from './handle-incoming';
import Protocol from '@arthurita/packets/src/utils/packets';

const configurationPackets = Protocol.configuration.serverbound;

function getPacketId<T extends keyof typeof configurationPackets>(resource: T) {
  return configurationPackets[resource as T].protocol_id;
}

export function handleConfigurationPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case getPacketId('minecraft:client_information'): {
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

    case getPacketId('minecraft:custom_payload'): {
      const configPluginMessagePacket = new ConfigurationServerboundPluginMessagePacket(packet.buffer);

      if (configPluginMessagePacket.channel === 'minecraft:brand') {
        const brand = configPluginMessagePacket.readString();
        player.metadata.client.brand = brand;
      }

      break;
    }
    case getPacketId('minecraft:finish_configuration'): {
      new ConfigurationServerboundFinishConfigurationPacket(packet.buffer);
      player.setState(PlayerState.Play);

      const loginPlacket = new PlayClientboundLoginPacket({
        entityId: 1,
        dimensions: ['minecraft:overworld'],
        doLimitedCrafting: false,
        enableRespawnScreen: true,
        enforceSecureChat: false,
        gameMode: 1,
        hardcore: false,
        hasDeathLocation: false,
        deathDimensionName: 'minecraft:overworld',
        deathLocation: {
          x: 1,
          y: 2,
          z: 3
        },
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

      const syncPlayerPosPacket = new PlayClientboundSyncPlayerPosPacket({
        teleportId: 54548,
        x: 1500,
        y: 500,
        z: 1500,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        yaw: 0,
        pitch: 0,
        flags: {
          relativeX: false,
          relativeY: false,
          relativeZ: false,
          relativeYaw: false,
          relativePitch: false,
          relativeVelocityX: false,
          relativeVelocityY: false,
          relativeVelocityZ: false,
          rotateVelocity: false
        }
      });
      player.sendPacket(syncPlayerPosPacket);

      // random uuid
      const playerInfoUpdate = new Packet({ id: 0x40 })
        .putByte(0x01)
        .putVarInt(1)
        .putUUID('00000000-0000-0000-0000-000000000000')
        .putString('my name is')
        .putVarInt(0);
      player.sendPacket(playerInfoUpdate);

      const gameEventTest = new Packet({ id: 0x23 }).putUnsignedByte(13).putFloat(0);
      player.sendPacket(gameEventTest);

      const centerChunkTest = new Packet({ id: 88 }).putVarInt(0).putVarInt(0);
      player.sendPacket(centerChunkTest);

      break;
    }
    case getPacketId('minecraft:select_known_packs'): {
      new ConfigurationServerboundKnownPacksPacket(packet.buffer);

      for (const registry of getCachedRegistries()) player.sendPacket(new ConfigurationClientboundRegistryDataPacket(registry));

      const finishConfigurationPacket = new ConfigurationClientboundFinishConfigurationPacket();
      player.sendPacket(finishConfigurationPacket);
      break;
    }
  }
}
