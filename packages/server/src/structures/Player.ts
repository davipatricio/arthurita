import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
import { writeVarInt } from '@arthurita/encoding';
import { type PlayerSettingsChatMode, type UncompressedPacket, getVersionPackets } from '@arthurita/packets';
import type { MCServer } from './MCServer';

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
  private keepAliveInterval: Timer;
  private keepAliveAck: boolean;

  constructor(
    public socket: Socket,
    public server: MCServer
  ) {
    this.name = `unknown-${randomBytes(10).toString('hex')}`;
  }

  send(type: 'actionbar' | 'chatbox', message: string) {
    const packets = getVersionPackets(this.version);
    const chatMessagePacket = new packets.PlayClientboundChatMessagePacket(message, type);
    this._sendPacket(chatMessagePacket);
  }

  _sendPacket(packet: UncompressedPacket) {
    if (this.socket.destroyed) return;

    this.socket.write(packet.toBuffer());
  }

  _startKeepAlive() {
    this.keepAliveAck = true;

    this.keepAliveInterval = setInterval(() => {
      if (this.socket.destroyed) {
        clearInterval(this.keepAliveInterval);
        return;
      }

      if (!this.keepAliveAck) return;

      this.keepAliveId = Math.floor(Math.random() * 100);
      this.keepAliveAck = false;

      const packetId = writeVarInt(0x00);
      const keepAliveID = writeVarInt(this.keepAliveId);
      const packetLength = writeVarInt(packetId.length + keepAliveID.length);

      this.socket.write(Buffer.from([...packetLength, ...packetId, ...keepAliveID]));

      // close connection if keepalive is not acknowledged within 30 seconds
      setTimeout(() => {
        if (!this.keepAliveAck) {
          this._stopKeepAlive();
          this.socket.destroy();

          return;
        }
      }, 30000);
    }, 15000);
  }

  _stopKeepAlive() {
    clearInterval(this.keepAliveInterval);
  }

  _ackKeepAlive() {
    this.keepAliveAck = true;
  }

  _getStoredKeepAliveId() {
    return this.keepAliveId;
  }
}
