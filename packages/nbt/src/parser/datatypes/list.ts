import type { AllNBTTag, ListTag } from '@/types/tags';
import { parseFromTag } from '../internal/parseFromTag';
import type { ParseReturnOptions } from '../utils';

export function parseNBTList(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & ListTag<unknown> {
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

  const typeId = buffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  const listLength = buffer.subarray(offset, offset + 4).readInt32BE();
  offset += 4;

  let i = 0;
  const valuesToAppend: AllNBTTag[] = [];

  while (i < listLength) {
    const tag = parseFromTag(buffer, { id: typeId, currentOffset: offset, ignoreNames: true });
    offset = tag.currentOffset;

    valuesToAppend.push(tag);
    i++;
  }

  const tagList: ListTag<unknown> = {
    name,
    type: 'list',
    value: valuesToAppend
  };

  return { ...tagList, currentOffset: offset };
}
