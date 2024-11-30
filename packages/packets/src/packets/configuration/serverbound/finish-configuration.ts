import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

export class ConfigurationServerboundFinishConfigurationPacket extends Packet {
  constructor(data: Buffer) {
    super({ id: Protocol.configuration.serverbound['minecraft:finish_configuration'].protocol_id, data });

    this.deserialize();
  }

  deserialize() {
    return;
  }
}
