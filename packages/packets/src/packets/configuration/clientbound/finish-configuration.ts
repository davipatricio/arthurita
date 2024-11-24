import { Packet } from '#structures/Packet';

export class ConfigurationClientboundFinishConfigurationPacket extends Packet {
  constructor() {
    super({ id: 0x03 });
  }
}
