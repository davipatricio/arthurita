import type { ReadDataType } from './utils';

export function readShort(buffer: Buffer): ReadDataType<number> {
  return { length: 2, value: buffer.readInt16LE(0) };
}

export function writeShort(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(2);
  buffer.writeInt16LE(value);
  return buffer;
}

export { writeShort as writeUnsignedShort, readShort as readUnsignedShort };
