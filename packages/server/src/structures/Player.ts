import type { Socket } from 'node:net';
import { UnknownPlayer } from './UnknownPlayer';

export class Player extends UnknownPlayer {
  constructor(public socket: Socket) {
    super(socket);
  }
}
