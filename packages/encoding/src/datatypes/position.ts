import { readLong, writeLong } from './long';
import type { ReadDataType } from './utils';

interface Position {
  x: bigint;
  y: bigint;
  z: bigint;
}

// The position type was different before 1.14
// https://wiki.vg/index.php?title=Data_types&oldid=14345#Position
export function writeOldPosition(data: Position) {
  const x = (data.x & 0x3ffffffn) << 38n;
  const y = (data.y & 0xfffn) << 26n;
  const z = data.z & 0x3ffffffn;

  const position = writeLong(x | y | z);

  return position;
}

export function readOldPosition(buffer: Buffer): ReadDataType<Position> {
  const val = readLong(buffer);

  const x = val.value >> 38n;
  const y = (val.value >> 26n) & 0xfffn;
  const z = val.value & 0x3ffffffn;

  return { value: { x, y, z }, length: val.length };
}
