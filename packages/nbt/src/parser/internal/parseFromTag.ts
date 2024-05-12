import { type AllNBTTag, NBTTags } from '@/types/tags';
import { parseNBTByte, parseNBTCompound, parseNBTInt, parseNBTList, parseNBTLong, parseNBTShort, parseNBTString } from '../datatypes';
import type { ParseReturnOptions } from '../utils';

interface ParseFromTagOptions {
  currentOffset: number;
  id: number;
}

export function parseFromTag(buffer: Buffer, { id, currentOffset }: ParseFromTagOptions): AllNBTTag & ParseReturnOptions {
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
      const data = parseNBTShort(buffer, currentOffset);
      return data;
    }
    case NBTTags.Int: {
      const data = parseNBTInt(buffer, currentOffset);
      return data;
    }
    case NBTTags.Long: {
      const data = parseNBTLong(buffer, currentOffset);
      return data;
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
