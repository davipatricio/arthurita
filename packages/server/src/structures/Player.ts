import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
import type { Packet } from '@arthurita/packets';
import { PlayerHeartbeater } from './PlayerHeartbeater';

export enum PlayerState {
  Handshaking = 0,
  Status = 1,
  Login = 2,
  Configuration = 3,
  Play = 4
}

enum PlayerChatMode {
  Enabled = 0,
  CommandsOnly = 1,
  Hidden = 2
}

interface PlayerData {
  client: Partial<{
    brand: string;
    locale: string;
    viewDistance: number;
    chatMode: PlayerChatMode;
    chatColors: boolean;
    displayedSkinParts: number;
    isCharacterRightHanded: boolean;
    textFiltering: boolean;
    allowServerList: boolean;
  }>;
}

export class Player {
  public username: string;
  public uuid: string;
  public metadata: PlayerData;
  public state = PlayerState.Handshaking;

  protected readonly heartbeater: PlayerHeartbeater;

  public constructor(public readonly socket: Socket) {
    this.username = `unknown-${randomBytes(10).toString('hex')}`;
    this.uuid = '00000000-0000-0000-0000-000000000000';
    this.metadata = {
      client: {}
    };

    this.heartbeater = new PlayerHeartbeater(this);
  }

  public sendPacket(packet: Packet) {
    // @ts-expect-error
    this.socket.write(packet.payload);
  }

  public setState(state: PlayerState) {
    if (![PlayerState.Handshaking, PlayerState.Status, PlayerState.Login, PlayerState.Configuration, PlayerState.Play].includes(state)) {
      throw new Error('Invalid player state');
    }

    this.state = state;
  }
}
