import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

interface ConfigurationClientboundPluginMessagePacketPayload {
  channel: string;
  data: Buffer;
}

export class ConfigurationClientboundPluginMessagePacket extends Packet {
  constructor(payload?: ConfigurationClientboundPluginMessagePacketPayload) {
    super({ id: Protocol.configuration.clientbound['minecraft:custom_payload'].protocol_id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: ConfigurationClientboundPluginMessagePacketPayload) {
    this.putString(payload.channel);
    this.putBuffer(payload.data);
  }
}
