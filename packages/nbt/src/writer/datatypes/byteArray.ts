import { type ByteArrayTag, NBTTags } from '@/types/tags';

export function writeNBTByteArray(data: Omit<ByteArrayTag, 'type'>) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;

  const name = data.name;
  const items = data.value;

  const finalSize = items.length * 1;

  const buffer = Buffer.alloc(1 + 2 + nameLength + 4 + finalSize);

  let offset = 0;
  buffer.writeUInt8(NBTTags.ByteArray, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeInt32BE(items.length, offset);
  offset += 4;

  for (const value of items) {
    buffer.writeUint8(value, offset);
    offset += 1;
  }

  return buffer;
}
