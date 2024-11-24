import { NBT } from './nbt';
import { ReadableNBT } from './readable-nbt';
import { type AllNBTTags, type NBTTagList, NBTTagType } from './types';

export class WritableNBT extends NBT {
  constructor(bufferOrNBT?: Buffer | ReadableNBT | WritableNBT | NBT) {
    if (bufferOrNBT instanceof NBT || bufferOrNBT instanceof ReadableNBT || bufferOrNBT instanceof WritableNBT) {
      super(bufferOrNBT.buffer);
    } else {
      super(bufferOrNBT);
    }
  }

  public serialize(tag: AllNBTTags) {
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
    for (const tag of tags) this.serialize(tag);
    this.putByte(NBTTagType.End);
    return this;
  }

  private putList(tags: NBTTagList[], itemsType: NBTTagType) {
    this.putByte(itemsType);
    this.putInt(tags.length);
    for (const tag of tags) this.putPayload(tag);
    return this;
  }

  override putString(value: string) {
    const encoded = Buffer.from(value, 'utf8');
    this.putUnsignedShort(value.length);
    this.allocate(encoded.length);
    this.buffer.set(encoded, this.buffer.length - encoded.length);
    return this;
  }
}
