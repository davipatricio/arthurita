import { type AllNBTTag, NBTTags } from '@/types/tags';
import { parseNBTByte, parseNBTCompound, parseNBTList, parseNBTString } from '../datatypes';
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
