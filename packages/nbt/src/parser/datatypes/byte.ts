import type { ByteTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTByte(buffer: Buffer, currentOffset: number): ParseReturnOptions & ByteTag {
  let offset = currentOffset;

  const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
  offset += 2;

  let name = '';

  if (nameLength > 0) {
    name = buffer.subarray(offset, offset + nameLength).toString();
    offset += nameLength;
  }

  const value = buffer.subarray(offset, offset + 1).readUint8();
  offset += 1;

  const byte: ByteTag = {
    name,
    type: 'byte',
    value
  };
  return { ...byte, currentOffset: offset };
}
