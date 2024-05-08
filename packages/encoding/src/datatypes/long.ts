import type { ReadDataType } from './utils';

export function readLong(buffer: Buffer): ReadDataType<bigint> {
  return { length: 8, value: buffer.readBigInt64BE(0) };
}

export function writeLong(value: number | bigint) {
  const buffer = Buffer.allocUnsafe(8);
  buffer.writeBigInt64BE(BigInt(value));

  return buffer;
}
