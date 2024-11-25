export class ByteBuffer {
  constructor(public buffer = Buffer.alloc(0)) {}

  advance(offset: number) {
    this.buffer = this.buffer.subarray(offset);
    return this;
  }

  allocate(size: number) {
    const oldData = this.buffer;

    this.buffer = Buffer.alloc(this.buffer.length + size);
    this.buffer.set(oldData);

    return this;
  }

  get length() {
    return this.buffer.length;
  }
}
