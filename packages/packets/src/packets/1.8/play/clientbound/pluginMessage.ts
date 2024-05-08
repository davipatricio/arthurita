import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeString } from '@arthurita/encoding';

export class PlayClientboundPluginMessagePacket extends UncompressedPacket implements ClientboundPacket {
  constructor(
    public readonly channel: string,
    public readonly payload: Buffer
  ) {
    super();

    this.setID(0x3f)._encode();
  }

  _encode() {
    const buffer = Buffer.from([
      // Channel
      ...writeString(this.channel),
      // Data
      ...this.payload
    ]);

    const data = Buffer.concat([buffer]);

    this.setData(data);
  }
}
