import type { StatusResponsePayload } from '@arthurita/packets';
import type { MCServer, Player } from '..';

export class ServerListPingEvent {
  public readonly data: StatusResponsePayload;
  public readonly server: MCServer;

  public constructor(public readonly player: Player) {
    this.server = player.server;

    this.data = {
      players: {
        max: 100,
        online: 0,
        sample: []
      },
      description: {
        text: 'Hello world!\nMulti-line support with §a§lcolors!'
      },
      version: {
        name: '1.8.9',
        protocol: 47
      },
      enforcesSecureChat: false,
      previewsChat: false
    };
  }

  public setMaxPlayers(maxPlayers: number) {
    this.data.players.max = maxPlayers;
    return this;
  }

  public setPlayers(players: number) {
    this.data.players.online = players;
    return this;
  }

  public setDescription(data: string) {
    this.data.description.text = data;
    return this;
  }

  public setVersionProtocol(protocol: number) {
    this.data.version.protocol = protocol;
    return this;
  }

  public setVersionName(name: string) {
    this.data.version.name = name;
    return this;
  }

  public setData(data: Partial<StatusResponsePayload>) {
    Object.assign(this.data, data);
    return this;
  }
}
