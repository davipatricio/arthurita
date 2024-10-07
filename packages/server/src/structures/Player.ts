import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
import { type PlayerSettingsChatMode, type UncompressedPacket, getVersionPackets } from '@arthurita/packets';
import type { MCServer } from './MCServer';
import { PlayerHeartbeater } from './PlayerHeartbeater';

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
  public _heartbeater: PlayerHeartbeater;

  constructor(
    public socket: Socket,
    public server: MCServer
  ) {
    this.name = `unknown-${randomBytes(10).toString('hex')}`;
    this._heartbeater = new PlayerHeartbeater(this);
  }

  send(type: 'actionbar' | 'chatbox', message: string) {
    const packets = getVersionPackets(this.version);
    const chatMessagePacket = new packets.PlayClientboundChatMessagePacket(message, type);
    this.sendPacket(chatMessagePacket);
  }

  sendPacket(packet: UncompressedPacket) {
    if (this.socket.destroyed) return;

    this.socket.write(packet.toBuffer());
  }
}
