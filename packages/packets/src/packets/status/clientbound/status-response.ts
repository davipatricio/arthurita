import { Packet } from '@/structures/Packet';

interface StatusClientboundStatusResponsePacketPayload {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample: {
      name: string;
      id: string;
    }[];
  };
  description: {
    text: string;
  };
}

export class StatusClientboundStatusResponsePacket extends Packet {
  constructor(payload?: StatusClientboundStatusResponsePacketPayload) {
    super({ id: 0x00 });

    if (payload) this.setPayload(payload);
  }

  setPayload(payload: StatusClientboundStatusResponsePacketPayload) {
    this.putString(JSON.stringify(payload));
  }
}
