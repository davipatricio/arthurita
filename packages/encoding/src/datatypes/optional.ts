import { writeVarInt } from './varint';

export function writeOptional(value?: Buffer): Buffer {
  if (value) {
    const buffer = Buffer.alloc(value.length + 1);
    return Buffer.concat([writeVarInt(value.length), value], buffer.length);
  }

  return Buffer.alloc(0);
}
