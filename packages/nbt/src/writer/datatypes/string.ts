import { NBTTags, type StringTag } from '@/types/tags';

export function writeNBTString(data: StringTag) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;
  const valueLength = Buffer.byteLength(data.value);

  const name = data.name;
  const value = data.value;

  const buffer = Buffer.alloc(1 + 2 + nameLength + 2 + valueLength);

  let offset = 0;
  buffer.writeUInt8(NBTTags.String, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeUInt16BE(valueLength, offset);
  offset += 2;

  if (valueLength > 0 && value) buffer.write(value, offset, 'utf8');
  offset += valueLength;

  return buffer;
}
