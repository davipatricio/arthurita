import type { ReadDataType } from './utils';
import { CONTINUE_BIT, SEGMENT_BITS } from './varint';

export function readVarLong(data: Buffer): ReadDataType<bigint> {
  let value = 0n;
  let shift = 0;
  let length = 0;
  let byte = 0;

  do {
    byte = data[length];
    value |= BigInt(byte & SEGMENT_BITS) << BigInt(shift);
    shift += 7;
    length++;
  } while (byte & CONTINUE_BIT);

  return { value, length };
}

export function writeVarLong(value: bigint) {
  const buffer: number[] = [];
  let valueCopy = value;

  do {
    let byte = valueCopy & BigInt(SEGMENT_BITS);
    valueCopy >>= 7n;

    if (valueCopy !== 0n) byte |= BigInt(CONTINUE_BIT);

    buffer.push(Number(byte));
  } while (valueCopy !== 0n);

  return Buffer.from(buffer);
}
