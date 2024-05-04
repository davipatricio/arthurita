import type { ReadDataType } from './utils';

export function readLong(buffer: Buffer): ReadDataType<bigint> {
  return { length: 8, value: buffer.readBigInt64LE(0) };
}

export function writeLong(value: number | bigint): Buffer {
  const buffer = Buffer.allocUnsafe(8);
  buffer.writeBigInt64LE(BigInt(value));
  return buffer;
}
