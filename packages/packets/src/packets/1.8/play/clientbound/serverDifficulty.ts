import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket, ServerDifficulty } from '@/typings';
import { writeUnsignedByte } from '@arthurita/encoding';

export class PlayClientboundServerDifficultyPacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly difficulty: ServerDifficulty) {
    super();

    this.setID(0x41)._encode();
  }

  _encode() {
    const difficulty = writeUnsignedByte(this.difficulty);

    const data = Buffer.concat([difficulty]);

    this.setData(data);
  }
}
