import { readVarInt } from '@arthurita/encoding';

export class RawUncompressedPacket {
  public length: number;
  public packetId: number;
  public data: Buffer;

  public constructor(buffer: Buffer) {
    let offset = 0;

    const packetLength = readVarInt(buffer);
    this.length = packetLength.value;
    offset += packetLength.length;

    const packetId = readVarInt(buffer.subarray(offset));
    this.packetId = packetId.value;
    offset += packetId.length;

    this.data = buffer.subarray(offset);
  }
}
