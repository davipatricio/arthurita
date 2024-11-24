export const DamageTypeIdentifier = 'minecraft:damage_type' as const;

export interface DamageType {
  messageId: string;
  scaling: string;
  effects?: string;
  deathMessageType?: string;
}
