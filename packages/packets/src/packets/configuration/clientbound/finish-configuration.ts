import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

export class ConfigurationClientboundFinishConfigurationPacket extends Packet {
  constructor() {
    super({ id: Protocol.Configuration.Clientbound.FinishConfiguration.Id });
  }
}
