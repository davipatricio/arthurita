import { type AllNBTTag, type ListTag, NBTTags } from '@/types/tags';
import { parseFromTag } from '../internal/parseFromTag';
import type { ParseReturnOptions } from '../utils';

export function parseNBTList(buffer: Buffer, currentOffset: number): ParseReturnOptions & ListTag<unknown> {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';
  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += name.length;
  }

  const typeId = buffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  const listLength = buffer.subarray(offset, offset + 4).readInt32BE();
  offset += 4;

  console.log('>', buffer.subarray(offset));

  const listValues: AllNBTTag[] = [];
  const isCompound = typeId === NBTTags.Compound;

  if (isCompound) {
    listValues.push({
      name: '',
      type: 'compound',
      value: []
    });
  }

  let i = 0;
  let valuesToAppend: AllNBTTag[] = [];

  while (i < listLength) {
    const id = buffer.subarray(offset, offset + 1).readUint8();
    offset += 1;

    if (id === 0) {
      i++;
      if (isCompound) (listValues[0].value as AllNBTTag[][]).push([...valuesToAppend]);
      else listValues.push(...valuesToAppend);
      valuesToAppend = [];
      continue;
    }

    const tag = parseFromTag(buffer, { id, currentOffset: offset });
    offset = tag.currentOffset;

    valuesToAppend.push(tag);
  }

  const tagList: ListTag<unknown> = {
    name,
    type: 'list',
    value: listValues
  };

  return { ...tagList, currentOffset: offset };
}
