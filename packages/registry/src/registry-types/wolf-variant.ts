export const WolfVariantIdentifier = 'minecraft:wolf_variant' as const;

export interface WolfVariant {
  wildTexture: string;
  tameTexture: string;
  angryTexture: string;
  biomes: string[] | string;
}
