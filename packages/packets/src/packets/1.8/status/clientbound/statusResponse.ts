import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket, StatusResponsePayload } from '@/typings';
import { writeString } from '@arthurita/encoding';

export class StatusClientboundStatusResponsePacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly payload: StatusResponsePayload) {
    super();

    this.setID(0x00)._encode();
  }

  _encode() {
    const data = writeString(JSON.stringify(this.payload));
    this.setData(data);
  }
}
