import { randomBytes } from 'node:crypto';
import type { Socket } from 'node:net';
import {
  ConfigurationClientboundDisconnectPacket,
  LoginClientboundDisconnectPacket,
  type Packet,
  PlayClientboundDisconnectPacket
} from '@arthurita/packets';
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
    protocol: number;
  }>;
}

export class Player {
  public username: string;
  public uuid: string;
  public metadata: PlayerData;
  public state = PlayerState.Handshaking;

  protected readonly heartbeater = new PlayerHeartbeater(this);

  public constructor(public readonly socket: Socket) {
    this.username = `unknown-${randomBytes(10).toString('hex')}`;
    this.uuid = '00000000-0000-0000-0000-000000000000';
    this.metadata = {
      client: {}
    };
  }

  public sendPacket(packet: Packet) {
    this.socket.write(packet.payload);
  }

  public disconnect(reason: string) {
    let packet = null;

    switch (this.state) {
      case PlayerState.Login:
        packet = new LoginClientboundDisconnectPacket({ reason });
        break;
      case PlayerState.Configuration:
        packet = new ConfigurationClientboundDisconnectPacket({ reason });
        break;
      case PlayerState.Play:
        packet = new PlayClientboundDisconnectPacket({ reason });
        break;
    }

    if (packet == null) {
      this.socket.end();
      return;
    }

    this.sendPacket(packet);
  }

  public setState(state: PlayerState) {
    if (state > PlayerState.Play || state < PlayerState.Handshaking) {
      throw new Error('Invalid player state');
    }

    this.state = state;
  }
}
