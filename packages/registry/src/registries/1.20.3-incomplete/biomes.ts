import { NBTTagType, WritableNBT } from '@arthurita/nbt';

const OldGrowhPineTaigaBiome = new WritableNBT().serialize({
  type: NBTTagType.Compound,
  name: '',
  payload: [
    {
      type: NBTTagType.Byte,
      name: 'has_precipitation',
      payload: 1
    },
    {
      type: NBTTagType.Float,
      name: 'temperature',
      payload: 0.30000001192092896
    },
    {
      type: NBTTagType.Float,
      name: 'downfall',
      payload: 0.800000011920929
    },
    {
      type: NBTTagType.Compound,
      name: 'effects',
      payload: [
        {
          type: NBTTagType.Int,
          name: 'fog_color',
          payload: 12638463
        },
        {
          type: NBTTagType.Int,
          name: 'water_color',
          payload: 4159204
        },
        {
          type: NBTTagType.Int,
          name: 'water_fog_color',
          payload: 4159204
        },
        {
          type: NBTTagType.Int,
          name: 'sky_color',
          payload: 8168447
        },
        {
          type: NBTTagType.Compound,
          name: 'mood_sound',
          payload: [
            {
              type: NBTTagType.Int,
              name: 'block_search_extent',
              payload: 8
            },
            {
              type: NBTTagType.Double,
              name: 'offset',
              payload: 2.0
            },
            {
              type: NBTTagType.String,
              name: 'sound',
              payload: 'minecraft:ambient.cave'
            },
            {
              type: NBTTagType.Int,
              name: 'tick_delay',
              payload: 6000
            }
          ]
        },
        {
          type: NBTTagType.Compound,
          name: 'music',
          payload: [
            {
              type: NBTTagType.Int,
              name: 'max_delay',
              payload: 24000
            },
            {
              type: NBTTagType.Int,
              name: 'min_delay',
              payload: 12000
            },
            {
              type: NBTTagType.Byte,
              name: 'replace_current_music',
              payload: 0
            },
            {
              type: NBTTagType.String,
              name: 'sound',
              payload: 'minecraft:music.overworld.old_growth_taiga'
            }
          ]
        }
      ]
    }
  ]
});

export const biomes = [
  {
    entryId: 'minecraft:old_growth_pine_taiga',
    data: OldGrowhPineTaigaBiome
  }
];
