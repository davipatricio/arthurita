import type { ReadDataType } from './utils';
import { CONTINUE_BIT, SEGMENT_BITS } from './varint';

export function readVarLong(buffer: Buffer): ReadDataType<bigint> {
  let result = 0n;
  let shift = 0;
  let length = 0;
  let byte = 0;

  do {
    byte = buffer[length++];
    result |= (BigInt(byte) & BigInt(SEGMENT_BITS)) << BigInt(shift);
    shift += 7;
  } while (byte & CONTINUE_BIT);

  let value = result >> 1n;

  //  Adjust for negative numbers
  if (result & 1n) value = BigInt(-value);

  return { length, value };
}

export function writeVarLong(value: bigint): Buffer {
  const bytes: number[] = [];
  let val = value < 0 ? (-value << 1n) | 1n : value << 1n;

  do {
    let byte = val & BigInt(SEGMENT_BITS);
    val >>= 7n;

    if (val !== 0n) {
      byte |= BigInt(CONTINUE_BIT);
    }

    bytes.push(Number(byte));
  } while (val !== 0n);

  const buffer = Buffer.from(bytes);
  return buffer;
}
