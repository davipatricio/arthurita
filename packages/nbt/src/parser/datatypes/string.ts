import type { StringTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTString(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & StringTag {
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

  const valueLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  const value = buffer.subarray(offset, offset + valueLength).toString();
  offset += valueLength;

  const string: StringTag = {
    name,
    type: 'string',
    value
  };

  return { ...string, currentOffset: offset };
}
