import type { Player } from '@/structures/Player';
import { type UncompressedPacket, getVersionPackets } from '@arthurita/packets';

export function handleHandshake(packet: UncompressedPacket, player: Player) {
  const packets = getVersionPackets(47);
  const statusRequest = new packets.StatusServerboundHandshakePacket(packet.data);

  player.version = statusRequest.protocolVersion;
  player.state = statusRequest.nextState;
}
