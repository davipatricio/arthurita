import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeString } from '@arthurita/encoding';

export interface StatusResponsePayload {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample: {
      id: string;
      name: string;
    }[];
  };
  description: {
    text: string;
  };
  enforcesSecureChat: boolean;
  previewsChat: boolean;
  favicon?: string;
}

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
