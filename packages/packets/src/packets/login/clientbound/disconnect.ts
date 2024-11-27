import { NBTTagType, WritableNBT } from '@arthurita/nbt';
import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

interface LoginClientboundDisconnectPacketPayload {
  reason: string;
}

export class LoginClientboundDisconnectPacket extends Packet {
  constructor(payload?: LoginClientboundDisconnectPacketPayload) {
    super({ id: Protocol.login.clientbound['minecraft:login_disconnect'].protocol_id });

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
