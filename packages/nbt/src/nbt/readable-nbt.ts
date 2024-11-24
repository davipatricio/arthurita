import { NBT } from './nbt';
import { type AllNBTTags, type NBTTagList, NBTTagType, type NBTTagUnknownList } from './types';
import { WritableNBT } from './writable-nbt';

export class ReadableNBT extends NBT {
  constructor(bufferOrNBT?: Buffer | ReadableNBT | WritableNBT | NBT) {
    if (bufferOrNBT instanceof NBT || bufferOrNBT instanceof ReadableNBT || bufferOrNBT instanceof WritableNBT) {
      super(bufferOrNBT.buffer);
    } else {
      super(bufferOrNBT);
    }
  }

  deserialize() {
    return this.parseTags();
  }

  private parseTags() {
    let result: AllNBTTags = { type: NBTTagType.End, payload: null };

    while (this.buffer.length > 0) {
      const type = this.readByte();
      const name = type !== NBTTagType.List ? this.readString() : '';
      const payload = this.parsePayload(type);

      result = { type, name, payload } as AllNBTTags;
    }

    return result;
  }

  private parsePayload(type: NBTTagType) {
    switch (type) {
      case NBTTagType.End:
        return null;
      case NBTTagType.Byte:
        return this.readByte();
      case NBTTagType.Short:
        return this.readShort();
      case NBTTagType.Int:
        return this.readInt();
      case NBTTagType.Long:
        return this.readLong();
      case NBTTagType.Float:
        return this.readFloat();
      case NBTTagType.Double:
        return this.readDouble();
      case NBTTagType.Byte_Array:
        return this.readByteArray();
      case NBTTagType.String:
        return this.readString();
      case NBTTagType.Compound:
        return this.parseCompound();
      case NBTTagType.List:
        return this.parseList();
      case NBTTagType.Int_Array:
        return this.readIntArray();
      case NBTTagType.Long_Array:
        return this.readLongArray();
      default:
        throw new Error(`Unknown NBT type: ${type}`);
    }
  }

  public readByteArray() {
    const length = this.readInt();
    const payload = [...this.buffer.subarray(0, length)];
    this.advance(length);
    return payload;
  }

  public readIntArray() {
    const length = this.readInt();
    const payload = Array.from({ length }, () => this.readInt());
    return payload;
  }

  public readLongArray() {
    const length = this.readInt();
    const payload = Array.from({ length }, () => this.readLong());
    return payload;
  }

  public readString() {
    const length = this.readUnsignedShort();
    const payload = this.buffer.toString('utf8', 0, length);
    this.advance(length);
    return payload;
  }

  private parseCompound() {
    const tags: AllNBTTags[] = [];
    let endFound = false;

    while (!endFound) {
      const type = this.readByte();

      if (type === NBTTagType.End) {
        endFound = true;
        continue;
      }

      const name = this.readString();
      const payload = this.parsePayload(type);

      if (type === NBTTagType.List && payload && typeof payload === 'object' && 'payload' in payload) {
        const listTagData = { itemTypes: (payload as unknown as NBTTagUnknownList).itemsType, name, type, payload: payload.payload };
        tags.push(listTagData as AllNBTTags);
      } else {
        tags.push({ type, name, payload } as AllNBTTags);
      }
    }

    return tags;
  }

  private parseList(): Pick<NBTTagList, 'itemsType' | 'payload'> {
    const itemsType = this.readByte() as NBTTagList['itemsType'];
    const length = this.readInt();
    const payload = Array.from({ length }, () => ({
      type: itemsType,
      name: '',
      payload: this.parsePayload(itemsType)
    }));

    return { itemsType, payload };
  }
}
