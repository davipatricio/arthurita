import { UncompressedPacket } from '@/structures';
import type { ServerboundPacket } from '@/typings';

export class LoginServerboundLoginStartPacket extends UncompressedPacket implements ServerboundPacket {
  public playerName: string;
  public playerUuid: string;

  constructor(data: Buffer) {
    super();

    this.setID(0x00).setData(data)._decode();
  }

  toJSON() {
    return {
      playerName: this.playerName
    };
  }

  _decode() {
    // Apparently the player name is not prefixed by a length on 1.8.9
    this.playerName = this.data.toString();
  }
}
