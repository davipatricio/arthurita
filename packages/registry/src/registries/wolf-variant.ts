import { type AllNBTTags, NBTTagType, WritableNBT } from '@arthurita/nbt';
import registryData from '#assets/registry-data.json';
import type { CachedEntries } from '../types';

let cached: CachedEntries | null = null;

export namespace WolfVariant {
  export const Identifier = 'minecraft:wolf_variant' as const;

  export interface Payload {
    wild_texture: string;
    tame_texture: string;
    angry_texture: string;
    biomes: string;
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(registryData[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: WolfVariant.create(value)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'wild_texture',
          type: NBTTagType.String,
          payload: payload.wild_texture
        },
        {
          name: 'tame_texture',
          type: NBTTagType.String,
          payload: payload.tame_texture
        },
        {
          name: 'angry_texture',
          type: NBTTagType.String,
          payload: payload.angry_texture
        },
        {
          name: 'biomes',
          type: NBTTagType.String,
          payload: payload.biomes
        }
      ]
    };

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
