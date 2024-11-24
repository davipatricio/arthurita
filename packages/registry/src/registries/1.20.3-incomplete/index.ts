import type { NBT, ReadableNBT, WritableNBT } from '@arthurita/nbt';
import { BiomeIdentifier, DimensionTypeIdentifier, PaintingVariantIdentifier, WolfVariantIdentifier } from '../../registry-types';
import { dimensions } from './dimension-types';
import { paintings } from './painting-variant';
import { wolfVariants } from './wolf-variant';
import { biomes } from './biomes';

interface CachedRegistry {
  registryId: `minecraft:${string}`;
  entries: {
    entryId: string;
    data?: WritableNBT | ReadableNBT | NBT;
  }[];
}

export const cachedRegistries: CachedRegistry[] = [
  {
    registryId: DimensionTypeIdentifier,
    entries: dimensions
  },
  {
    registryId: PaintingVariantIdentifier,
    entries: paintings
  },
  {
    registryId: WolfVariantIdentifier,
    entries: wolfVariants
  },
  {
    registryId: BiomeIdentifier,
    entries: biomes
  }
];
