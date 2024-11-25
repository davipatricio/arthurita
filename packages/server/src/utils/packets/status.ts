import {
  StatusClientboundPongResponsePacket,
  StatusClientboundStatusResponsePacket,
  StatusServerboundPingRequestPacket
} from '@arthurita/packets';
import { Protocol } from '@arthurita/packets/src/utils/packets';
import type { HandleIncomingPacketOptions } from './handle-incoming';

export function handleStatusPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case Protocol.Status.Serverbound.StatusRequest.Id: {
      const pkt = new StatusClientboundStatusResponsePacket({
        version: {
          name: '1.21.3',
          protocol: 768
        },
        players: {
          max: 2024,
          online: 1,
          sample: [{ name: 'thinkofdeath', id: 'a566329f-c907-48ee-8d71-d7ba5aa00d20' }]
        },
        description: {
          text: 'Hello, world!'
        }
      });

      player.sendPacket(pkt);
      break;
    }

    case Protocol.Status.Serverbound.PingRequest.Id: {
      const pingRequestPacket = new StatusServerboundPingRequestPacket(packet.buffer);
      const pongResponsePacket = new StatusClientboundPongResponsePacket({ timestamp: pingRequestPacket.timestamp });

      player.sendPacket(pongResponsePacket);
      player.socket.end();
      break;
    }
  }
}
