import { type ByteTag, NBTTags } from '@/types/tags';

export function writeNBTByte(data: ByteTag) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;

  const name = data.name;
  const value = data.value;

  const buffer = Buffer.alloc(1 + 2 + nameLength + 1);

  let offset = 0;
  buffer.writeUInt8(NBTTags.Byte, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeUint8(value, offset);
  offset += 1;

  return buffer;
}
