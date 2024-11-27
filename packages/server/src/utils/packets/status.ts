import {
  StatusClientboundPongResponsePacket,
  StatusClientboundStatusResponsePacket,
  StatusServerboundPingRequestPacket
} from '@arthurita/packets';
import type { HandleIncomingPacketOptions } from './handle-incoming';
import Protocol from '@arthurita/packets/src/utils/packets';

const statusPackets = Protocol.status.serverbound;

function getPacketId<T extends keyof typeof statusPackets>(resource: T) {
  return statusPackets[resource as T].protocol_id;
}

export function handleStatusPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case getPacketId('minecraft:status_request'): {
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

    case getPacketId('minecraft:ping_request'): {
      const pingRequestPacket = new StatusServerboundPingRequestPacket(packet.buffer);
      const pongResponsePacket = new StatusClientboundPongResponsePacket({ timestamp: pingRequestPacket.timestamp });

      player.sendPacket(pongResponsePacket);
      player.socket.end();
      break;
    }
  }
}
