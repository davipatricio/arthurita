import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeLong } from '@arthurita/encoding';

export class StatusClientboundPingResponsePacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly payload: bigint) {
    super();

    this.setID(0x01)._encode();
  }

  _encode() {
    const data = writeLong(this.payload);
    this.setData(data);
  }
}
