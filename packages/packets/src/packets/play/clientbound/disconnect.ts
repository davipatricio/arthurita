import { NBTTagType, WritableNBT } from '@arthurita/nbt';
import { Packet } from '#structures/Packet';

interface PlayClientboundDisconnectPacketPayload {
  reason: string;
}

export class PlayClientboundDisconnectPacket extends Packet {
  constructor(payload?: PlayClientboundDisconnectPacketPayload) {
    super({ id: 0x1d });

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
