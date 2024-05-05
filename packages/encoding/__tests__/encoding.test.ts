import {
  readDouble,
  readFloat,
  readInt,
  readLong,
  readShort,
  readString,
  readUnsignedShort,
  readVarInt,
  readVarLong,
  writeDouble,
  writeFloat,
  writeInt,
  writeLong,
  writeShort,
  writeString,
  writeUnsignedShort,
  writeVarInt,
  writeVarLong
} from 'dist';
import { describe, expect, test } from 'vitest';

describe('@arthurita/encoding | strings', () => {
  test('encode and decode a string correctly', () => {
    const string = 'hello world';

    const buffer = writeString(string);
    const { value } = readString(buffer);

    expect(value.length).toBe(string.length);
    expect(value).toBeTypeOf('string');
    expect(value).toBe(string);
  });
});

describe('@arthurita/encoding | var[ints|long]', () => {
  test('encode and decode varInt', () => {
    const values = [-2147483647, 2147483647, 100, -100, 0];

    for (const value of values) {
      const varintBuffer = writeVarInt(value);
      const { value: varintValue } = readVarInt(varintBuffer);

      expect(varintValue).toBeTypeOf('number');
      expect(varintValue).toBe(value);
    }
  });

  test('encode and decode varLong', () => {
    const values = [9223372036854775807n, -9223372036854775807n, 100n, -100n, 0n];

    for (const value of values) {
      const varlongBuffer = writeVarLong(value);
      const { value: varlongValue } = readVarLong(varlongBuffer);

      expect(varlongValue).toBeTypeOf('bigint');
      expect(varlongValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | [unsigned]short', () => {
  test('encode and decode short', () => {
    const values = [32767, -32767, 100, -100, 0];

    for (const value of values) {
      const shortBuffer = writeShort(value);
      const { value: shortValue } = readShort(shortBuffer);

      expect(shortValue).toBeTypeOf('number');
      expect(shortValue).toBe(value);
    }
  });

  test('encode and decode unsigned short', () => {
    const values = [0, 10, 65535];

    for (const value of values) {
      const unsignedShortBuffer = writeUnsignedShort(value);
      const { value: unsignedShortValue } = readUnsignedShort(unsignedShortBuffer);

      expect(unsignedShortValue).toBeTypeOf('number');
      expect(unsignedShortValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | int', () => {
  test('encode and decode int', () => {
    const values = [-2147483648, 2147483647, 100, -100, 0];

    for (const value of values) {
      const intBuffer = writeInt(value);
      const { value: intValue } = readInt(intBuffer);

      expect(intValue).toBeTypeOf('number');
      expect(intValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | long', () => {
  test('encode and decode long', () => {
    const values = [-9223372036854775808n, 9223372036854775807n, 100n, -100n, 0n];

    for (const value of values) {
      const longBuffer = writeLong(value);
      const { value: longValue } = readLong(longBuffer);

      expect(longValue).toBeTypeOf('bigint');
      expect(longValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | float', () => {
  test('encode and decode float', () => {
    const values = [1, 2, 100.5, -100.5, 0, 1.1];

    for (const value of values) {
      const floatBuffer = writeFloat(value)
      const { value: floatValue } = readFloat(floatBuffer);

      expect(floatValue).toBeTypeOf('number');
      expect(floatValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | double', () => {
  test('encode and decode double', () => {
    const values = [1, 2, 100.55, -100.55, 0, 1.12];

    for (const value of values) {
      const doubleBuffer = writeDouble(value);
      const { value: doubleValue } = readDouble(doubleBuffer);

      expect(doubleValue).toBeTypeOf('number');
      expect(doubleValue).toBe(value);
    }
  });
});
