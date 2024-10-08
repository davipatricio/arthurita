import { UncompressedPacket } from '@/structures';
import type { ServerboundPacket } from '@/typings';
import { readVarInt } from '@arthurita/encoding';

export class PlayServerboundKeepAlivePacket extends UncompressedPacket implements ServerboundPacket {
  public keepAliveId: number;

  constructor(data: Buffer) {
    super(data);

    this.setID(0x00)._decode();
  }

  toJSON() {
    return {
      keepAliveId: this.keepAliveId
    };
  }

  _decode() {
    let offset = 0;
    const keepAliveId = readVarInt(this.data);
    offset += keepAliveId.length;

    this.keepAliveId = keepAliveId.value;
  }
}
