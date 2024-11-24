import { Packet } from '@/structures/Packet';

interface PlayClientboundLoginPacketPayload {
  entityId: number;
  hardcore: boolean;
  dimensions: string[];
  maxPlayers: number;
  viewDistance: number;
  simulationDistance: number;
  reducedDebugInfo: boolean;
  enableRespawnScreen: boolean;
  doLimitedCrafting: boolean;
  currentDimensionType: number;
  currentDimensionName: string;
  hashedSeed: bigint;
  gameMode: number;
  previousGameMode: number;
  isDebug: boolean;
  isFlat: boolean;
  hasDeathLocation: boolean;
  deathDimensionName?: string;
  deathLocation?: {
    x: number;
    y: number;
    z: number;
  };
  portalCooldown: number;
  seaLevel: number;
  enforceSecureChat: boolean;
}

export class PlayClientboundLoginPacket extends Packet {
  constructor(payload?: PlayClientboundLoginPacketPayload) {
    super({ id: 0x2c });

    if (payload) this.serialize(payload);
  }

  serialize(payload: PlayClientboundLoginPacketPayload) {
    this.putInt(payload.entityId);
    this.putBoolean(payload.hardcore);

    this.putVarInt(payload.dimensions.length);
    for (const dimension of payload.dimensions) this.putString(dimension);

    this.putVarInt(payload.maxPlayers);
    this.putVarInt(payload.viewDistance);
    this.putVarInt(payload.simulationDistance);

    this.putBoolean(payload.reducedDebugInfo);
    this.putBoolean(payload.enableRespawnScreen);
    this.putBoolean(payload.doLimitedCrafting);

    this.putVarInt(payload.currentDimensionType);
    this.putString(payload.currentDimensionName);

    this.putLong(payload.hashedSeed);

    this.putUnsignedByte(payload.gameMode);
    this.putByte(payload.previousGameMode);

    this.putBoolean(payload.isDebug);
    this.putBoolean(payload.isFlat);
    this.putBoolean(payload.hasDeathLocation);

    if (payload.hasDeathLocation) {
      if (!payload.deathDimensionName || !payload.deathLocation)
        throw new Error('Death dimension name and location are required when hasDeathLocation is true');

      this.putString(payload.deathDimensionName);
      this.putPosition(payload.deathLocation);
    }

    this.putVarInt(payload.portalCooldown);
    this.putVarInt(payload.seaLevel);

    this.putBoolean(payload.enforceSecureChat);
  }
}
