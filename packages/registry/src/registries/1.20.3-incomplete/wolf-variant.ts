import { NBTTagType, WritableNBT } from '@arthurita/nbt';

const blackWolfVariant = new WritableNBT().serialize({
  type: NBTTagType.Compound,
  name: '',
  payload: [
    {
      name: 'wild_texture',
      type: NBTTagType.String,
      payload: 'minecraft:entity/wolf/wolf_black_angry'
    },
    {
      name: 'tame_texture',
      type: NBTTagType.String,
      payload: 'minecraft:entity/wolf/wolf_black_tame'
    },
    {
      name: 'angry_texture',
      type: NBTTagType.String,
      payload: 'minecraft:entity/wolf/wolf_black'
    },
    {
      name: 'biomes',
      type: NBTTagType.List,
      itemsType: NBTTagType.String,
      payload: [
        {
          type: NBTTagType.String,
          payload: 'minecraft:old_growth_pine_taiga'
        }
      ]
    }
  ]
});

export const wolfVariants = [
  {
    entryId: 'minecraft:black',
    data: blackWolfVariant
  }
];
