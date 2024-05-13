import { type AllNBTTag, type CompoundTag, NBTTags } from '@/types/tags';
import { parseFromTag } from '../internal/parseFromTag';
import type { ParseReturnOptions } from '../utils';

export function parseNBTCompound(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & CompoundTag {
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

  const compoundValues: AllNBTTag[] = [];

  while (true) {
    const id = buffer.subarray(offset, offset + 1).readUint8();
    offset += 1;

    if (id === NBTTags.End) break;

    const tag = parseFromTag(buffer, { id, currentOffset: offset });
    offset = tag.currentOffset;

    compoundValues.push(tag);
  }

  const compound: CompoundTag = {
    name,
    value: compoundValues,
    type: 'compound'
  };

  return { ...compound, currentOffset: offset };
}
