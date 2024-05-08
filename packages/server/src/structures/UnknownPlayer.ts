import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';

export enum PlayerState {
  Handshaking = 0,
  Status = 1,
  Login = 2,
  Configuration = 3,
  Play = 4
}

export class UnknownPlayer {
  public name: string;
  public state = PlayerState.Handshaking;
  public version = -1;

  constructor(public socket: Socket) {
    this.name = `unknown-${randomBytes(10).toString('hex')}`;
  }
}
