import { promisify } from 'node:util';
import zlib from 'node:zlib';

export interface ParseReturnOptions {
  currentOffset: number;
}

const unzipAsync = promisify(zlib.unzip);

export function isNBTCompressed(buffer: Buffer) {
  return buffer[0] === 0x1f && buffer[1] === 0x8b;
}

export async function decompressNBT(buffer: Buffer) {
  if (isNBTCompressed(buffer)) {
    const data = await unzipAsync(buffer);
    return data;
  }

  throw new Error('NBT is not compressed');
}
