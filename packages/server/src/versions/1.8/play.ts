import type { Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

export function handleClientSettings(packet: UncompressedPacket, player: Player) {
  const settings = new packets.PlayServerboundClientSettingsPacket(packet.data);

  player.locale = settings.locale;
  player.viewDistance = settings.viewDistance;
  player.chatMode = settings.chatMode;
  player.hasChatColors = settings.hasChatColors;
}
