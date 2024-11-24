import { ByteBuffer } from '@arthurita/encoding';

export class NBT extends ByteBuffer {
  get networkBuffer() {
    // @ts-expect-error
    return Buffer.concat([this.buffer.subarray(0, 1), this.buffer.subarray(3)]);
  }
}
