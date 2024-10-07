import { UncompressedPacket } from '@/structures';
import type { ServerboundPacket } from '@/typings';
import { readString } from '@arthurita/encoding';

// https://wiki.vg/index.php?title=Plugin_channels&oldid=7435
export class PlayServerboundPluginMessagePacket extends UncompressedPacket implements ServerboundPacket {
  public channel: string;
  public payload: Buffer;

  constructor(data: Buffer) {
    super(data);

    this.setID(0x17)._decode();
  }

  toJSON() {
    return {
      channel: this.channel,
      payload: this.payload
    };
  }

  _decode() {
    let offset = 0;
    const channel = readString(this.data);
    offset += channel.length;

    this.channel = channel.value;
  }
}
