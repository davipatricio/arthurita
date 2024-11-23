import { ByteBuffer } from '@arthurita/encoding';
import { type AllNBTTags, type NBTTagList, NBTTagType, type NBTTagUnknownList } from './types';

export class NBT extends ByteBuffer {
  // reading utilities
  parse() {
    return this.parseTags();
  }

  get networkBuffer() {
    // @ts-expect-error
    return Buffer.concat([Buffer.from([this.buffer[0]]), this.buffer.subarray(3)]);
  }

  private parseTags() {
    let result: AllNBTTags = { type: NBTTagType.End, payload: null };

    while (this.buffer.length > 0) {
      const type = this.readByte();

      const name = type !== NBTTagType.List ? this.readString() : '';
      const payload = this.parsePayload(type);

      const tagData = { type, name, payload };
      result = tagData as AllNBTTags;
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

      const tagData = { type, name, payload };

      if (type === NBTTagType.List && payload && typeof payload === 'object' && 'payload' in payload) {
        const listTagData = { itemTypes: (payload as unknown as NBTTagUnknownList).itemsType, ...tagData, payload: payload.payload };
        tags.push(listTagData as AllNBTTags);
      } else {
        tags.push(tagData as AllNBTTags);
      }
    }

    return tags;
  }

  private parseList(): Pick<NBTTagList, 'itemsType' | 'payload'> {
    const itemsType = this.readByte() as NBTTagList['itemsType'];
    const length = this.readInt();
    const payload = Array.from({ length }, () => {
      return {
        type: itemsType,
        name: '',
        payload: this.parsePayload(itemsType)
      };
    });

    return { itemsType, payload };
  }

  // writing utilities
  public writeTag(tag: AllNBTTags) {
    this.putByte(tag.type);
    if (tag.type !== NBTTagType.End) {
      this.putString(tag.name ?? '');
      this.putPayload(tag);
    }
    return this;
  }

  private putPayload(tag: AllNBTTags) {
    switch (tag.type) {
      case NBTTagType.End:
        break;
      case NBTTagType.Byte:
        this.putByte(tag.payload);
        break;
      case NBTTagType.Short:
        this.putShort(tag.payload);
        break;
      case NBTTagType.Int:
        this.putInt(tag.payload);
        break;
      case NBTTagType.Long:
        this.putLong(tag.payload);
        break;
      case NBTTagType.Float:
        this.putFloat(tag.payload);
        break;
      case NBTTagType.Double:
        this.putDouble(tag.payload);
        break;
      case NBTTagType.Byte_Array:
        this.putByteArray(tag.payload);
        break;
      case NBTTagType.String:
        this.putString(tag.payload);
        break;
      case NBTTagType.Compound:
        this.putCompound(tag.payload);
        break;
      case NBTTagType.List:
        this.putList(tag.payload as NBTTagList[], tag.itemsType);
        break;
      case NBTTagType.Int_Array:
        this.putIntArray(tag.payload);
        break;
      case NBTTagType.Long_Array:
        this.putLongArray(tag.payload);
        break;
      default:
        throw new Error('Unknown NBT type');
    }
  }

  private putByteArray(value: number[]) {
    this.putInt(value.length);
    this.allocate(value.length);
    this.buffer.set(value, this.buffer.length - value.length);
    return this;
  }

  private putIntArray(value: number[]) {
    this.putInt(value.length);
    for (const val of value) this.putInt(val);
    return this;
  }

  private putLongArray(value: bigint[]) {
    this.putInt(value.length);
    for (const val of value) this.putLong(val);
    return this;
  }

  private putCompound(tags: AllNBTTags[]) {
    for (const tag of tags) this.writeTag(tag);
    this.putByte(NBTTagType.End);
    return this;
  }

  private putList(tags: NBTTagList[], itemsType: NBTTagType) {
    this.putByte(itemsType);
    this.putInt(tags.length);
    for (const tag of tags) this.putPayload(tag);
    return this;
  }

  putString(value: string) {
    const encoded = Buffer.from(value, 'utf8');
    this.putUnsignedShort(value.length);
    this.allocate(encoded.length);
    this.buffer.set(encoded, this.buffer.length - encoded.length);
    return this;
  }
}
