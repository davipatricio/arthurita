import { NBTTagType, WritableNBT, type AllNBTTags } from '@arthurita/nbt';
import dimensionTypeRegistry from '#assets/dimension-types.json';
import type { CachedEntries } from '../types';

let cached: CachedEntries | null = null;

export namespace DimensionType {
  export const Identifier = 'minecraft:dimension_type' as const;

  export interface Payload {
    fixed_time?: number;
    has_skylight: number;
    has_ceiling: number;
    ultrawarm: number;
    natural: number;
    coordinate_scale: number;
    bed_works: number;
    respawn_anchor_works: number;
    min_y: number;
    height: number;
    logical_height: number;
    infiniburn: string;
    effects: string;
    ambient_light: number;
    piglin_safe: number;
    has_raids: number;
    monster_spawn_light_level?: number | { min_inclusive: number; max_inclusive: number; type: `minecraft:${string}` };
    monster_spawn_block_light_limit: number;
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(dimensionTypeRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: DimensionType.create(value as DimensionType.Payload)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'fixed_time',
          type: NBTTagType.Long,
          payload: BigInt(payload.fixed_time ?? 1600n)
        },
        {
          name: 'has_skylight',
          type: NBTTagType.Byte,
          payload: payload.has_skylight
        },
        {
          name: 'has_ceiling',
          type: NBTTagType.Byte,
          payload: payload.has_ceiling
        },
        {
          name: 'ultrawarm',
          type: NBTTagType.Byte,
          payload: payload.ultrawarm
        },
        {
          name: 'natural',
          type: NBTTagType.Byte,
          payload: payload.natural
        },
        {
          name: 'coordinate_scale',
          type: NBTTagType.Double,
          payload: payload.coordinate_scale
        },
        {
          name: 'bed_works',
          type: NBTTagType.Byte,
          payload: payload.bed_works
        },
        {
          name: 'respawn_anchor_works',
          type: NBTTagType.Byte,
          payload: payload.respawn_anchor_works
        },
        {
          name: 'min_y',
          type: NBTTagType.Int,
          payload: payload.min_y
        },
        {
          name: 'height',
          type: NBTTagType.Int,
          payload: payload.height
        },
        {
          name: 'logical_height',
          type: NBTTagType.Int,
          payload: payload.logical_height
        },
        {
          name: 'infiniburn',
          type: NBTTagType.String,
          payload: payload.infiniburn
        },
        {
          name: 'effects',
          type: NBTTagType.String,
          payload: payload.effects
        },
        {
          name: 'ambient_light',
          type: NBTTagType.Float,
          payload: payload.ambient_light
        },
        {
          name: 'piglin_safe',
          type: NBTTagType.Byte,
          payload: payload.piglin_safe
        },
        {
          name: 'has_raids',
          type: NBTTagType.Byte,
          payload: payload.has_raids
        },
        {
          name: 'monster_spawn_block_light_limit',
          type: NBTTagType.Int,
          payload: payload.monster_spawn_block_light_limit
        }
      ]
    };

    if (typeof payload.monster_spawn_light_level === 'number') {
      data.payload.push({
        name: 'monster_spawn_light_level',
        type: NBTTagType.Int,
        payload: payload.monster_spawn_light_level
      });
    }

    if (typeof payload.monster_spawn_light_level === 'object') {
      data.payload.push({
        name: 'monster_spawn_light_level',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'min_inclusive',
            type: NBTTagType.Int,
            payload: payload.monster_spawn_light_level.min_inclusive
          },
          {
            name: 'max_inclusive',
            type: NBTTagType.Int,
            payload: payload.monster_spawn_light_level.max_inclusive
          },
          {
            name: 'type',
            type: NBTTagType.String,
            payload: payload.monster_spawn_light_level.type
          }
        ]
      });
    }

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
