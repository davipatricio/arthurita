import { Packet } from '@/structures/Packet';

export class ConfigurationServerboundAcknowledgeFinishConfigurationPacket extends Packet {
  constructor(data: Buffer) {
    super({ id: 0x03, data });

    this.parse();
  }

  parse() {
    return;
  }
}
