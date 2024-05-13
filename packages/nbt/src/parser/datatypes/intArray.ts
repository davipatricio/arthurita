import type { IntArrayTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTIntArray(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & IntArrayTag {
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

  const values: number[] = [];

  for (let i = 0; i < listLength; i++) {
    const value = buffer.subarray(offset, offset + 4).readInt32BE();
    offset += 4;

    values.push(value);
  }

  const intArray: IntArrayTag = {
    name,
    type: 'intArray',
    value: values
  };
  return { ...intArray, currentOffset: offset };
}
