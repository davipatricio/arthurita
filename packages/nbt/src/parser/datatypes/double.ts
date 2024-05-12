import type { DoubleTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTDouble(buffer: Buffer, currentOffset: number): ParseReturnOptions & DoubleTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const value = buffer.subarray(offset, offset + 8).readDoubleBE();
  offset += 8;

  const double: DoubleTag = {
    name,
    type: 'double',
    value
  };
  return { ...double, currentOffset: offset };
}
