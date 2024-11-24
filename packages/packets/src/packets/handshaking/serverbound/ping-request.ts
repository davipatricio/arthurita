import { Packet } from '@/structures/Packet';

export class HandshakingServerboundPingRequestPacket extends Packet {
  public timestamp: bigint;

  constructor(data: Buffer) {
    super({ id: 0x01, data });

    this.deserialize();
  }

  deserialize() {
    const timestamp = this.readLong();
    this.timestamp = timestamp;
  }
}
