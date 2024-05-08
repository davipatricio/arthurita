import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeBoolean, writeByte, writeInt, writeString, writeUnsignedByte } from '@arthurita/encoding';

export class PlayClientboundJoinGamePacket extends UncompressedPacket implements ClientboundPacket {
  constructor() {
    super();

    this.setID(0x01)._encode();
  }

  _encode() {
    const entityId = writeInt(1);
    const gamemode = writeUnsignedByte(0);
    const dimension = writeByte(0);
    const difficulty = writeUnsignedByte(0);
    const maxPlayers = writeUnsignedByte(100);
    const levelType = writeString('default');
    const reducedDebugInfo = writeBoolean(false);

    const data = Buffer.concat([entityId, gamemode, dimension, difficulty, maxPlayers, levelType, reducedDebugInfo]);

    this.setData(data);
  }
}
