import { NBTTagType, WritableNBT, type AllNBTTags } from '@arthurita/nbt';
import type { CachedEntries } from '../registries/1.20.3-incomplete';
import bannerPatternRegistry from '#assets/banner-pattern.json';

let cached: CachedEntries | null = null;

export namespace BannerPattern {
  export const Identifier = 'minecraft:banner_pattern' as const;

  export interface Payload {
    asset_id: string;
    translation_key: string;
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(bannerPatternRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: BannerPattern.create(value)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'asset_id',
          type: NBTTagType.String,
          payload: payload.asset_id
        },
        {
          name: 'translation_key',
          type: NBTTagType.String,
          payload: payload.translation_key
        }
      ]
    };

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
