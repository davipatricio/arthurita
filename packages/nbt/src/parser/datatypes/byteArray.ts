import type { ByteArrayTag } from '@/types/tags';
import type { ParseReturnOptions } from '../utils';

export function parseNBTByteArray(buffer: Buffer, currentOffset: number, ignoreNames: boolean): ParseReturnOptions & ByteArrayTag {
  let offset = currentOffset;
  let name = null;

  if (!ignoreNames) {
    name = '';

    const nameLength = buffer.subarray(offset, offset + 2).readUInt16BE();
    offset += 2;

    if (nameLength > 0) {
      name = buffer.subarray(offset, offset + nameLength).toString();
      offset += nameLength;
    }
  }
  const listLength = buffer.subarray(offset, offset + 4).readInt32BE();
  offset += 4;

  const values: number[] = [];

  for (let i = 0; i < listLength; i++) {
    const value = buffer.subarray(offset, offset + 1).readUint8();
    offset += 1;

    values.push(value);
  }

  const byteArray: ByteArrayTag = {
    name,
    type: 'byteArray',
    value: values
  };
  return { ...byteArray, currentOffset: offset };
}
