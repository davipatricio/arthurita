import type { UnknownPlayer } from '@/structures/UnknownPlayer';
import { type UncompressedPacket, getVersionPackets } from '@arthurita/packets';

export function handleHandshake(packet: UncompressedPacket, player: UnknownPlayer) {
  const packets = getVersionPackets(47);
  const statusRequest = new packets.StatusServerboundStatusRequestPacket(packet.data);

  player.version = statusRequest.protocolVersion;
  player.state = statusRequest.nextState;
}
