import type { ReadDataType } from './utils';
import { readVarInt, writeVarInt } from './varint';

export function readString(buffer: Buffer): ReadDataType<string> {
  const { length } = readVarInt(buffer);

  return {
    length,
    value: buffer.subarray(length).toString('utf8')
  };
}

export function writeString(value: string): Buffer {
  const string = Buffer.from(value, 'utf8');
  const length = writeVarInt(value.length);

  const buffer = Buffer.allocUnsafe(string.length);
  string.copy(buffer);

  return Buffer.from([...length, ...buffer]);
}
