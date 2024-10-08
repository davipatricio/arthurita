import EventEmitter from 'node:events';
import { Server } from 'node:net';
import { PlayerQuitEvent } from '@/events/PlayerQuitEvent';
import type { MCServerEvents } from '@/types/events';
import callEvents from '@/utils/callEvents';
import handleIncomingPacket from '@/versions/packetHandler';
import { UncompressedPacket } from '@arthurita/packets';
import { Player, PlayerState } from './Player';

interface MCServerOptions {
  port: number;
  debugUnsupportedPackets?: boolean;
}

export class MCServer extends EventEmitter {
  public options: MCServerOptions;
  private netServer: Server;

  /**
   * Don't use this directly. Use `server.players` to get all connected players
   */
  public _rawPlayers: Map<string, Player> = new Map();

  constructor(options?: Partial<MCServerOptions>) {
    super();

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

  broadcast(type: 'actionbar' | 'chatbox', message: string) {
    for (const player of this.players) {
      player.send(type, message);
    }
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
      const player = new Player(socket, this);
      this._rawPlayers.set(player.name, player);

      socket.on('data', (data) => {
        const packets = UncompressedPacket.fromBuffer(data);
        for (const packet of packets) handleIncomingPacket(packet, player);
      });

      socket.on('close', () => {
        this._rawPlayers.delete(player.name);
        player.socket.destroy();

        if (player.state === PlayerState.Play) {
          const event = new PlayerQuitEvent(player);
          callEvents(this, 'playerQuit', event);
        }
      });
    });
  }

  public on<T extends keyof MCServerEvents>(event: T, listener: MCServerEvents[T]): this {
    return super.on(event, listener);
  }

  public once<T extends keyof MCServerEvents>(event: T, listener: MCServerEvents[T]): this {
    return super.once(event, listener);
  }

  public off<T extends keyof MCServerEvents>(event: T, listener: MCServerEvents[T]): this {
    return super.off(event, listener);
  }

  public emit<T extends keyof MCServerEvents>(event: T, ...args: Parameters<MCServerEvents[T]>): boolean {
    return super.emit(event, ...args);
  }
}
