import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

interface PlayClientboundSyncPlayerPosPacketPayload {
  teleportId: number;

  x: number;
  y: number;
  z: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  yaw: number;
  pitch: number;
  flags: {
    relativeX: boolean;
    relativeY: boolean;
    relativeZ: boolean;
    relativeYaw: boolean;
    relativePitch: boolean;
    relativeVelocityX: boolean;
    relativeVelocityY: boolean;
    relativeVelocityZ: boolean;
    rotateVelocity: boolean;
  };
}

export class PlayClientboundSyncPlayerPosPacket extends Packet {
  constructor(payload?: PlayClientboundSyncPlayerPosPacketPayload) {
    super({ id: Protocol.Play.Clientbound.SynchronizePlayerPosition.Id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: PlayClientboundSyncPlayerPosPacketPayload) {
    this.putVarInt(payload.teleportId);
    this.putDouble(payload.x);
    this.putDouble(payload.y);
    this.putDouble(payload.z);

    this.putDouble(payload.velocityX);
    this.putDouble(payload.velocityY);
    this.putDouble(payload.velocityZ);

    this.putFloat(payload.yaw);
    this.putFloat(payload.pitch);

    this.putTeleportFlags(payload.flags);
  }
}
