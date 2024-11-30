import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

export class LoginServerboundLoginStartPacket extends Packet {
  public username: string;
  public uuid: string;

  constructor(data: Buffer) {
    super({ id: Protocol.login.serverbound['minecraft:hello'].protocol_id, data });

    this.deserialize();
  }

  deserialize() {
    const username = this.readString();
    const uuid = this.readUUID();

    this.username = username;
    this.uuid = uuid;
  }
}
