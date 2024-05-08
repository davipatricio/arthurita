import type { ReadDataType } from './utils';

export const SEGMENT_BITS = 0x7f as const;
export const CONTINUE_BIT = 0x80 as const;

export function readVarInt(data: Buffer): ReadDataType<number> {
  let value = 0;
  let shift = 0;
  let length = 0;
  let byte = 0;

  do {
    byte = data[length];
    value |= (byte & SEGMENT_BITS) << shift;
    shift += 7;
    length++;
  } while (byte & CONTINUE_BIT);

  return { value, length };
}

export function writeVarInt(value: number) {
  const buffer: number[] = [];
  let valueCopy = value;

  do {
    let byte = valueCopy & SEGMENT_BITS;
    valueCopy >>>= 7;

    if (valueCopy !== 0) byte |= CONTINUE_BIT;

    buffer.push(byte);
  } while (valueCopy !== 0);

  return Buffer.from(buffer);
}
