import type { IntTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTInt(buffer: Buffer, currentOffset: number): ParseReturnOptions & IntTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const value = buffer.subarray(offset, offset + 4).readInt32BE();
  offset += 4;

  const int: IntTag = {
    name,
    type: 'int',
    value
  };
  return { ...int, currentOffset: offset };
}
