import { NBT } from '@arthurita/nbt';
import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

interface ConfigurationClientboundRegistryDataPacketPayload {
  registryId: string;
  entries: {
    entryId: string;
    data: NBT | Buffer;
  }[];
}

export class ConfigurationClientboundRegistryDataPacket extends Packet {
  constructor(payload?: ConfigurationClientboundRegistryDataPacketPayload) {
    super({ id: Protocol.Configuration.Clientbound.RegistryData.Id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: ConfigurationClientboundRegistryDataPacketPayload) {
    this.putString(payload.registryId);
    this.putVarInt(payload.entries.length);

    for (const entry of payload.entries) {
      this.putString(entry.entryId);

      if (!(entry.data instanceof NBT) && !(entry.data instanceof Buffer)) {
        this.putBoolean(false);
        continue;
      }

      this.putBoolean(true);
      this.putBuffer(entry.data instanceof NBT ? entry.data.networkBuffer : entry.data);
    }
  }
}
