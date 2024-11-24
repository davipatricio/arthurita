import { Packet } from '#structures/Packet';

export class LoginServerboundLoginStartPacket extends Packet {
  public username: string;
  public uuid: string;

  constructor(data: Buffer) {
    super({ id: 0x00, data });

    this.deserialize();
  }

  deserialize() {
    const username = this.readString();
    const uuid = this.readUUID();

    this.username = username;
    this.uuid = uuid;
  }
}
