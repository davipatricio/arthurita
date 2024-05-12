import { parseFromTag } from '@/parser/internal/parseFromTag';

export function parseNBT(buffer: Buffer, currentOffset = 0) {
  let offset = currentOffset;

  const id = buffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  return parseFromTag(buffer, { id, currentOffset: offset });
}
