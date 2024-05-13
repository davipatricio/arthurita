import { NBTTags, type ShortTag } from '@/types/tags';

export function writeNBTShort(data: Omit<ShortTag, 'type'>) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;

  const name = data.name;
  const value = data.value;

  const buffer = Buffer.alloc(1 + 2 + nameLength + 8);

  let offset = 0;
  buffer.writeUInt8(NBTTags.Short, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeInt16BE(value, offset);
  offset += 2;

  return buffer;
}
