import { type LongArrayTag, NBTTags } from '@/types/tags';

export function writeNBTLongArray(data: Omit<LongArrayTag, 'type'>) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;

  const name = data.name;
  const items = data.value;

  const finalSize = items.length * 8;

  const buffer = Buffer.alloc(1 + 2 + nameLength + 4 + finalSize);

  let offset = 0;
  buffer.writeUInt8(NBTTags.LongArray, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeInt32BE(items.length, offset);
  offset += 4;

  for (const value of items) {
    buffer.writeBigInt64BE(value, offset);
    offset += 8;
  }

  return buffer;
}
