import { NBT } from '@arthurita/nbt';
import {
  ConfigurationClientboundFinishConfigurationPacket,
  ConfigurationServerboundAcknowledgeFinishConfigurationPacket,
  ConfigurationServerboundClientInformationPacket,
  ConfigurationServerboundKnownPacksPacket,
  ConfigurationServerboundPluginMessagePacket,
  Packet,
  PlayClientboundLoginPacket
} from '@arthurita/packets';
import { Protocol } from '@arthurita/packets/src/utils/packets';
import { getCachedRegistries } from '@arthurita/registry';
import { PlayerState } from '#structures/Player';
import type { HandleIncomingPacketOptions } from './handle-incoming';

export function handleConfigurationPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case Protocol.Configuration.Serverbound.ClientInformation.Id: {
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

    case Protocol.Configuration.Serverbound.PluginMessage.Id: {
      const configPluginMessagePacket = new ConfigurationServerboundPluginMessagePacket(packet.buffer);

      if (configPluginMessagePacket.channel === 'minecraft:brand') {
        const brand = configPluginMessagePacket.readString();
        player.metadata.client.brand = brand;
      }

      break;
    }
    case Protocol.Configuration.Serverbound.AcknowledgeFinishConfiguration.Id: {
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

      const syncPlayerPosPacket = new Packet({ id: 0x42 });
      syncPlayerPosPacket.putVarInt(1024); // teleport id
      syncPlayerPosPacket.putDouble(1); // x
      syncPlayerPosPacket.putDouble(2); // y
      syncPlayerPosPacket.putDouble(3); // z

      syncPlayerPosPacket.putDouble(0); // velocity x
      syncPlayerPosPacket.putDouble(0); // velocity y
      syncPlayerPosPacket.putDouble(0); // velocity z

      syncPlayerPosPacket.putFloat(1); //yaw
      syncPlayerPosPacket.putFloat(1); // pitch
      syncPlayerPosPacket.putTeleportFlags({
        relativePitch: false,
        relativeYaw: false,
        relativeVelocityX: false,
        relativeX: false,
        relativeY: false,
        relativeZ: false,
        relativeVelocityY: false,
        relativeVelocityZ: false,
        rotateVelocity: false
      }); // teleport flags
      player.sendPacket(syncPlayerPosPacket);
      break;
    }
    case Protocol.Configuration.Serverbound.KnownPacks.Id: {
      new ConfigurationServerboundKnownPacksPacket(packet.buffer);

      // send registries
      for (const registry of getCachedRegistries()) {
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
