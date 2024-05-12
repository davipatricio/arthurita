import type { ByteTag, ShortTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTShort(buffer: Buffer, currentOffset: number): ParseReturnOptions & ShortTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const value = buffer.subarray(offset, offset + 2).readInt16BE();
  offset += 2;

  const short: ShortTag = {
    name,
    type: 'short',
    value
  };
  return { ...short, currentOffset: offset };
}
