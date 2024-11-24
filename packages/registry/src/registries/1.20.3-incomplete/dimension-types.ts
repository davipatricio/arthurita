import { NBTTagType, WritableNBT } from '@arthurita/nbt';

const overworldDimension = new WritableNBT().serialize({
  type: NBTTagType.Compound,
  name: '',
  payload: [
    {
      name: 'fixed_time',
      type: NBTTagType.Long,
      payload: 6000n
    },
    {
      name: 'has_skylight',
      type: NBTTagType.Byte,
      payload: 1
    },
    {
      name: 'has_ceiling',
      type: NBTTagType.Byte,
      payload: 0
    },
    {
      name: 'ultrawarm',
      type: NBTTagType.Byte,
      payload: 0
    },
    {
      name: 'natural',
      type: NBTTagType.Byte,
      payload: 1
    },
    {
      name: 'coordinate_scale',
      type: NBTTagType.Double,
      payload: 1.0
    },
    {
      name: 'bed_works',
      type: NBTTagType.Byte,
      payload: 1
    },
    {
      name: 'respawn_anchor_works',
      type: NBTTagType.Byte,
      payload: 1
    },
    {
      name: 'min_y',
      type: NBTTagType.Int,
      payload: 0
    },
    {
      name: 'height',
      type: NBTTagType.Int,
      payload: 256
    },
    {
      name: 'logical_height',
      type: NBTTagType.Int,
      payload: 256
    },
    {
      name: 'infiniburn',
      type: NBTTagType.String,
      // payload: 'minecraft:infiniburn_overworld'
      payload: '#'
    },
    {
      name: 'effects',
      type: NBTTagType.String,
      payload: 'minecraft:overworld'
    },
    {
      name: 'ambient_light',
      type: NBTTagType.Float,
      payload: 0.0
    },
    {
      name: 'piglin_safe',
      type: NBTTagType.Byte,
      payload: 0
    },
    {
      name: 'has_raids',
      type: NBTTagType.Byte,
      payload: 1
    },
    {
      name: 'monster_spawn_light_level',
      type: NBTTagType.Int,
      payload: 7
    },
    {
      name: 'monster_spawn_block_light_limit',
      type: NBTTagType.Int,
      payload: 7
    }
  ]
});

export const dimensions = [
  {
    entryId: 'minecraft:overworld',
    data: overworldDimension
  }
];
