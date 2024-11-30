import { type AllNBTTags, NBTTagType, WritableNBT } from '@arthurita/nbt';
import registryData from '#assets/registry-data.json';
import type { CachedEntries } from '../types';

let cached: CachedEntries | null = null;

export namespace ArmorTrimPattern {
  export const Identifier = 'minecraft:trim_pattern' as const;

  export interface Payload {
    asset_id: string;
    template_item: string;
    decal: number;
    description:
      | string
      | {
          translate: string;
        };
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(registryData[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: ArmorTrimPattern.create(value)
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
          name: 'template_item',
          type: NBTTagType.String,
          payload: payload.template_item
        },
        {
          name: 'decal',
          type: NBTTagType.Byte,
          payload: payload.decal
        }
      ]
    };

    if (typeof payload.description === 'string') {
      data.payload.push({
        name: 'description',
        type: NBTTagType.String,
        payload: payload.description
      });
    } else {
      data.payload.push({
        name: 'description',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'translate',
            type: NBTTagType.String,
            payload: payload.description.translate
          }
        ]
      });
    }

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
