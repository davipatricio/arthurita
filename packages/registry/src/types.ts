import type { WritableNBT } from '@arthurita/nbt';

export type CachedEntries = {
  entryId: string;
  data: WritableNBT;
}[];
