import type { FloatTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTFloat(buffer: Buffer, currentOffset: number): ParseReturnOptions & FloatTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const value = buffer.subarray(offset, offset + 4).readFloatBE();
  offset += 4;

  const float: FloatTag = {
    name,
    type: 'float',
    value
  };
  return { ...float, currentOffset: offset };
}
