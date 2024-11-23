import { Packet } from '@/structures/Packet';

export class HandshakingServerboundHandshakePacket extends Packet {
  public protocol: number;
  public serverAddress: string;
  public serverPort: number;
  public nextState: number;

  constructor(data: Buffer) {
    super({ id: 0x00, data });

    this.parse();
  }

  parse() {
    const protocol = this.readVarInt();
    const serverAddress = this.readString();
    const serverPort = this.readUnsignedShort();
    const nextState = this.readVarInt();

    this.protocol = protocol;
    this.serverAddress = serverAddress;
    this.serverPort = serverPort;
    this.nextState = nextState;
  }
}
