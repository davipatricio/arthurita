import { Server } from 'node:net';
import { handleIncomingPacket } from '@/utils/packets/handle-incoming-packet';
import { Packet } from '@arthurita/packets';
import { Player } from './Player';

interface MCServerOptions {
  debug: boolean;
  host: string;
  port: number;
  maxPlayers: number;
  // whether to allow malformed names (allowed: A-Z, a-z, _, 0-9) (default: false)
  allowMalformedNames: boolean;
  serverList: {
    versionName: string;
    motd: string;
  };
}

const defaultOptions: MCServerOptions = {
  debug: false,
  host: '0.0.0.0',
  port: 25565,
  maxPlayers: 20,
  allowMalformedNames: false,
  serverList: {
    versionName: '1.21.3',
    motd: 'A Minecraft Server'
  }
};

export class MCServer {
  private readonly netServer: Server;
  public options: MCServerOptions;

  constructor(options?: Partial<MCServerOptions>) {
    this.options = { ...defaultOptions, ...options };
    this.netServer = new Server({ noDelay: true });
  }

  async start() {
    return new Promise<void>((resolve) => {
      this.netServer.listen({ host: this.options.host, port: this.options.port }, () => {
        if (this.options.debug) console.log(`Server listening on ${this.options.host}:${this.options.port}`);
        this.startHandleConnections();
        resolve();
      });
    });
  }

  private startHandleConnections() {
    this.netServer.on('connection', (socket) => {
      const player = new Player(socket);

      socket.on('data', (data) => {
        const packets = Packet.from(data);

        for (const packet of packets) handleIncomingPacket({ player, packet });
      });
    });
  }
}
