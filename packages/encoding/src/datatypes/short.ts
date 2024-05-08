import type { ReadDataType } from './utils';

export function readShort(buffer: Buffer): ReadDataType<number> {
  return { length: 2, value: buffer.readInt16BE() };
}

export function writeShort(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(2);
  buffer.writeInt16BE(value);

  return buffer;
}

export function readUnsignedShort(buffer: Buffer): ReadDataType<number> {
  return { length: 2, value: buffer.readUint16BE() };
}

export function writeUnsignedShort(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(2);
  buffer.writeUint16BE(value);

  return buffer;
}
