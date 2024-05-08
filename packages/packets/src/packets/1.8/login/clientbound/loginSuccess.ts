import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { readUUID, writeString, writeUUID } from '@arthurita/encoding';

export class LoginClientboundLoginSuccessPacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly username: string) {
    super();

    this.setID(0x02)._encode();
  }

  _encode() {
    const uuid = writeString(readUUID(writeUUID(this.username)).value);
    const username = writeString(this.username);

    this.setData(Buffer.concat([uuid, username]));
  }
}
