import { type AllNBTTag, NBTTags } from '@/types/tags';
import {
  parseNBTByte,
  parseNBTByteArray,
  parseNBTCompound,
  parseNBTDouble,
  parseNBTFloat,
  parseNBTInt,
  parseNBTIntArray,
  parseNBTList,
  parseNBTLong,
  parseNBTLongArray,
  parseNBTShort,
  parseNBTString
} from '../datatypes';
import type { ParseReturnOptions } from '../utils';

interface ParseFromTagOptions {
  currentOffset: number;
  id: number;
  ignoreNames?: boolean;
}

export function parseFromTag(
  buffer: Buffer,
  { id, currentOffset, ignoreNames = false }: ParseFromTagOptions
): AllNBTTag & ParseReturnOptions {
  switch (id) {
    case NBTTags.Byte: {
      return parseNBTByte(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.Short: {
      return parseNBTShort(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.Int: {
      return parseNBTInt(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.Long: {
      return parseNBTLong(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.Float: {
      return parseNBTFloat(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.Double: {
      return parseNBTDouble(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.ByteArray: {
      return parseNBTByteArray(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.String: {
      return parseNBTString(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.List: {
      return parseNBTList(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.Compound: {
      return parseNBTCompound(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.IntArray: {
      return parseNBTIntArray(buffer, currentOffset, ignoreNames);
    }
    case NBTTags.LongArray: {
      return parseNBTLongArray(buffer, currentOffset, ignoreNames);
    }
    default: {
      throw new Error(`Unknown tag id: ${id}`);
    }
  }
}
