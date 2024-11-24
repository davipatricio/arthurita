import type { CachedEntries } from '../types';

import { BannerPattern } from './banner-pattern';
import { Biome } from './biome';
import { DimensionType } from './dimension-type';
import { DamageType } from './damage-type';
import { WolfVariant } from './wolf-variant';
import { PaintingVariant } from './painting-variant';
import { ArmorTrimPattern } from './armor-trim-pattern';
import { ArmorTrimMaterial } from './armor-trim-material';
import { ChatType } from './chat-type';

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

export const cachedRegistries: CachedRegistry[] = [
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
