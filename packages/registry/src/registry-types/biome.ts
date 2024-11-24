export const BiomeIdentifier = 'minecraft:worldgen/biome' as const;

export interface Biome {
  hasPrecipitation: boolean;
  temperature: number;
  temperatureModifier: number;
  downfall: number;
  effects: BiomeEffects;
}

export interface BiomeEffects {
  fogColor: number;
  waterColor: number;
  waterFogColor: number;
  skyColor: number;
  foliageColor?: number;
  grassColor?: number;
  grassColorModifier?: number;
  particle?: Particle;
  ambientSound?: string;
  moodSound?: MoodSound;
  additions_sound?: AdditionsSound;
  music?: Music;
}

export interface Particle {
  options: ParticleOptions;
  probability: number;
}

export interface ParticleOptions {
  type: string;
  value?: number;
}

export interface MoodSound {
  blockSearchExtent: number;
  offset: number;
  sound: string;
  tickDelay: number;
}

export interface AdditionsSound {
  sound: string;
  tickChance: number;
}

export interface Music {
  sound: string;
  minDelay: number;
  maxDelay: number;
  replaceCurrentMusic: boolean;
}
