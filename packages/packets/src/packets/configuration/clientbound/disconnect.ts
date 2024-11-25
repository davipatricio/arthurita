import { NBTTagType, WritableNBT } from '@arthurita/nbt';
import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

interface ConfigurationClientboundDisconnectPacketPayload {
  reason: string;
}

export class ConfigurationClientboundDisconnectPacket extends Packet {
  constructor(payload?: ConfigurationClientboundDisconnectPacketPayload) {
    super({ id: Protocol.Configuration.Clientbound.Disconnect.Id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: ConfigurationClientboundDisconnectPacketPayload) {
    const nbt = new WritableNBT().serialize({
      name: '',
      type: NBTTagType.String,
      payload: payload.reason
    });

    this.putNBT(nbt);
  }
}
