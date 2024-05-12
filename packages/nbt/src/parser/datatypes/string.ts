import type { StringTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTString(buffer: Buffer, currentOffset: number): ParseReturnOptions & StringTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  const name = buffer.subarray(offset, offset + nameLength).toString();
  offset += name.length;

  const valueLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  const value = buffer.subarray(offset, offset + valueLength).toString();
  offset += value.length;

  const string: StringTag = {
    name,
    type: 'string',
    value
  };

  return { ...string, currentOffset: offset };
}
