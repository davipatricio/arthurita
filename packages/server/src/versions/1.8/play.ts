import { PlayerJoinEvent } from '@/events';
import type { Player } from '@/structures';
import callEvents from '@/utils/callEvents';
import type { UncompressedPacket } from '@arthurita/packets';
import { getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

export function handleClientSettings(packet: UncompressedPacket, player: Player) {
  const settings = new packets.PlayServerboundClientSettingsPacket(packet.data);

  player.locale = settings.locale;
  player.viewDistance = settings.viewDistance;
  player.chatMode = settings.chatMode;
  player.hasChatColors = settings.hasChatColors;

  const playerPositionPacket = new packets.PlayClientboundPlayerPositionAndLookPacket({
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    flags: 0
  });
  player.sendPacket(playerPositionPacket);

  const event = new PlayerJoinEvent(player);
  callEvents(player.server, 'playerJoin', event);
}

export function handleKeepAlive(packet: UncompressedPacket, player: Player) {
  const keepAlivePacket = new packets.PlayServerboundKeepAlivePacket(packet.data);
  const id = player._heartbeater.sequence;

  if (keepAlivePacket.keepAliveId !== id) {
    player._heartbeater.stop();
    player.socket.destroy();
    return;
  }

  player._heartbeater.ack();
}
