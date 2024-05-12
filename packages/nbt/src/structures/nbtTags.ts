export enum NBTTags {
  TAG_End = 0,
  TAG_Byte = 1,
  TAG_Short = 2,
  TAG_Int = 3,
  TAG_Long = 4,
  TAG_Float = 5,
  TAG_Double = 6,
  TAG_Byte_Array = 7,
  TAG_String = 8,
  TAG_List = 9,
  TAG_Compound = 10,
  TAG_Int_Array = 11,
  TAG_Long_Array = 12
}

type NBTTagNames =
  | 'byte'
  | 'short'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'byteArray'
  | 'string'
  | 'list'
  | 'compound'
  | 'intArray'
  | 'longArray';

interface BaseNBTTag<Name extends NBTTagNames, Value> {
  name: string;
  type: Name;
  value: Value;
}

type ByteTag = BaseNBTTag<'byte', number>;
type ShortTag = BaseNBTTag<'short', number>;
type IntTag = BaseNBTTag<'int', number>;
type LongTag = BaseNBTTag<'long', bigint>;
type FloatTag = BaseNBTTag<'float', number>;
type DoubleTag = BaseNBTTag<'double', number>;
type ByteArrayTag = BaseNBTTag<'byteArray', number[]>;
type StringTag = BaseNBTTag<'string', string>;
type ListTag<T> = BaseNBTTag<'list', T[]>;
type IntArrayTag = BaseNBTTag<'intArray', number[]>;
type LongArrayTag = BaseNBTTag<'longArray', bigint[]>;
type CompoundTag = BaseNBTTag<'compound', AllNBTTag | []>;

type AllNBTTag<T = unknown> =
  | ByteTag
  | ShortTag
  | IntTag
  | LongTag
  | FloatTag
  | DoubleTag
  | ByteArrayTag
  | StringTag
  | ListTag<T>
  | IntArrayTag
  | LongArrayTag
  | CompoundTag;

// const rootCompound = new Map<string, CompoundTag>();

// rootCompound.set('A', {
//   name: 'root',
//   type: 'compound',
//   value: {
//     name: 'a',
//     type: 'compound',
//     value: {
//       name: 'b',
//       type: 'int',
//       value: 1
//     }
//   }
// });

interface ParseFromTagOptions {
  currentOffset: number;
  id: number;
}

interface ParseReturnOptions {
  currentOffset: number;
}

function _parseFromTag(buffer: Buffer, { id, currentOffset }: ParseFromTagOptions): AllNBTTag & ParseReturnOptions {
  switch (id) {
    case NBTTags.TAG_End: {
      // return {};
      console.log('tag end');
      break;
    }
    case NBTTags.TAG_Compound: {
      const data = parseNBTCompound(buffer, currentOffset);
      return data;
    }
    case NBTTags.TAG_String: {
      const data = parseNBTString(buffer, currentOffset);
      return data;
    }
    case NBTTags.TAG_List: {
      const data = parseNBTList(buffer, currentOffset);
      return data;
    }
    case NBTTags.TAG_Byte: {
      const data = parseNBTByte(buffer, currentOffset);
      return data;
    }
    default: {
      // return {};
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
  const isCompound = typeId === NBTTags.TAG_Compound;

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
