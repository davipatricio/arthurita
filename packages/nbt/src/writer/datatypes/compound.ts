import { type CompoundTag, NBTTags } from '@/types/tags';
import { writeNBTString } from './string';

export function writeNBTCompound(data: CompoundTag) {
  const nameLength = data.name ? data.name.length : 0;

  const name = data.name;
  const value = data.value;

  let buffer = Buffer.allocUnsafe(1 + 2 + nameLength);

  let offset = 0;
  buffer.writeUInt8(NBTTags.Compound, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) {
    buffer.write(name, offset, 'utf8');
    offset += nameLength;
  }

  for (let i = 0; i < value.length; i++) {
    const tag = value[i];

    switch (tag.type) {
      case 'string': {
        const stringBuffer = writeNBTString(tag);
        buffer = Buffer.from([...buffer, ...stringBuffer]);
        break;
      }
      case 'compound': {
        const compoundBuffer = writeNBTCompound(tag);
        buffer = Buffer.from([...buffer, ...compoundBuffer]);
        break;
      }
    }
  }

  buffer = Buffer.concat([buffer, Buffer.from([NBTTags.End])]);

  return buffer;
}
