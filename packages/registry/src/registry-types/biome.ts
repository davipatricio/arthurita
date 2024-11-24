import { NBTTagType, WritableNBT, type AllNBTTags, type NBTTagCompound } from '@arthurita/nbt';
import biomesRegistry from '#assets/biomes.json';
import type { CachedEntries } from '../registries/1.20.3-incomplete';

let cached: CachedEntries | null = null;

export namespace Biome {
  export const Identifier = 'minecraft:worldgen/biome' as const;

  export interface Payload {
    has_precipitation: number;
    temperature: number;
    downfall: number;
    effects: {
      fog_color: number;
      water_color: number;
      water_fog_color: number;
      sky_color: number;
      foliage_color?: number;
      grass_color?: number;
      grass_color_modifier?: string;
      particle?: Particle;
      ambient_sound?: string;
      mood_sound?: MoodSound;
      additions_sound?: AdditionsSound;
      music?: Music;
    };
  }

  interface Particle {
    options: ParticleOptions;
    probability: number;
  }

  interface ParticleOptions {
    type: string;
    value?: number;
  }

  interface MoodSound {
    block_search_extent: number;
    offset: number;
    sound: string;
    tick_delay: number;
  }

  interface AdditionsSound {
    sound: string;
    tick_chance: number;
  }

  interface Music {
    sound: string;
    min_delay: number;
    max_delay: number;
    replace_current_music: number;
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(biomesRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: Biome.create(value)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    const effects: NBTTagCompound = {
      name: 'effects',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'fog_color',
          type: NBTTagType.Int,
          payload: payload.effects.fog_color
        },
        {
          name: 'water_color',
          type: NBTTagType.Int,
          payload: payload.effects.water_color
        },
        {
          name: 'water_fog_color',
          type: NBTTagType.Int,
          payload: payload.effects.water_fog_color
        },
        {
          name: 'sky_color',
          type: NBTTagType.Int,
          payload: payload.effects.sky_color
        }
      ]
    };

    if (payload.effects.foliage_color) {
      effects.payload.push({
        name: 'foliage_color',
        type: NBTTagType.Int,
        payload: payload.effects.foliage_color
      });
    }

    if (payload.effects.grass_color) {
      effects.payload.push({
        name: 'grass_color',
        type: NBTTagType.Int,
        payload: payload.effects.grass_color
      });
    }

    if (payload.effects.grass_color_modifier) {
      effects.payload.push({
        name: 'grass_color_modifier',
        type: NBTTagType.String,
        payload: payload.effects.grass_color_modifier
      });
    }

    if (payload.effects.particle) {
      effects.payload.push({
        name: 'particle',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'options',
            type: NBTTagType.Compound,
            payload: [
              {
                name: 'type',
                type: NBTTagType.String,
                payload: payload.effects.particle.options.type
              }
            ]
          },
          {
            name: 'probability',
            type: NBTTagType.Float,
            payload: payload.effects.particle.probability
          }
        ]
      });
    }

    if (payload.effects.ambient_sound) {
      effects.payload.push({
        name: 'ambient_sound',
        type: NBTTagType.String,
        payload: payload.effects.ambient_sound
      });
    }

    if (payload.effects.mood_sound) {
      effects.payload.push({
        name: 'mood_sound',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'block_search_extent',
            type: NBTTagType.Int,
            payload: payload.effects.mood_sound.block_search_extent
          },
          {
            name: 'offset',
            type: NBTTagType.Double,
            payload: payload.effects.mood_sound.offset
          },
          {
            name: 'sound',
            type: NBTTagType.String,
            payload: payload.effects.mood_sound.sound
          },
          {
            name: 'tick_delay',
            type: NBTTagType.Int,
            payload: payload.effects.mood_sound.tick_delay
          }
        ]
      });
    }

    if (payload.effects.additions_sound) {
      effects.payload.push({
        name: 'additions_sound',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'sound',
            type: NBTTagType.String,
            payload: payload.effects.additions_sound.sound
          },
          {
            name: 'tick_chance',
            type: NBTTagType.Float,
            payload: payload.effects.additions_sound.tick_chance
          }
        ]
      });
    }

    if (payload.effects.music) {
      effects.payload.push({
        name: 'music',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'sound',
            type: NBTTagType.String,
            payload: payload.effects.music.sound
          },
          {
            name: 'min_delay',
            type: NBTTagType.Int,
            payload: payload.effects.music.min_delay
          },
          {
            name: 'max_delay',
            type: NBTTagType.Int,
            payload: payload.effects.music.max_delay
          },
          {
            name: 'replace_current_music',
            type: NBTTagType.Byte,
            payload: payload.effects.music.replace_current_music
          }
        ]
      });
    }

    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'has_precipitation',
          type: NBTTagType.Byte,
          payload: payload.has_precipitation
        },
        {
          name: 'temperature',
          type: NBTTagType.Float,
          payload: payload.temperature
        },
        {
          name: 'downfall',
          type: NBTTagType.Float,
          payload: payload.downfall
        },
        effects
      ]
    };

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
