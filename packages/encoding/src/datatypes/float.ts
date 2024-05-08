import type { ReadDataType } from './utils';

export function readFloat(buffer: Buffer): ReadDataType<number> {
  return { length: 4, value: Number.parseFloat(buffer.readFloatBE(0).toFixed(6)) };
}

export function writeFloat(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(4);
  buffer.writeFloatBE(value);

  return buffer;
}
