export enum NBTTags {
  End = 0,
  Byte = 1,
  Short = 2,
  Int = 3,
  Long = 4,
  Float = 5,
  Double = 6,
  ByteArray = 7,
  String = 8,
  List = 9,
  Compound = 10,
  IntArray = 11,
  LongArray = 12
}

export type NBTTagNames =
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

export interface BaseNBTTag<Name extends NBTTagNames, Value> {
  name?: string | null;
  type: Name;
  value: Value;
}

interface ListTagContent {
  name?: string | null;
  type: 'list';
  value: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    value: any;
  }[];
  typeId: NBTTags;
}

export type ByteTag = BaseNBTTag<'byte', number>;
export type ShortTag = BaseNBTTag<'short', number>;
export type IntTag = BaseNBTTag<'int', number>;
export type LongTag = BaseNBTTag<'long', bigint>;
export type FloatTag = BaseNBTTag<'float', number>;
export type DoubleTag = BaseNBTTag<'double', number>;
export type ByteArrayTag = BaseNBTTag<'byteArray', number[]>;
export type StringTag = BaseNBTTag<'string', string>;
export type ListTag = ListTagContent;
export type IntArrayTag = BaseNBTTag<'intArray', number[]>;
export type LongArrayTag = BaseNBTTag<'longArray', bigint[]>;
export type CompoundTag = BaseNBTTag<'compound', AllNBTTag[]>;

export type AllNBTTag =
  | ByteTag
  | ShortTag
  | IntTag
  | LongTag
  | FloatTag
  | DoubleTag
  | ByteArrayTag
  | StringTag
  | ListTag
  | IntArrayTag
  | LongArrayTag
  | CompoundTag;
