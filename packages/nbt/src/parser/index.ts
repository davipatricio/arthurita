import { parseFromTag } from '@/parser/internal/parseFromTag';
import { decompressNBT, isNBTCompressed } from './utils';

/**
 * Parses a compressed or uncompressed NBT file.
 * @param buffer - NBT buffer
 * @returns The parsed NBT object
 */
export async function parseNBT(buffer: Buffer) {
  let offset = 0;
  let decompressedBuffer = buffer;

  if (isNBTCompressed(buffer)) {
    decompressedBuffer = await decompressNBT(buffer);
  }

  const id = decompressedBuffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  return parseFromTag(decompressedBuffer, { id, currentOffset: offset });
}

export * from './utils';
