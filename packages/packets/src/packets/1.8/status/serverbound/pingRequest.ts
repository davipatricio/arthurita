import { UncompressedPacket } from '@/structures';
import type { ServerboundPacket } from '@/typings';
import { readLong } from '@arthurita/encoding';

export class StatusServerboundPingRequestPacket extends UncompressedPacket implements ServerboundPacket {
  public payload: bigint;

  constructor(data: Buffer) {
    super(data);

    this.setID(0x01)._decode();
  }

  toJSON() {
    return {
      payload: this.payload
    };
  }

  _decode() {
    let offset = 0;
    const payload = readLong(this.data);
    offset += payload.length;

    this.payload = payload.value;
  }
}
