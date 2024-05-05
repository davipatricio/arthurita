import type { ReadDataType } from './utils';

export function readFloat(buffer: Buffer): ReadDataType<number> {
  return { length: 4, value: Number.parseFloat(buffer.readFloatLE(0).toFixed(6)) };
}

export function writeFloat(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeFloatLE(value);
  return buffer;
}
