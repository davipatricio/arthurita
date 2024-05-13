import { type CompoundTag, NBTTags } from '@/types/tags';
import {
  writeNBTByte,
  writeNBTByteArray,
  writeNBTDouble,
  writeNBTFloat,
  writeNBTInt,
  writeNBTIntArray,
  writeNBTLong,
  writeNBTLongArray,
  writeNBTShort,
  writeNBTString
} from '.';

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
      case 'byte': {
        const byteBuffer = writeNBTByte(tag);
        buffer = Buffer.from([...buffer, ...byteBuffer]);
        break;
      }
      case 'byteArray': {
        const byteArrayBuffer = writeNBTByteArray(tag);
        buffer = Buffer.from([...buffer, ...byteArrayBuffer]);
        break;
      }
      case 'compound': {
        const compoundBuffer = writeNBTCompound(tag);
        buffer = Buffer.from([...buffer, ...compoundBuffer]);
        break;
      }
      case 'double': {
        const doubleBuffer = writeNBTDouble(tag);
        buffer = Buffer.from([...buffer, ...doubleBuffer]);
        break;
      }
      case 'float': {
        const floatBuffer = writeNBTFloat(tag);
        buffer = Buffer.from([...buffer, ...floatBuffer]);
        break;
      }
      case 'int': {
        const intBuffer = writeNBTInt(tag);
        buffer = Buffer.from([...buffer, ...intBuffer]);
        break;
      }
      case 'intArray': {
        const intArrayBuffer = writeNBTIntArray(tag);
        buffer = Buffer.from([...buffer, ...intArrayBuffer]);
        break;
      }
      case 'list': {
        throw new Error('List tags are not supported currently');
      }
      case 'long': {
        const longBuffer = writeNBTLong(tag);
        buffer = Buffer.from([...buffer, ...longBuffer]);
        break;
      }
      case 'longArray': {
        const longArrayBuffer = writeNBTLongArray(tag);
        buffer = Buffer.from([...buffer, ...longArrayBuffer]);
        break;
      }
      case 'short': {
        const shortBuffer = writeNBTShort(tag);
        buffer = Buffer.from([...buffer, ...shortBuffer]);
        break;
      }
      case 'string': {
        const stringBuffer = writeNBTString(tag);
        buffer = Buffer.from([...buffer, ...stringBuffer]);
        break;
      }
    }
  }

  buffer = Buffer.concat([buffer, Buffer.from([NBTTags.End])]);

  return buffer;
}
