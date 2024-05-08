import { parse as uuidParse, v3 as uuidv3, v4 as uuidv4, stringify as uuidStringify } from 'uuid';
import type { ReadDataType } from './utils';

const namespace = uuidv4();

export function readUUID(buffer: Buffer): ReadDataType<string> {
  return { length: 16, value: uuidStringify(buffer.subarray(0, 16)) };
}

export function writeUUID(value: string) {
  const uuid = uuidv3(value, namespace);
  return Buffer.from(uuidParse(uuid));
}
