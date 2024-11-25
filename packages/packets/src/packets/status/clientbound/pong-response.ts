import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

interface StatusClientboundPongResponsePacketPayload {
  timestamp: bigint;
}

export class StatusClientboundPongResponsePacket extends Packet {
  constructor(payload?: StatusClientboundPongResponsePacketPayload) {
    super({ id: Protocol.Status.Clientbound.PongResponse.Id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: StatusClientboundPongResponsePacketPayload) {
    this.putLong(payload.timestamp);
  }
}
