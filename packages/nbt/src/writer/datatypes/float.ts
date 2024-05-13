import { type FloatTag, NBTTags } from '@/types/tags';

export function writeNBTFloat(data: FloatTag) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;

  const name = data.name;
  const value = data.value;

  const buffer = Buffer.alloc(1 + 2 + nameLength + 4);

  let offset = 0;
  buffer.writeUInt8(NBTTags.Float, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeFloatBE(value, offset);
  offset += 4;

  return buffer;
}
