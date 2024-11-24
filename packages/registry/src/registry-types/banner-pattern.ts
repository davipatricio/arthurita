export const BannerPatternIdentifier = 'minecraft:banner_pattern' as const;

export interface BannerPattern {
  assetId: string;
  translationKey: string;
}
