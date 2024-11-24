import { Packet } from '#structures/Packet';

interface ConfigurationClientboundPluginMessagePacketPayload {
  channel: string;
  data: Buffer;
}

export class ConfigurationClientboundPluginMessagePacket extends Packet {
  constructor(payload?: ConfigurationClientboundPluginMessagePacketPayload) {
    super({ id: 0x01 });

    if (payload) this.serialize(payload);
  }

  serialize(payload: ConfigurationClientboundPluginMessagePacketPayload) {
    this.putString(payload.channel);
    this.putBuffer(payload.data);
  }
}
