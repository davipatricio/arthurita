import type { ReadDataType } from './utils';

export function readInt(buffer: Buffer): ReadDataType<number> {
  return { length: 4, value: buffer.readInt32BE(0) };
}

export function writeInt(value: number) {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeInt32BE(value);

  return buffer;
}
