import { writeString, readString, writeVarInt, readVarInt } from 'dist';
import { test, expect, describe } from 'vitest';

describe('@arthurita/encoding | strings', () => {
  const string = 'hello world';

  test(`encode and decode "${string}" correctly`, () => {
    const buffer = writeString(string);
    const { value } = readString(buffer);

    expect(value.length).toBe(string.length);
    expect(value).toBe(string);
  });
});

describe('@arthurita/encoding | var[ints|long]', () => {
  const number = 100;

  test(`encode and decode the number ${number} correctly`, () => {
    const varintBuffer = writeVarInt(number);
    const { value: varintValue } = readVarInt(varintBuffer);

    expect(varintValue).toBe(number);

    const varlongBuffer = writeVarInt(number);
    const { value: varlongValue } = readVarInt(varlongBuffer);

    expect(varlongValue).toBe(number);
  });
});
