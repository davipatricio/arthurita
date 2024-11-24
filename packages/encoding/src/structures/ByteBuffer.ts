import { uuidSigBitsToStr, uuidStrToSigBits } from '#utils/uuid';

const CONTINUE_BIT = 0x80;
const SEGMENT_BITS = 0x7f;

export class ByteBuffer {
  constructor(public buffer: Buffer = Buffer.alloc(0)) {}

  get uint8array() {
    return new Uint8Array(this.buffer);
  }

  advance(offset: number) {
    this.buffer = this.buffer.subarray(offset);
    return this;
  }

  readBoolean() {
    const value = this.buffer.readUInt8();
    this.advance(1);
    return value === 1;
  }

  readByte() {
    const value = this.buffer.readUInt8();
    this.advance(1);
    return value;
  }

  readUnsignedByte() {
    const value = this.buffer.readUInt8();
    this.advance(1);
    return value;
  }

  readShort() {
    const value = this.buffer.readInt16BE();
    this.advance(2);
    return value;
  }

  readUnsignedShort() {
    const value = this.buffer.readUInt16BE();
    this.advance(2);
    return value;
  }

  readInt() {
    const value = this.buffer.readInt32BE();
    this.advance(4);
    return value;
  }

  readLong() {
    const value = this.buffer.readBigInt64BE();
    this.advance(8);
    return value;
  }

  readFloat() {
    const value = this.buffer.readFloatBE();
    this.advance(4);
    return value;
  }

  readDouble() {
    const value = this.buffer.readDoubleBE();
    this.advance(8);
    return value;
  }

  readVarInt() {
    let value = 0;
    let position = 0;
    let currentByte: number;

    while (true) {
      currentByte = this.buffer.readUInt8();
      value |= (currentByte & SEGMENT_BITS) << position;
      this.advance(1);

      if ((currentByte & CONTINUE_BIT) === 0) break;

      position += 7;

      if (position >= 32) throw new Error('VarInt is too big');
    }

    return value;
  }

  readVarLong() {
    let value = BigInt(0);
    let position = 0;
    let currentByte: number;

    while (true) {
      currentByte = this.buffer.readUInt8();
      value |= BigInt(currentByte & SEGMENT_BITS) << BigInt(position);
      this.advance(1);

      if ((currentByte & CONTINUE_BIT) === 0) break;

      position += 7;

      if (position >= 64) throw new Error('VarLong is too big');
    }

    return value;
  }

  readString() {
    const length = this.readVarInt();
    // const value = new TextDecoder().decode(this.buffer.subarray(0, length));
    const value = this.buffer.toString('utf-8', 0, length);
    this.advance(length);
    return value;
  }

  readPosition() {
    const value = this.readLong();
    const x = Number(value >> BigInt(38));
    const y = Number((value << BigInt(52)) >> BigInt(52));
    const z = Number((value << BigInt(26)) >> BigInt(38));
    return { x, y, z };
  }

  readUUID() {
    const msb = this.readLong();
    const lsb = this.readLong();

    return uuidSigBitsToStr({ msb, lsb });
  }

  readTeleportFlags() {
    const value = this.readInt();
    const flags = {
      relativeX: (value & 0x0001) !== 0,
      relativeY: (value & 0x0002) !== 0,
      relativeZ: (value & 0x0004) !== 0,
      relativeYaw: (value & 0x0008) !== 0,
      relativePitch: (value & 0x0010) !== 0,
      relativeVelocityX: (value & 0x0020) !== 0,
      relativeVelocityY: (value & 0x0040) !== 0,
      relativeVelocityZ: (value & 0x0080) !== 0,
      rotateVelocity: (value & 0x0100) !== 0
    };

    return flags;
  }

  allocate(size: number) {
    // @ts-expect-error
    this.buffer = Buffer.concat([this.buffer, Buffer.alloc(size)]);
    return this;
  }

  putBuffer(value: Buffer) {
    this.allocate(value.length);
    this.buffer.set(value, this.buffer.length - value.length);
    return this;
  }

  putBoolean(value: boolean) {
    this.allocate(1);
    const offset = this.buffer.length - 1;
    this.buffer.writeUInt8(value ? 1 : 0, offset);
    return this;
  }

  putByte(value: number) {
    this.allocate(1);
    const offset = this.buffer.length - 1;
    this.buffer.writeUInt8(value, offset);
    return this;
  }

  putUnsignedByte(value: number) {
    this.allocate(1);
    const offset = this.buffer.length - 1;
    this.buffer.writeUInt8(value, offset);
    return this;
  }

  putShort(value: number) {
    this.allocate(2);
    const offset = this.buffer.length - 2;
    this.buffer.writeInt16BE(value, offset);
    return this;
  }

  putUnsignedShort(value: number) {
    this.allocate(2);
    const offset = this.buffer.length - 2;
    this.buffer.writeUInt16BE(value, offset);
    return this;
  }

  putInt(value: number) {
    this.allocate(4);
    const offset = this.buffer.length - 4;
    this.buffer.writeInt32BE(value, offset);
    return this;
  }

  putLong(value: bigint) {
    this.allocate(8);
    const offset = this.buffer.length - 8;
    this.buffer.writeBigInt64BE(value, offset);
    return this;
  }

  putFloat(value: number) {
    this.allocate(4);
    const offset = this.buffer.length - 4;
    this.buffer.writeFloatBE(value, offset);
    return this;
  }

  putDouble(value: number) {
    this.allocate(8);
    const offset = this.buffer.length - 8;
    this.buffer.writeDoubleBE(value, offset);
    return this;
  }

  putVarInt(value: number) {
    let val = value;
    while (true) {
      if ((val & -128) === 0) {
        this.allocate(1);
        const offset = this.buffer.length - 1;
        this.buffer.writeUInt8(val, offset);
        break;
      }

      this.allocate(1);
      const offset = this.buffer.length - 1;
      this.buffer.writeUInt8((val & 127) | 128, offset);
      val = val >> 7;
    }

    return this;
  }

  putVarLong(value: bigint) {
    let val = value;
    while (true) {
      if ((val & -BigInt(128)) === BigInt(0)) {
        this.allocate(1);
        const offset = this.buffer.length - 1;
        this.buffer.writeUInt8(Number(val), offset);
        break;
      }

      this.allocate(1);
      const offset = this.buffer.length - 1;
      this.buffer.writeUInt8(Number((val & BigInt(127)) | BigInt(128)), offset);
      val = val >> BigInt(7);
    }

    return this;
  }

  putString(value: string) {
    const encoded = Buffer.from(value, 'utf-8');
    this.putVarInt(encoded.length);
    this.allocate(encoded.length);
    this.buffer.set(encoded, this.buffer.length - encoded.length);
    return this;
  }

  putPosition(value: { x: number; y: number; z: number }) {
    const x = BigInt(value.x);
    const y = BigInt(value.y);
    const z = BigInt(value.z);

    const position = (x << BigInt(38)) | (y << BigInt(26)) | z;
    this.putLong(position);
    return this;
  }

  putUUID(value: string) {
    const { msb, lsb } = uuidStrToSigBits(value);
    this.putLong(msb);
    this.putLong(lsb);
    return this;
  }

  putTeleportFlags(value: {
    relativeX: boolean;
    relativeY: boolean;
    relativeZ: boolean;
    relativeYaw: boolean;
    relativePitch: boolean;
    relativeVelocityX: boolean;
    relativeVelocityY: boolean;
    relativeVelocityZ: boolean;
    rotateVelocity: boolean;
  }) {
    let flags = 0;

    if (value.relativeX) flags |= 0x0001;
    if (value.relativeY) flags |= 0x0002;
    if (value.relativeZ) flags |= 0x0004;
    if (value.relativeYaw) flags |= 0x0008;
    if (value.relativePitch) flags |= 0x0010;
    if (value.relativeVelocityX) flags |= 0x0020;
    if (value.relativeVelocityY) flags |= 0x0040;
    if (value.relativeVelocityZ) flags |= 0x0080;
    if (value.rotateVelocity) flags |= 0x0100;

    this.putInt(flags);
    return this;
  }
}
