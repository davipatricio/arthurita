import type { ReadDataType } from './utils';

export const SEGMENT_BITS = 0x7f as const;
export const CONTINUE_BIT = 0x80 as const;

export function readVarInt(buffer: Buffer): ReadDataType<number> {
  let result = 0;
  let shift = 0;
  let length = 0;
  let byte = 0;

  do {
    byte = buffer[length++];
    result |= (byte & SEGMENT_BITS) << shift;
    shift += 7;
  } while (byte & CONTINUE_BIT);

  let value = result >>> 1;

  //  Adjust for negative numbers
  if (result & 1) value = -value;

  return { length, value };
}

export function writeVarInt(value: number): Buffer {
  const result: number[] = [];
  let val = value < 0 ? (-value << 1) | 1 : value << 1;

  do {
    let byte = val & SEGMENT_BITS;
    val >>>= 7;

    if (val) byte |= CONTINUE_BIT;

    result.push(byte);
  } while (val);

  return Buffer.from(result);
}
