import type { WritableNBT } from '@arthurita/nbt';
import {
  ArmorTrimMaterial,
  ArmorTrimPattern,
  Biome,
  ChatType,
  DamageType,
  DimensionType,
  PaintingVariant,
  WolfVariant
} from '../../registry-types';
import { BannerPattern } from '../../registry-types/banner-pattern';

export type CachedEntries = {
  entryId: string;
  data: WritableNBT;
}[];

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
