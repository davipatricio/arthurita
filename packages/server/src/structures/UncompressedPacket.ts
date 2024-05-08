import { readVarInt, writeVarInt } from '@arthurita/encoding';

export class UncompressedPacket {
  public id = 0;
  public data = Buffer.from([]);

  constructor() {
    return;
  }

  setID(id: number) {
    this.id = id;
    return this;
  }

  setData(data: Buffer) {
    this.data = data;
    return this;
  }

  get length() {
    return readVarInt(writeVarInt(this.id)).length + readVarInt(writeVarInt(this.data.length)).length;
  }

  get lengthBuffer() {
    return writeVarInt(this.length);
  }

  static fromBuffer(buffer: Buffer) {
    let offset = 0;

    const packetLength = readVarInt(buffer);
    offset += packetLength.length;

    const packetId = readVarInt(buffer.subarray(packetLength.length));
    offset += packetId.length;

    const packetData = buffer.subarray(offset);

    return new UncompressedPacket().setID(packetId.value).setData(packetData);
  }
}
