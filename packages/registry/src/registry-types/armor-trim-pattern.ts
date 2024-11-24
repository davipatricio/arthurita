export const ArmorTrimPatternIdentifier = 'minecraft:trim_pattern' as const;

export interface ArmorTrimPattern {
  assetId: string;
  templateItem: string;
  description: string;
  decal: boolean;
}
