import { Packet } from '@/structures/Packet';

export class HandshakingServerboundPingRequestPacket extends Packet {
  public timestamp: bigint;

  constructor(data: Buffer) {
    super({ id: 0x01, data });

    this.parse();
  }

  parse() {
    const timestamp = this.readLong();
    this.timestamp = timestamp;
  }
}
