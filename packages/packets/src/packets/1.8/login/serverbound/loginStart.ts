import { UncompressedPacket } from '@/structures';
import type { ServerboundPacket } from '@/typings';
import { readString } from '@arthurita/encoding';

export class LoginServerboundLoginStartPacket extends UncompressedPacket implements ServerboundPacket {
  public playerName: string;
  public playerUuid: string;

  constructor(data: Buffer) {
    super();

    this.setID(0x00).setData(data)._decode();
  }

  toJSON() {
    return {
      playerName: this.playerName,
      playerUuid: this.playerUuid
    };
  }

  _decode() {
    let offset = 0;
    const playerName = readString(this.data);
    offset += playerName.length;

    const uuid = readString(this.data.subarray(offset));
    offset += uuid.length;

    this.playerName = playerName.value;
    this.playerUuid = uuid.value;
  }
}
