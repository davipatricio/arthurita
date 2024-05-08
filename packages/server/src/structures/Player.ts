import type { UncompressedPacket, PlayerSettingsChatMode } from '@arthurita/packets';
import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
import type { MCServer } from './MCServer';
import { writeVarInt } from '@arthurita/encoding';

export enum PlayerState {
  Handshaking = 0,
  Status = 1,
  Login = 2,
  Configuration = 3,
  Play = 4
}

export class Player {
  public name: string;
  public state = PlayerState.Handshaking;
  public version = -1;

  // Fields below are only set if state is Playing
  public locale: string;
  public viewDistance: number;
  public chatMode: PlayerSettingsChatMode;
  public hasChatColors: boolean;

  // Internal usage
  private keepAliveId: number;
  private keepAliveInterval: NodeJS.Timeout;

  constructor(
    public socket: Socket,
    public server: MCServer
  ) {
    this.name = `unknown-${randomBytes(10).toString('hex')}`;
  }

  sendPacket(packet: UncompressedPacket) {
    if (this.socket.destroyed) return;

    this.socket.write(packet.toBuffer());
  }

  _startKeepAlive() {
    this.keepAliveInterval = setInterval(() => {
      if (this.socket.destroyed) {
        clearInterval(this.keepAliveInterval);
        return;
      }

      this.keepAliveId = Math.floor(Math.random() * 100);

      const packetId = writeVarInt(0x00);
      const keepAliveID = writeVarInt(this.keepAliveId);
      const packetLength = writeVarInt(packetId.length + keepAliveID.length);

      console.log('Sending keepalive');

      this.socket.write(Buffer.from([...packetLength, ...packetId, ...keepAliveID]));
    }, 5000);
  }

  _stopKeepAlive() {
    clearInterval(this.keepAliveInterval);
  }

  _getStoredKeepAliveId() {
    return this.keepAliveId;
  }
}
