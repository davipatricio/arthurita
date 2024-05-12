import type { LongArrayTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTLongArray(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & LongArrayTag {
  let offset = currentOffset;
  let name = null;

  if (!ignoreNames) {
    name = '';

    const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
    offset += 2;

    if (nameLength > 0) {
      name = buffer.subarray(offset, offset + nameLength).toString();
      offset += nameLength;
    }
  }

  const listLength = buffer.subarray(offset, offset + 4).readInt32BE();
  offset += 4;

  const values: bigint[] = [];

  for (let i = 0; i < listLength; i++) {
    const value = buffer.subarray(offset, offset + 8).readBigInt64BE();
    offset += 8;

    values.push(value);
  }

  const longArray: LongArrayTag = {
    name,
    type: 'longArray',
    value: values
  };
  return { ...longArray, currentOffset: offset };
}
