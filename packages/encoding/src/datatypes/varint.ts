import type { ReadDataType } from './utils';

const SEGMENT_BITS = 0x7f as const;
const CONTINUE_BIT = 0x80 as const;

export function readVarInt(buffer: Buffer): ReadDataType<number> {
  let length = 0;
  let value = 0;

  while (true) {
    const byte = buffer.readUint8(length);
    value |= (byte & SEGMENT_BITS) << (7 * length);
    length++;

    if ((byte & CONTINUE_BIT) === 0) break;
  }

  return { length, value };
}

export function writeVarInt(value: number): Buffer {
  const buffer = Buffer.allocUnsafe(5);
  let length = 0;
  let varint = value;

  while (true) {
    const byte = varint & SEGMENT_BITS;
    varint >>= 7;
    if (varint === 0) {
      buffer.writeUint8(byte, length);
      break;
    }

    buffer.writeUint8(byte | CONTINUE_BIT, length);
    length++;
  }

  return buffer.subarray(0, length + 1);
}
