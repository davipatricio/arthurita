import { Server } from 'node:net';
import { PlayerState, UnknownPlayer } from './UnknownPlayer';
import type { Player } from './Player';
import { UncompressedPacket } from '@arthurita/packets';
import handleIncomingPacket from '@/versions/packetHandler';

interface MCServerOptions {
  port: number;
}

export class MCServer {
  public options: MCServerOptions;
  private netServer: Server;

  /**
   * Don't use this directly. Use `server.players` to get all connected players
   */
  public _rawPlayers: Map<string, UnknownPlayer> = new Map();

  constructor(options?: Partial<MCServerOptions>) {
    this.options = Object.assign({ port: 25565 }, options);
  }

  async start() {
    return new Promise<void>((resolve) => {
      this.netServer = new Server({ noDelay: true });
      this.netServer.listen(this.options.port, () => {
        this.setupListeners();
        resolve();
      });
    });
  }

  get players() {
    const players: Player[] = [];

    for (const player of this._rawPlayers.values()) {
      if (player.state === PlayerState.Play) players.push(player);
    }

    return players;
  }

  private setupListeners() {
    this.netServer.on('connection', (socket) => {
      const player = new UnknownPlayer(socket);
      this._rawPlayers.set(player.name, player);

      socket.on('data', (data) => {
        const packets = UncompressedPacket.fromBuffer(data);
        for (const packet of packets) handleIncomingPacket(packet, player);
      });

      socket.on('close', () => {
        this._rawPlayers.delete(player.name);
        player.socket.destroy();
      });
    });
  }
}
