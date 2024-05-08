import { UncompressedPacket } from '@/structures';
import { readString, readUnsignedShort, readVarInt } from '@arthurita/encoding';

export class StatusServerboundStatusRequestPacket extends UncompressedPacket {
  public protocolVersion!: number;
  public serverAddress!: string;
  public serverPort!: number;
  public nextState!: number;

  constructor(data: Buffer) {
    super();

    this.setID(0x00);
    this.setData(data);
    this.decode();
  }

  private decode() {
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
