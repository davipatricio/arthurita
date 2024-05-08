import type { UncompressedPacket } from '@arthurita/packets';
import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
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
}
