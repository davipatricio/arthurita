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

  // a single buffer can have multiple packets together, so we need to subarray the packetdata and loop to get multiple packets, then return an array with all created packets
  static fromBuffer(buffer: Buffer) {
    const packets: UncompressedPacket[] = [];
    let offset = 0;

    while (offset < buffer.length) {
      const packetLength = readVarInt(buffer);
      offset += packetLength.length;

      const packetId = readVarInt(buffer.subarray(packetLength.length));
      offset += packetId.length;

      const packetData = buffer.subarray(offset, offset + packetLength.value);
      offset += packetLength.value;

      packets.push(new UncompressedPacket().setID(packetId.value).setData(packetData));
    }

    return packets;
  }
}
