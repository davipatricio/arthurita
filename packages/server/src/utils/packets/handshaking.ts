import { HandshakingServerboundHandshakePacket } from '@arthurita/packets';
import { Protocol } from '@arthurita/packets/src/utils/packets';
import type { HandleIncomingPacketOptions } from './handle-incoming';

export function handleHandshakingPackets({ player, packet }: HandleIncomingPacketOptions) {
  switch (packet.id) {
    case Protocol.Handshaking.Serverbound.Handshake.Id: {
      const pkt = new HandshakingServerboundHandshakePacket(packet.buffer);

      player.metadata.client.protocol = pkt.protocol;
      player.setState(pkt.nextState);

      break;
    }
  }
}
