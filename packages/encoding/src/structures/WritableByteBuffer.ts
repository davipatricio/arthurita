import { uuidStrToSigBits } from '#utils/uuid';
import { ReadableByteBuffer } from './ReadableByteBuffer';

export class WritableByteBuffer extends ReadableByteBuffer {
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
