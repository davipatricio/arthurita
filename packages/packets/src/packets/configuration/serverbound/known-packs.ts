import { Packet } from '@/structures/Packet';

export class ConfigurationServerboundKnownPacksPacket extends Packet {
  public knownPacksCount: number;
  public knownPacks: { namespace: string; id: string; version: string }[];

  constructor(data: Buffer) {
    super({ id: 0x07, data });

    this.deserialize();
  }

  deserialize() {
    const knownPacksCount = this.readVarInt();
    const knownPacks = [];

    for (let i = 0; i < knownPacksCount; i++) {
      const namespace = this.readString();
      const id = this.readString();
      const version = this.readString();

      knownPacks.push({ namespace, id, version });
    }
  }
}
