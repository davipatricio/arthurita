import { HandshakingServerboundHandshakePacket } from '@arthurita/packets';
import type { HandleIncomingPacketOptions } from './handle-incoming';
import Protocol from '@arthurita/packets/src/utils/packets';

const handshakingPackets = Protocol.handshake.serverbound;

function getPacketId<T extends keyof typeof handshakingPackets>(resource: T) {
  return handshakingPackets[resource as T].protocol_id;
}

export function handleHandshakingPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case getPacketId('minecraft:intention'): {
      const pkt = new HandshakingServerboundHandshakePacket(packet.buffer);

      player.metadata.client.protocol = pkt.protocol;
      player.setState(pkt.nextState);

      break;
    }
  }
}
