export const PaintingVariantIdentifier = 'minecraft:painting_variant' as const;

export interface PaintingVariant {
  assetId: string;
  height: number;
  width: number;
}
