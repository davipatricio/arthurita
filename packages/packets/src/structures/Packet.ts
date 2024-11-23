import { ByteBuffer } from '@arthurita/encoding';

export class Packet extends ByteBuffer {
  public id: number;

  constructor({ id, data }: { id: number; data?: Buffer }) {
    super(data ?? Buffer.alloc(0));

    this.id = id;
  }

  public setData(data: Buffer) {
    this.buffer = data;
    return this;
  }

  public get payload() {
    const dataBuffer = new ByteBuffer();

    dataBuffer.putVarInt(this.id);
    dataBuffer.putBuffer(this.buffer);

    const payloadBuffer = new ByteBuffer();
    payloadBuffer.putVarInt(dataBuffer.buffer.length);
    payloadBuffer.putBuffer(dataBuffer.buffer);

    return payloadBuffer.buffer;
  }

  public static from(buf: Buffer) {
    const packets: Packet[] = [];
    const byteBuffer = new ByteBuffer(buf);

    while (byteBuffer.buffer.length > 0) {
      const packetLength = byteBuffer.readVarInt();

      const initialBufferLength = byteBuffer.buffer.length;
      const packetId = byteBuffer.readVarInt();
      const packetIdLength = initialBufferLength - byteBuffer.buffer.length;

      const dataLength = packetLength - packetIdLength;
      const packetData = byteBuffer.buffer.subarray(0, dataLength);
      byteBuffer.advance(dataLength);

      const packet = new Packet({ id: packetId, data: packetData });
      packets.push(packet);
    }

    return packets;
  }
}
