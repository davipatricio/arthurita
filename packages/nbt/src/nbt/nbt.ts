import { WritableByteBuffer } from '@arthurita/encoding';

export class NBT extends WritableByteBuffer {
  get networkBuffer() {
    const dataBuffer = new WritableByteBuffer();

    dataBuffer.putBuffer(this.buffer.subarray(0, 1));
    dataBuffer.putBuffer(this.buffer.subarray(3));

    return dataBuffer.buffer;
  }
}
