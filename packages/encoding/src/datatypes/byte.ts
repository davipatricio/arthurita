import type { ReadDataType } from './utils';

export function readByte(buffer: Buffer): ReadDataType<number> {
  return { length: 1, value: buffer.readUint8(0) };
}

export function writeByte(value: number): Buffer {
  return Buffer.from([value]);
}

export { readByte as readUnsignedByte, writeByte as writeUnsignedByte };
