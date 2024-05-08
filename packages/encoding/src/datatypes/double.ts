import type { ReadDataType } from './utils';

export function readDouble(buffer: Buffer): ReadDataType<number> {
  return { length: 8, value: buffer.readDoubleBE(0) };
}

export function writeDouble(value: number) {
  const buffer = Buffer.allocUnsafe(8);
  buffer.writeDoubleBE(value);

  return buffer;
}
