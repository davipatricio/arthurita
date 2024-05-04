import type { ReadDataType } from './utils';

export function readBoolean(buffer: Buffer): ReadDataType<boolean> {
  return { length: 1, value: !!buffer.readUint8(0) };
}

export function writeBoolean(bool: boolean): Buffer {
  return Buffer.from([bool ? 1 : 0]);
}
