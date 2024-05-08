import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeByte, writeFloat } from '@arthurita/encoding';

interface PlayClientboundPlayerAbilitiesPayload {
  // TODO: Add flags
  flags: number;
  flyingSpeed: number;
  fieldOfViewModifier: number;
}

export class PlayClientboundPlayerAbilitiesPacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly payload: PlayClientboundPlayerAbilitiesPayload) {
    super();

    this.setID(0x39)._encode();
  }

  _encode() {
    const flags = writeByte(this.payload.flags);
    const flyingSpeed = writeFloat(this.payload.flyingSpeed);
    const fieldOfViewModifier = writeFloat(this.payload.fieldOfViewModifier);

    const data = Buffer.concat([flags, flyingSpeed, fieldOfViewModifier]);

    this.setData(data);
  }
}
