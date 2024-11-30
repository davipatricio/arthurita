// https://stackoverflow.com/questions/66304547/javascript-typescript-convert-uuid-from-most-significant-bits-msb-least-signi
const invalidUUIDError = () => new Error('Invalid UUID string');

type SerializedUUID = `${string}-${string}-${string}-${string}-${string}`;

interface UUIDSigBitsOptions {
  lsb: bigint;
  msb: bigint;
}

export function uuidSigBitsToStr({ lsb, msb }: UUIDSigBitsOptions): SerializedUUID {
  return `${digits(msb >> 32n, 8n)}-${digits(msb >> 16n, 4n)}-${digits(msb, 4n)}-${digits(lsb >> 48n, 4n)}-${digits(lsb, 12n)}`;
}

export function uuidStrToSigBits(uuid: string): UUIDSigBitsOptions {
  if (uuid == null || typeof uuid !== 'string') throw invalidUUIDError();

  const parts = uuid.split('-').map((p) => `0x${p}`);
  if (parts.length !== 5) throw invalidUUIDError();

  return {
    // @ts-expect-error
    lsb: (hexStrToBigInt(parts[3]) << 48n) | hexStrToBigInt(parts[4]),
    // @ts-expect-error
    msb: (hexStrToBigInt(parts[0]) << 32n) | (hexStrToBigInt(parts[1]) << 16n) | hexStrToBigInt(parts[2])
  };
}

function digits(val: bigint, ds: bigint) {
  const hi = 1n << (ds * 4n);
  return (hi | (val & (hi - 1n))).toString(16).substring(1);
}

function hexStrToBigInt(hex: string): bigint {
  return BigInt(Number.parseInt(hex, 16));
}
