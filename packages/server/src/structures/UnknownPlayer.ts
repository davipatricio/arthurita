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
  public state: PlayerState = 0;
  public name: string;

  constructor(public socket: Socket) {
    this.name = `unknown-${randomBytes(10).toString('hex')}`;
  }
}
