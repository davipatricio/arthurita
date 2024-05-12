import type { AllNBTTag, ByteTag, CompoundTag, ListTag, StringTag } from '@/types/tags';
import { NBTTags } from '@/types/tags';

interface ParseFromTagOptions {
  currentOffset: number;
  id: number;
}

interface ParseReturnOptions {
  currentOffset: number;
}

function _parseFromTag(buffer: Buffer, { id, currentOffset }: ParseFromTagOptions): AllNBTTag & ParseReturnOptions {
  switch (id) {
    case NBTTags.End: {
      // return {};
      console.log('tag end');
      break;
    }
    case NBTTags.Byte: {
      const data = parseNBTByte(buffer, currentOffset);
      return data;
    }
    case NBTTags.Short: {
      throw new Error('Not implemented');
    }
    case NBTTags.Int: {
      throw new Error('Not implemented');
    }
    case NBTTags.Long: {
      throw new Error('Not implemented');
    }
    case NBTTags.Float: {
      throw new Error('Not implemented');
    }
    case NBTTags.Double: {
      throw new Error('Not implemented');
    }
    case NBTTags.ByteArray: {
      throw new Error('Not implemented');
    }
    case NBTTags.String: {
      const data = parseNBTString(buffer, currentOffset);
      return data;
    }
    case NBTTags.List: {
      const data = parseNBTList(buffer, currentOffset);
      return data;
    }
    case NBTTags.Compound: {
      const data = parseNBTCompound(buffer, currentOffset);
      return data;
    }
    case NBTTags.IntArray: {
      throw new Error('Not implemented');
    }
    case NBTTags.LongArray: {
      throw new Error('Not implemented');
    }
    default: {
      break;
    }
  }

  // @ts-expect-error
  return { currentOffset };
}

export function parseNBT(buffer: Buffer, currentOffset = 0) {
  let offset = currentOffset;

  if (currentOffset === 0) {
    console.log('Full buffer', buffer);
  }

  const id = buffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  return _parseFromTag(buffer, { id, currentOffset: offset });
}

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

export function parseNBTByte(buffer: Buffer, currentOffset: number): ParseReturnOptions & ByteTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const value = buffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  const byte: ByteTag = {
    name,
    type: 'byte',
    value
  };
  return { ...byte, currentOffset: offset };
}

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

    const tag = _parseFromTag(buffer, { id, currentOffset: offset });
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
