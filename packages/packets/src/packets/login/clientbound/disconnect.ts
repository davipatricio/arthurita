import { NBTTagType, WritableNBT } from '@arthurita/nbt';
import { Packet } from '#structures/Packet';

interface LoginClientboundDisconnectPacketPayload {
  reason: string;
}

export class LoginClientboundDisconnectPacket extends Packet {
  constructor(payload?: LoginClientboundDisconnectPacketPayload) {
    super({ id: 0x00 });

    if (payload) this.serialize(payload);
  }

  serialize(payload: LoginClientboundDisconnectPacketPayload) {
    const nbt = new WritableNBT().serialize({
      name: '',
      type: NBTTagType.String,
      payload: payload.reason
    });

    this.putNBT(nbt);
  }
}
