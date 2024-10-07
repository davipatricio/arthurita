import { readVarInt, writeVarInt } from '@arthurita/encoding';

export class UncompressedPacket {
  public id = 0;

  constructor(public data = Buffer.from([])) {}

  setID(id: number) {
    this.id = id;
    return this;
  }

  setData(data: Buffer) {
    this.data = data;
    return this;
  }

  toBuffer() {
    const _packetId = writeVarInt(this.id);

    return Buffer.concat([this.lengthBuffer, _packetId, this.data]);
  }

  get length() {
    const _packetId = writeVarInt(this.id);
    const _packetLength = writeVarInt(_packetId.length + this.data.length);
    return readVarInt(_packetLength).value;
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
