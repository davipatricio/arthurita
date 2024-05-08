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

export function handleKeepAlive(packet: UncompressedPacket, player: Player) {
  const keepAlivePacket = new packets.PlayServerboundKeepAlivePacket(packet.data);
  const id = player._getStoredKeepAliveId();

  if (keepAlivePacket.id !== id) {
    player._stopKeepAlive();
    player.socket.destroy();
  }
}
