import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeByte, writeDouble, writeFloat } from '@arthurita/encoding';

interface PlayClientboundPlayerPositionAndLookPayload {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  flags: number;
}

export class PlayClientboundPlayerPositionAndLookPacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly payload: PlayClientboundPlayerPositionAndLookPayload) {
    super();

    this.setID(0x08)._encode();
  }

  _encode() {
    const buffer = Buffer.from([
      // X
      ...writeDouble(this.payload.x),
      // Y
      ...writeDouble(this.payload.y),
      // Z
      ...writeDouble(this.payload.z),
      // Yaw
      ...writeFloat(this.payload.yaw),
      // Pitch
      ...writeFloat(this.payload.pitch),
      // Flags
      ...writeByte(this.payload.flags)
    ]);

    const data = Buffer.concat([buffer]);

    this.setData(data);
  }
}
