import { Packet } from '@/structures/Packet';

interface ConfigurationClientboundPluginMessagePacketPayload {
  channel: string;
  data: Buffer;
}

export class ConfigurationClientboundPluginMessagePacket extends Packet {
  constructor(payload?: ConfigurationClientboundPluginMessagePacketPayload) {
    super({ id: 0x01 });

    if (payload) this.setPayload(payload);
  }

  setPayload(payload: ConfigurationClientboundPluginMessagePacketPayload) {
    this.putString(payload.channel);
    this.putBuffer(payload.data);
  }
}
