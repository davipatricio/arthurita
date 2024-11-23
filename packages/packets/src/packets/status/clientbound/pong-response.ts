import { Packet } from '@/structures/Packet';

interface StatusClientboundPongResponsePacketPayload {
  timestamp: bigint;
}

export class StatusClientboundPongResponsePacket extends Packet {
  constructor(payload?: StatusClientboundPongResponsePacketPayload) {
    super({ id: 0x01 });

    if (payload) this.setPayload(payload);
  }

  setPayload(payload: StatusClientboundPongResponsePacketPayload) {
    this.putLong(payload.timestamp);
  }
}
