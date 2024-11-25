import type { CachedEntries } from '../types';

import { ArmorTrimMaterial } from './armor-trim-material';
import { ArmorTrimPattern } from './armor-trim-pattern';
import { BannerPattern } from './banner-pattern';
import { Biome } from './biome';
import { ChatType } from './chat-type';
import { DamageType } from './damage-type';
import { DimensionType } from './dimension-type';
import { PaintingVariant } from './painting-variant';
import { WolfVariant } from './wolf-variant';

type AllRegistryIds =
  | typeof Biome.Identifier
  | typeof DimensionType.Identifier
  | typeof DamageType.Identifier
  | typeof WolfVariant.Identifier
  | typeof PaintingVariant.Identifier
  | typeof BannerPattern.Identifier
  | typeof ArmorTrimPattern.Identifier
  | typeof ArmorTrimMaterial.Identifier
  | typeof ChatType.Identifier;

interface CachedRegistry {
  registryId: AllRegistryIds;
  entries: CachedEntries;
}

let cachedRegistries: CachedRegistry[] = [];

export function getCachedRegistries() {
  if (cachedRegistries.length) return cachedRegistries;

  cachedRegistries = [
    {
      registryId: Biome.Identifier,
      entries: Biome.entries()
    },
    {
      registryId: DimensionType.Identifier,
      entries: DimensionType.entries()
    },
    {
      registryId: DamageType.Identifier,
      entries: DamageType.entries()
    },
    {
      registryId: WolfVariant.Identifier,
      entries: WolfVariant.entries()
    },
    {
      registryId: PaintingVariant.Identifier,
      entries: PaintingVariant.entries()
    },
    {
      registryId: BannerPattern.Identifier,
      entries: BannerPattern.entries()
    },
    {
      registryId: ArmorTrimPattern.Identifier,
      entries: ArmorTrimPattern.entries()
    },
    {
      registryId: ArmorTrimMaterial.Identifier,
      entries: ArmorTrimMaterial.entries()
    },
    {
      registryId: ChatType.Identifier,
      entries: ChatType.entries()
    }
  ];

  return cachedRegistries;
}
