export const DimensionTypeIdentifier = 'minecraft:dimension_type' as const;

export interface DimensionType {
  fixedTime?: bigint;
  hasSkylight: boolean;
  hasCeiling: boolean;
  ultrawarm: boolean;
  natural: boolean;
  coordinateScale: number;
  bedWorks: boolean;
  respawnAnchorWorks: boolean;
  minY: number;
  height: number;
  logicalHeight: number;
  infiniburn: `#minecraft:${string}` | `#`;
  effects: 'minecraft:overworld' | 'minecraft:the_end' | 'minecraft:the_nether';
  ambientLight: number;
  piglinSafe: boolean;
  hasRaids: boolean;
  monsterSpawnLightLevel: number;
  monsterSpawnBlockLightLimit: number;
}
