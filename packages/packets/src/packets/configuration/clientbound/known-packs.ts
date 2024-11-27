import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

type ConfigurationClientboundKnownPacksPacketPayload = {
  namespace: string;
  id: string;
  version: string;
}[];

export class ConfigurationClientboundKnownPacksPacket extends Packet {
  constructor(payload?: ConfigurationClientboundKnownPacksPacketPayload) {
    super({ id: Protocol.configuration.clientbound['minecraft:select_known_packs'].protocol_id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: ConfigurationClientboundKnownPacksPacketPayload) {
    this.putVarInt(payload.length);

    for (const pack of payload) {
      this.putString(pack.namespace);
      this.putString(pack.id);
      this.putString(pack.version);
    }
  }
}
