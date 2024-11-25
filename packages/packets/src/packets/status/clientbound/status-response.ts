import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

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
    super({ id: Protocol.Status.Clientbound.StatusResponse.Id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: StatusClientboundStatusResponsePacketPayload) {
    this.putString(JSON.stringify(payload));
  }
}
