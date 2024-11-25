import { Packet } from '#structures/Packet';
import { Protocol } from '#utils/packets';

export class ConfigurationServerboundAcknowledgeFinishConfigurationPacket extends Packet {
  constructor(data: Buffer) {
    super({ id: Protocol.Configuration.Serverbound.AcknowledgeFinishConfiguration.Id, data });

    this.deserialize();
  }

  deserialize() {
    return;
  }
}
