export const ArmorTrimMaterialIdentifier = 'minecraft:trim_material' as const;

export interface ArmorTrimMaterial {
  assetName: string;
  ingredient: string;
  itemModelIndex: number;
  description: string;
  // overrideArmorMaterial?: Record<'leather' | 'chainmail' | 'iron' | 'gold' | 'diamond' | 'turtle' | 'netherite', unknown>;
}
