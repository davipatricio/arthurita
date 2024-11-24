import { NBTTagType, WritableNBT, type AllNBTTags } from '@arthurita/nbt';
import type { CachedEntries } from '../types';
import damageTypeRegistry from '#assets/damage-types.json';

let cached: CachedEntries | null = null;

export namespace DamageType {
  export const Identifier = 'minecraft:damage_type' as const;

  export interface Payload {
    message_id: string;
    scaling: string;
    exhaustion: number;
    effects?: string;
    deathMessageType?: string;
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(damageTypeRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: DamageType.create(value)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'message_id',
          type: NBTTagType.String,
          payload: payload.message_id
        },
        {
          name: 'scaling',
          type: NBTTagType.String,
          payload: payload.scaling
        },
        {
          name: 'exhaustion',
          type: NBTTagType.Float,
          payload: payload.exhaustion
        }
      ]
    };

    if (payload.effects) {
      data.payload.push({
        name: 'effects',
        type: NBTTagType.String,
        payload: payload.effects
      });
    }

    if (payload.deathMessageType) {
      data.payload.push({
        name: 'death_message_type',
        type: NBTTagType.String,
        payload: payload.deathMessageType
      });
    }

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
