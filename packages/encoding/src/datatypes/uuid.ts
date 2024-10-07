import { parse as uuidParse, stringify as uuidStringify, v3 as uuidv3 } from 'uuid';
import type { ReadDataType } from './utils';

const namespace = uuidv3.DNS;

export function readUUID(buffer: Buffer): ReadDataType<string> {
  return { length: 16, value: uuidStringify(buffer.subarray(0, 16)) };
}

export function writeUUID(value: string) {
  const uuid = uuidv3(value, namespace);
  return Buffer.from(uuidParse(uuid));
}
