import { UncompressedPacket } from '@/structures';
import type { ServerboundPacket } from '@/typings';
import { readString, readUnsignedShort, readVarInt } from '@arthurita/encoding';

export class StatusServerboundHandshakePacket extends UncompressedPacket implements ServerboundPacket {
  public protocolVersion: number;
  public serverAddress: string;
  public serverPort: number;
  public nextState: number;

  constructor(data: Buffer) {
    super(data);

    this.setID(0x00)._decode();
  }

  toJSON() {
    return {
      protocolVersion: this.protocolVersion,
      serverAddress: this.serverAddress,
      serverPort: this.serverPort,
      nextState: this.nextState
    };
  }

  _decode() {
    let offset = 0;
    const protocolVersion = readVarInt(this.data);
    offset += protocolVersion.length;

    const serverAddress = readString(this.data.subarray(offset));
    offset += serverAddress.length;

    const serverPort = readUnsignedShort(this.data.subarray(offset));
    offset += serverPort.length;

    const nextState = readVarInt(this.data.subarray(offset));
    offset += nextState.length;

    this.protocolVersion = protocolVersion.value;
    this.serverAddress = serverAddress.value;
    this.serverPort = serverPort.value;
    this.nextState = nextState.value;
  }
}
