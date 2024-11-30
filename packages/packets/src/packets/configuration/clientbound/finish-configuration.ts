import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

export class ConfigurationClientboundFinishConfigurationPacket extends Packet {
  constructor() {
    super({ id: Protocol.configuration.clientbound['minecraft:finish_configuration'].protocol_id });
  }
}
