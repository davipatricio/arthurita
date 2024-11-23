import { Packet } from '@/structures/Packet';

export class ConfigurationServerboundPluginMessagePacket extends Packet {
  public channel: string;
  public data: Uint8Array;

  constructor(data: Buffer) {
    super({ id: 0x02, data });

    this.parse();
  }

  parse() {
    const channel = this.readString();

    this.channel = channel;
    this.data = new Uint8Array(this.buffer);
  }
}
