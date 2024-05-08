export abstract class ClientboundPacket {
  abstract _encode(): void;
}

export abstract class ServerboundPacket {
  abstract toJSON(): unknown;
  abstract _decode(): void;
}
