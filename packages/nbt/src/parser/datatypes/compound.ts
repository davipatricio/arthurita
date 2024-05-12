import { parseNBT } from '@/parser';
import type { CompoundTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTCompound(buffer: Buffer, currentOffset: number): ParseReturnOptions & CompoundTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const tag = parseNBT(buffer, offset);

  const compound: CompoundTag = {
    name,
    value: tag,
    type: 'compound'
  };

  return { ...compound, currentOffset: offset };
}
