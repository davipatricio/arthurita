import {
  readDouble,
  readFloat,
  readInt,
  readLong,
  readOldPosition,
  readShort,
  readString,
  readUUID,
  readUnsignedShort,
  readVarInt,
  readVarLong,
  writeDouble,
  writeFloat,
  writeInt,
  writeLong,
  writeOldPosition,
  writeShort,
  writeString,
  writeUUID,
  writeUnsignedShort,
  writeVarInt,
  writeVarLong
} from 'dist';
import { describe, expect, test } from 'vitest';

describe('@arthurita/encoding | strings', () => {
  test('encode and decode a string correctly', () => {
    const string = 'hello world';
    // maximum string length is 32767
    const stringToThrow = 'a'.repeat(32768);

    const buffer = writeString(string);
    const { value } = readString(buffer);

    expect(value.length).toBe(string.length);
    expect(value).toBeTypeOf('string');
    expect(value).toBe(string);

    expect(() => writeString(stringToThrow)).toThrow();
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
    const values = [9223372036854775807n, 100n, 0n];

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
    const values = [32767, -32768, 100, -100, 0];
    const valuesToThrow = [99999, -99999];

    for (const value of values) {
      const shortBuffer = writeShort(value);
      const { value: shortValue } = readShort(shortBuffer);

      expect(shortValue).toBeTypeOf('number');
      expect(shortValue).toBe(value);
    }

    for (const value of valuesToThrow) {
      expect(() => writeShort(value)).toThrow();
    }
  });

  test('encode and decode unsigned short', () => {
    const values = [0, 10, 25565, 65535];
    const valuesToThrow = [99999, -99999];

    for (const value of values) {
      const unsignedShortBuffer = writeUnsignedShort(value);
      const { value: unsignedShortValue } = readUnsignedShort(unsignedShortBuffer);

      expect(unsignedShortValue).toBeTypeOf('number');
      expect(unsignedShortValue).toBe(value);
    }

    for (const value of valuesToThrow) {
      expect(() => writeUnsignedShort(value)).toThrow();
    }
  });
});

describe('@arthurita/encoding | int', () => {
  test('encode and decode int', () => {
    const values = [-2147483648, 2147483647, 100, -100, 0];
    const valuesToThrow = [-2147483649, -999999999999, 999999999999];

    for (const value of values) {
      const intBuffer = writeInt(value);
      const { value: intValue } = readInt(intBuffer);

      expect(intValue).toBeTypeOf('number');
      expect(intValue).toBe(value);
    }

    for (const value of valuesToThrow) {
      expect(() => writeInt(value)).toThrow();
    }
  });
});

describe('@arthurita/encoding | long', () => {
  test('encode and decode long', () => {
    const values = [-9223372036854775808n, 9223372036854775807n, 100n, -100n, 0n];
    const valuesToThrow = [-9223372036854775809n, -999999999999999999999999999999999999999n, 999999999999999999999999999999999999999n];

    for (const value of values) {
      const longBuffer = writeLong(value);
      const { value: longValue } = readLong(longBuffer);

      expect(longValue).toBeTypeOf('bigint');
      expect(longValue).toBe(value);
    }

    for (const value of valuesToThrow) {
      expect(() => writeLong(value)).toThrow();
    }
  });
});

describe('@arthurita/encoding | float', () => {
  test('encode and decode float', () => {
    const values = [1, 2, 100.5, -100.5, 0, 1.1];

    for (const value of values) {
      const floatBuffer = writeFloat(value);
      const { value: floatValue } = readFloat(floatBuffer);

      expect(floatValue).toBeTypeOf('number');
      expect(floatValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | double', () => {
  test('encode and decode double', () => {
    const values = [1, 2, 100.55, -100.55, 0, 1.12, 1.2, 666.6, 823.12, 0.03, -0.05];

    for (const value of values) {
      const doubleBuffer = writeDouble(value);
      const { value: doubleValue } = readDouble(doubleBuffer);

      expect(doubleValue).toBeTypeOf('number');
      expect(doubleValue).toBe(value);
    }
  });
});

describe('@arthurita/encoding | read from raw packet', () => {
  const basePacket = Buffer.from([
    // Packet ID
    ...writeVarInt(2),
    // Packet Data
    // Protocol Version
    ...writeVarInt(47),
    // Server Address
    ...writeString('very long random string'),
    // Server Port
    ...writeUnsignedShort(25565),
    // Next State
    ...writeVarInt(1)
  ]);

  const handshakePacket = Buffer.concat([writeVarInt(basePacket.length), basePacket]);

  test('decode packet data', () => {
    let offset = 0;

    const packetLength = readVarInt(handshakePacket);
    offset += packetLength.length;

    const packetId = readVarInt(handshakePacket.subarray(offset));
    offset += packetId.length;

    const packetData = handshakePacket.subarray(offset);
    offset = 0;

    const protocolVersion = readVarInt(packetData);
    offset += protocolVersion.length;

    const serverAddress = readString(packetData.subarray(offset));
    offset += serverAddress.length;

    const serverPort = readUnsignedShort(packetData.subarray(offset));
    offset += serverPort.length;

    const nextState = readVarInt(packetData.subarray(offset));

    expect(packetLength.value).toBe(basePacket.length);
    expect(packetId.value).toBe(2);
    expect(protocolVersion.value).toBe(47);
    expect(serverAddress.value).toBe('very long random string');
    expect(serverPort.value).toBe(25565);
    expect(nextState.value).toBe(1);
  });
});

describe('@arthurita/encoding | position', () => {
  test('encode and decode position', () => {
    const positionBuffer = writeOldPosition({ x: 0n, y: 0n, z: 0n });
    const { value: position } = readOldPosition(positionBuffer);

    expect(position).toStrictEqual({ x: 0n, y: 0n, z: 0n });
  });
});

describe('@arthurita/encoding | uuid', () => {
  test('encode and decode uuid', () => {
    const values = ['Notch', 'OfflinePlayer:Notch', 'davipatricio', 'a'.repeat(40)];
    const uuids = [
      'ec153d28-bf79-3358-a77e-c7c4de2934cd',
      'dbada1bb-c3b6-3839-a50d-543d675f92fa',
      '6122d455-6301-3bda-93bb-380fbda108c4',
      '13c085b8-0e53-35ed-bd46-f814ae2cd6cf'
    ];

    let i = 0;
    for (const value of values) {
      const uuidBuffer = writeUUID(value);
      const { value: uuid } = readUUID(uuidBuffer);

      expect(uuid).toBe(uuids[i]);
      i++;
    }
  });
});
