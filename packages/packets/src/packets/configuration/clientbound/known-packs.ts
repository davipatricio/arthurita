import { Packet } from '@/structures/Packet';

type ConfigurationClientboundKnownPacksPacketPayload = {
  namespace: string;
  id: string;
  version: string;
}[];

export class ConfigurationClientboundKnownPacksPacket extends Packet {
  constructor(payload?: ConfigurationClientboundKnownPacksPacketPayload) {
    super({ id: 0x0e });

    if (payload) this.setPayload(payload);
  }

  setPayload(payload: ConfigurationClientboundKnownPacksPacketPayload) {
    this.putVarInt(payload.length);

    for (const pack of payload) {
      this.putString(pack.namespace);
      this.putString(pack.id);
      this.putString(pack.version);
    }
  }
}
