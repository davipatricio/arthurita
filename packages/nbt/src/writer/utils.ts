import { type NBTTagNames, NBTTags } from '@/types/tags';

export function getNBTTypeId(type: NBTTagNames) {
  switch (type) {
    case 'byte':
      return NBTTags.Byte;
    case 'short':
      return NBTTags.Short;
    case 'int':
      return NBTTags.Int;
    case 'long':
      return NBTTags.Long;
    case 'float':
      return NBTTags.Float;
    case 'double':
      return NBTTags.Double;
    case 'byteArray':
      return NBTTags.ByteArray;
    case 'string':
      return NBTTags.String;
    case 'list':
      return NBTTags.List;
    case 'compound':
      return NBTTags.Compound;
    case 'intArray':
      return NBTTags.IntArray;
    case 'longArray':
      return NBTTags.LongArray;
    default:
      throw new Error(`Invalid NBT type: ${type}`);
  }
}
