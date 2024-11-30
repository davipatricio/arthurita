export enum NBTTagType {
  End = 0,
  Byte = 1,
  Short = 2,
  Int = 3,
  Long = 4,
  Float = 5,
  Double = 6,
  Byte_Array = 7,
  String = 8,
  List = 9,
  Compound = 10,
  Int_Array = 11,
  Long_Array = 12
}

export interface NBTTag<Type extends NBTTagType = NBTTagType, Payload = unknown> {
  type: Type;
  name?: string;
  payload: Payload;
}

export type NBTTagCompound = NBTTag<NBTTagType.Compound, AllNBTTags[]>;
export type NBTTagByteArray = NBTTag<NBTTagType.Byte_Array, number[]>;
export type NBTTagIntArray = NBTTag<NBTTagType.Int_Array, number[]>;
export type NBTTagLongArray = NBTTag<NBTTagType.Long_Array, bigint[]>;
export type NBTTagString = NBTTag<NBTTagType.String, string>;
export type NBTTagEnd = Omit<NBTTag<NBTTagType.End, null>, 'name'>;
export type NBTTagByte = NBTTag<NBTTagType.Byte, number>;
export type NBTTagShort = NBTTag<NBTTagType.Short, number>;
export type NBTTagInt = NBTTag<NBTTagType.Int, number>;
export type NBTTagLong = NBTTag<NBTTagType.Long, bigint>;
export type NBTTagFloat = NBTTag<NBTTagType.Float, number>;
export type NBTTagDouble = NBTTag<NBTTagType.Double, number>;

export type NBTTagUnknownList = NBTTag<NBTTagType.List, unknown[]> & { itemsType: NBTTagType };
type NBTTagIntList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Int };
type NBTTagFloatList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Float };
type NBTTagDoubleList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Double };
type NBTTagLongList = NBTTag<NBTTagType.List, bigint[]> & { itemsType: NBTTagType.Long };
type NBTTagByteList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Byte };
type NBTTagShortList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Short };
type NBTTagStringList = NBTTag<NBTTagType.List, string[]> & { itemsType: NBTTagType.String };
type NBTTagCompoundList = NBTTag<NBTTagType.List, AllNBTTags[]> & { itemsType: NBTTagType.Compound };
type NBTTagByteArrayList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Byte_Array };
type NBTTagIntArrayList = NBTTag<NBTTagType.List, number[]> & { itemsType: NBTTagType.Int_Array };
type NBTTagLongArrayList = NBTTag<NBTTagType.List, bigint[]> & { itemsType: NBTTagType.Long_Array };
type NBTTagEndList = NBTTag<NBTTagType.List, null[]> & { itemsType: NBTTagType.End };

export type NBTTagList =
  | NBTTagUnknownList
  | NBTTagIntList
  | NBTTagFloatList
  | NBTTagDoubleList
  | NBTTagLongList
  | NBTTagByteList
  | NBTTagShortList
  | NBTTagStringList
  | NBTTagCompoundList
  | NBTTagByteArrayList
  | NBTTagIntArrayList
  | NBTTagLongArrayList
  | NBTTagEndList;

export type AllNBTTags =
  | NBTTagList
  | NBTTagByte
  | NBTTagShort
  | NBTTagInt
  | NBTTagLong
  | NBTTagFloat
  | NBTTagDouble
  | NBTTagByteArray
  | NBTTagString
  | NBTTagCompound
  | NBTTagIntArray
  | NBTTagLongArray
  | NBTTagEnd;
