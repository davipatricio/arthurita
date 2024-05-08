import type { Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

export function handleLoginStart(packet: UncompressedPacket, player: Player) {
  const loginPacket = new packets.LoginServerboundLoginStartPacket(packet.data);

  player.name = loginPacket.playerName;
}
