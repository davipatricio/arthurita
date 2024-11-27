import { NBTTagType, WritableNBT } from '@arthurita/nbt';
import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

interface PlayClientboundDisconnectPacketPayload {
  reason: string;
}

export class PlayClientboundDisconnectPacket extends Packet {
  constructor(payload?: PlayClientboundDisconnectPacketPayload) {
    super({ id: Protocol.play.clientbound['minecraft:disconnect'].protocol_id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: PlayClientboundDisconnectPacketPayload) {
    const nbt = new WritableNBT().serialize({
      name: '',
      type: NBTTagType.String,
      payload: payload.reason
    });

    this.putNBT(nbt);
  }
}
