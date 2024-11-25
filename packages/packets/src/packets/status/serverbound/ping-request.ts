import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

export class StatusServerboundPingRequestPacket extends Packet {
  public timestamp: bigint;

  constructor(data: Buffer) {
    super({ id: Protocol.Status.Serverbound.PingRequest.Id, data });

    this.deserialize();
  }

  deserialize() {
    const timestamp = this.readLong();
    this.timestamp = timestamp;
  }
}
