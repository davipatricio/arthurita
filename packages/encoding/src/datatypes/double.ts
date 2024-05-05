import type { ReadDataType } from './utils';

export function readDouble(buffer: Buffer): ReadDataType<number> {
  return { length: 8, value: buffer.readDoubleLE(0) };
}

export function writeDouble(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(8);
  buffer.writeDoubleLE(value);
  return buffer;
}
