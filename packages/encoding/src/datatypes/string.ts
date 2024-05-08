import type { ReadDataType } from './utils';
import { readVarInt, writeVarInt } from './varint';

export function readString(buffer: Buffer): ReadDataType<string> {
  const { length, value } = readVarInt(buffer.subarray(0, 1));
  const data = buffer.subarray(length, value + length).toString('utf8');

  return { length: value + length, value: data };
}

export function writeString(value: string) {
  if (value.length > 32767) {
    throw new Error('Maximum string length is 32767');
  }

  const string = Buffer.from(value, 'utf8');
  const textLength = writeVarInt(Buffer.byteLength(value));

  return Buffer.from([...textLength, ...string]);
}
