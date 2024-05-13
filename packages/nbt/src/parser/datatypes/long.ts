import type { LongTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTLong(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & LongTag {
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

  const value = buffer.subarray(offset, offset + 8).readBigInt64BE();
  offset += 8;

  const long: LongTag = {
    name,
    type: 'long',
    value
  };
  return { ...long, currentOffset: offset };
}
