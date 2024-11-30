import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

export class ConfigurationServerboundPluginMessagePacket extends Packet {
  public channel: string;
  public data: Uint8Array;

  constructor(data: Buffer) {
    super({ id: Protocol.configuration.serverbound['minecraft:custom_payload'].protocol_id, data });

    this.deserialize();
  }

  deserialize() {
    this.channel = this.readString();
    this.data = new Uint8Array(this.buffer);
  }
}
