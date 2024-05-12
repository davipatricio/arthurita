import { promisify } from 'node:util';
import { default as zlib } from 'node:zlib';
import { parseFromTag } from '@/parser/internal/parseFromTag';

const unzipAsync = promisify(zlib.unzip);

/**
 * Parses a compressed or uncompressed NBT file.
 * @param buffer - NBT buffer
 * @returns The parsed NBT object
 */
export async function parseNBT(buffer: Buffer) {
  let offset = 0;
  let decompressedBuffer = buffer;

  if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
    decompressedBuffer = await unzipAsync(buffer);
  }

  const id = decompressedBuffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  return parseFromTag(decompressedBuffer, { id, currentOffset: offset });
}
