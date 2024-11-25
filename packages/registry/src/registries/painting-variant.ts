import { type AllNBTTags, NBTTagType, WritableNBT } from '@arthurita/nbt';
import paintingVariantRegistry from '#assets/painting-variants.json';
import type { CachedEntries } from '../types';

let cached: CachedEntries | null = null;

export namespace PaintingVariant {
  export const Identifier = 'minecraft:painting_variant' as const;

  export interface Payload {
    asset_id: string;
    width: number;
    height: number;
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(paintingVariantRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: PaintingVariant.create(value)
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
          name: 'width',
          type: NBTTagType.Int,
          payload: payload.width
        },
        {
          name: 'height',
          type: NBTTagType.Int,
          payload: payload.height
        }
      ]
    };

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
