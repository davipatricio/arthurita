import { type ListTag, NBTTags } from '@/types/tags';
import {
  writeNBTByte,
  writeNBTByteArray,
  writeNBTCompound,
  writeNBTDouble,
  writeNBTFloat,
  writeNBTInt,
  writeNBTIntArray,
  writeNBTLong,
  writeNBTLongArray,
  writeNBTShort,
  writeNBTString
} from '.';

export function writeNBTList(data: Omit<ListTag, 'type'>) {
  const nameLength = data.name ? Buffer.byteLength(data.name) : 0;

  const name = data.name;
  const items = data.value;

  let buffer = Buffer.alloc(1 + 2 + nameLength + 1 + 4);

  let offset = 0;
  buffer.writeUInt8(NBTTags.List, 0);
  offset += 1;

  buffer.writeUInt16BE(nameLength, offset);
  offset += 2;

  if (nameLength > 0 && name) buffer.write(name, offset, 'utf8');
  offset += nameLength;

  buffer.writeUint8(data.typeId, offset);
  offset += 1;

  buffer.writeInt32BE(items.length, offset);
  offset += 1;

  items[0].value;

  for (const item of items) {
    switch (data.typeId) {
      case NBTTags.Byte: {
        const byteBuffer = writeNBTByte(item);
        buffer = Buffer.from([...buffer, ...byteBuffer]);
        break;
      }
      case NBTTags.ByteArray: {
        const byteArrayBuffer = writeNBTByteArray(item);
        buffer = Buffer.from([...buffer, ...byteArrayBuffer]);
        break;
      }
      case NBTTags.Compound: {
        const compoundBuffer = writeNBTCompound(item);
        buffer = Buffer.from([...buffer, ...compoundBuffer]);
        break;
      }
      case NBTTags.Double: {
        const doubleBuffer = writeNBTDouble(item);
        buffer = Buffer.from([...buffer, ...doubleBuffer]);
        break;
      }
      case NBTTags.Float: {
        const floatBuffer = writeNBTFloat(item);
        buffer = Buffer.from([...buffer, ...floatBuffer]);
        break;
      }
      case NBTTags.Int: {
        const intBuffer = writeNBTInt(item);
        buffer = Buffer.from([...buffer, ...intBuffer]);
        break;
      }
      case NBTTags.IntArray: {
        const intArrayBuffer = writeNBTIntArray(item);
        buffer = Buffer.from([...buffer, ...intArrayBuffer]);
        break;
      }
      case NBTTags.List: {
        throw new Error('NBT Lists inside NBT Lists are not supported at this moment.');
      }
      case NBTTags.Long: {
        const longBuffer = writeNBTLong(item);
        buffer = Buffer.from([...buffer, ...longBuffer]);
        break;
      }
      case NBTTags.LongArray: {
        const longArrayBuffer = writeNBTLongArray(item);
        buffer = Buffer.from([...buffer, ...longArrayBuffer]);
        break;
      }
      case NBTTags.Short: {
        const shortBuffer = writeNBTShort(item);
        buffer = Buffer.from([...buffer, ...shortBuffer]);
        break;
      }
      case NBTTags.String: {
        const stringBuffer = writeNBTString(item);
        buffer = Buffer.from([...buffer, ...stringBuffer]);
        break;
      }
    }
  }

  return buffer;
}
