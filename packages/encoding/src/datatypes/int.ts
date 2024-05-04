import type { ReadDataType } from './utils';

export function readInt(buffer: Buffer): ReadDataType<number> {
  return { length: 4, value: buffer.readInt32LE(0) };
}

export function writeInt(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeInt32LE(value);
  return buffer;
}
