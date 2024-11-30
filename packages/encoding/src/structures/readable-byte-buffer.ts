import { uuidSigBitsToStr } from '#utils/uuid';
import { ByteBuffer } from './ByteBuffer';

const CONTINUE_BIT = 0x80;
const SEGMENT_BITS = 0x7f;

export class ReadableByteBuffer extends ByteBuffer {
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
}
