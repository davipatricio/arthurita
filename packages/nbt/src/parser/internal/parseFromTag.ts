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
      const data = parseNBTByte(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.Short: {
      const data = parseNBTShort(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.Int: {
      const data = parseNBTInt(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.Long: {
      const data = parseNBTLong(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.Float: {
      const data = parseNBTFloat(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.Double: {
      const data = parseNBTDouble(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.ByteArray: {
      const data = parseNBTByteArray(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.String: {
      const data = parseNBTString(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.List: {
      const data = parseNBTList(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.Compound: {
      const data = parseNBTCompound(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.IntArray: {
      const data = parseNBTIntArray(buffer, currentOffset, ignoreNames);
      return data;
    }
    case NBTTags.LongArray: {
      const data = parseNBTLongArray(buffer, currentOffset, ignoreNames);
      return data;
    }
    default: {
      throw new Error(`Unknown tag id: ${id}`);
    }
  }
}
