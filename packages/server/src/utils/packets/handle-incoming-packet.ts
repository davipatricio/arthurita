import { type Player, PlayerState } from '@/structures/Player';
import { ByteBuffer } from '@arthurita/encoding';
import { NBTTagType, WritableNBT } from '@arthurita/nbt';
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
  LoginClientboundLoginStartPacket,
  LoginServerboundLoginStartPacket,
  Packet,
  PlayClientboundLoginPacket,
  StatusClientboundPongResponsePacket,
  StatusClientboundStatusResponsePacket
} from '@arthurita/packets';

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
      }) as unknown as Packet;

      player.sendPacket(pkt);
      break;
    }

    case 0x01: {
      const received = new HandshakingServerboundPingRequestPacket(packet.buffer);
      const pkt = new StatusClientboundPongResponsePacket({ timestamp: received.timestamp }) as unknown as Packet;
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
      const configPluginMessagePacket = new ConfigurationServerboundPluginMessagePacket(
        packet.buffer
      ) as unknown as ConfigurationServerboundPluginMessagePacket & Packet;

      if (configPluginMessagePacket.channel === 'minecraft:brand') {
        const brand = configPluginMessagePacket.readString();
        player.metadata.client.brand = brand;
      }

      break;
    }
    case 0x03: {
      const _ackFinishConfigurationPacket = new ConfigurationServerboundAcknowledgeFinishConfigurationPacket(packet.buffer);
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
      }) as unknown as Packet;
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
      const _clientKnownPackets = new ConfigurationServerboundKnownPacksPacket(packet.buffer);

      // send registry
      const registryDimensionNBT = new WritableNBT().writeTag({
        type: NBTTagType.Compound,
        name: '',
        payload: [
          {
            name: 'fixed_time',
            type: NBTTagType.Long,
            payload: 6000n
          },
          {
            name: 'has_skylight',
            type: NBTTagType.Byte,
            payload: 1
          },
          {
            name: 'has_ceiling',
            type: NBTTagType.Byte,
            payload: 0
          },
          {
            name: 'ultrawarm',
            type: NBTTagType.Byte,
            payload: 0
          },
          {
            name: 'natural',
            type: NBTTagType.Byte,
            payload: 1
          },
          {
            name: 'coordinate_scale',
            type: NBTTagType.Double,
            payload: 1.0
          },
          {
            name: 'bed_works',
            type: NBTTagType.Byte,
            payload: 1
          },
          {
            name: 'respawn_anchor_works',
            type: NBTTagType.Byte,
            payload: 1
          },
          {
            name: 'min_y',
            type: NBTTagType.Int,
            payload: 0
          },
          {
            name: 'height',
            type: NBTTagType.Int,
            payload: 256
          },
          {
            name: 'logical_height',
            type: NBTTagType.Int,
            payload: 256
          },
          {
            name: 'infiniburn',
            type: NBTTagType.String,
            // payload: 'minecraft:infiniburn_overworld'
            payload: '#'
          },
          {
            name: 'effects',
            type: NBTTagType.String,
            payload: 'minecraft:overworld'
          },
          {
            name: 'ambient_light',
            type: NBTTagType.Float,
            payload: 0.0
          },
          {
            name: 'piglin_safe',
            type: NBTTagType.Byte,
            payload: 0
          },
          {
            name: 'has_raids',
            type: NBTTagType.Byte,
            payload: 1
          },
          {
            name: 'monster_spawn_light_level',
            type: NBTTagType.Int,
            payload: 7
          },
          {
            name: 'monster_spawn_block_light_limit',
            type: NBTTagType.Int,
            payload: 7
          }
        ]
      });

      const dimensionRegistryPacket = new Packet({
        id: 0x07
      });
      dimensionRegistryPacket.putString('minecraft:dimension_type');
      dimensionRegistryPacket.putVarInt(1);
      dimensionRegistryPacket.putString('minecraft:overworld');
      dimensionRegistryPacket.putBoolean(true);
      dimensionRegistryPacket.putBuffer(registryDimensionNBT.networkBuffer);
      player.sendPacket(dimensionRegistryPacket);

      const paintingRegistryPacket = new Packet({
        id: 0x07
      });
      paintingRegistryPacket.putString('minecraft:painting_variant');
      paintingRegistryPacket.putVarInt(1);
      paintingRegistryPacket.putString('minecraft:kebab');
      paintingRegistryPacket.putBoolean(false);
      player.sendPacket(paintingRegistryPacket);

      const wolfVariantRegistryPacket = new Packet({
        id: 0x07
      });
      wolfVariantRegistryPacket.putString('minecraft:wolf_variant');
      wolfVariantRegistryPacket.putVarInt(1);
      wolfVariantRegistryPacket.putString('minecraft:black');
      wolfVariantRegistryPacket.putBoolean(true);
      wolfVariantRegistryPacket.putBuffer(
        new WritableNBT().writeTag({
          type: NBTTagType.Compound,
          name: '',
          payload: [
            {
              name: 'wild_texture',
              type: NBTTagType.String,
              payload: 'minecraft:entity/wolf/wolf_black_angry'
            },
            {
              name: 'tame_texture',
              type: NBTTagType.String,
              payload: 'minecraft:entity/wolf/wolf_black_tame'
            },
            {
              name: 'angry_texture',
              type: NBTTagType.String,
              payload: 'minecraft:entity/wolf/wolf_black'
            },
            {
              name: 'biomes',
              type: NBTTagType.List,
              itemsType: NBTTagType.String,
              payload: [
                {
                  type: NBTTagType.String,
                  payload: 'minecraft:old_growth_pine_taiga'
                }
              ]
            }
          ]
        }).networkBuffer
      );
      player.sendPacket(wolfVariantRegistryPacket);

      const worldgenBiomeRegistryPacket = new Packet({
        id: 0x07
      });
      worldgenBiomeRegistryPacket.putString('minecraft:worldgen/biome');
      worldgenBiomeRegistryPacket.putVarInt(1);
      worldgenBiomeRegistryPacket.putString('minecraft:old_growth_pine_taiga');
      worldgenBiomeRegistryPacket.putBoolean(true);
      worldgenBiomeRegistryPacket.putBuffer(
        new WritableNBT().writeTag({
          type: NBTTagType.Compound,
          name: '',
          payload: [
            {
              type: NBTTagType.Byte,
              name: 'has_precipitation',
              payload: 1
            },
            {
              type: NBTTagType.Float,
              name: 'temperature',
              payload: 0.30000001192092896
            },
            {
              type: NBTTagType.Float,
              name: 'downfall',
              payload: 0.800000011920929
            },
            {
              type: NBTTagType.Compound,
              name: 'effects',
              payload: [
                {
                  type: NBTTagType.Int,
                  name: 'fog_color',
                  payload: 12638463
                },
                {
                  type: NBTTagType.Int,
                  name: 'water_color',
                  payload: 4159204
                },
                {
                  type: NBTTagType.Int,
                  name: 'water_fog_color',
                  payload: 4159204
                },
                {
                  type: NBTTagType.Int,
                  name: 'sky_color',
                  payload: 8168447
                },
                {
                  type: NBTTagType.Compound,
                  name: 'mood_sound',
                  payload: [
                    {
                      type: NBTTagType.Int,
                      name: 'block_search_extent',
                      payload: 8
                    },
                    {
                      type: NBTTagType.Double,
                      name: 'offset',
                      payload: 2.0
                    },
                    {
                      type: NBTTagType.String,
                      name: 'sound',
                      payload: 'minecraft:ambient.cave'
                    },
                    {
                      type: NBTTagType.Int,
                      name: 'tick_delay',
                      payload: 6000
                    }
                  ]
                },
                {
                  type: NBTTagType.Compound,
                  name: 'music',
                  payload: [
                    {
                      type: NBTTagType.Int,
                      name: 'max_delay',
                      payload: 24000
                    },
                    {
                      type: NBTTagType.Int,
                      name: 'min_delay',
                      payload: 12000
                    },
                    {
                      type: NBTTagType.Byte,
                      name: 'replace_current_music',
                      payload: 0
                    },
                    {
                      type: NBTTagType.String,
                      name: 'sound',
                      payload: 'minecraft:music.overworld.old_growth_taiga'
                    }
                  ]
                }
              ]
            }
          ]
        }).networkBuffer
      );
      player.sendPacket(worldgenBiomeRegistryPacket);

      const finishConfigurationPacket = new ConfigurationClientboundFinishConfigurationPacket() as unknown as Packet;
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

      const loginSuccessPacket = new LoginClientboundLoginStartPacket({
        username: player.username,
        uuid: player.uuid
      }) as unknown as Packet;
      player.sendPacket(loginSuccessPacket);
      break;
    }

    case 0x03: {
      player.setState(PlayerState.Configuration);

      const serverBrandPacket = new ConfigurationClientboundPluginMessagePacket({
        channel: 'minecraft:brand',
        data: new ByteBuffer().putString('arthurita|development').buffer
      }) as unknown as ConfigurationClientboundPluginMessagePacket & Packet;
      player.sendPacket(serverBrandPacket);

      const knownPackets = new ConfigurationClientboundKnownPacksPacket([
        { namespace: 'minecraft', id: 'core', version: '1.21.3' },
        { namespace: 'minecraft', id: 'core', version: '1.21.2' }
      ]) as unknown as ConfigurationClientboundKnownPacksPacket & Packet;
      player.sendPacket(knownPackets);
      break;
    }
  }
}
