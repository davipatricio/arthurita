import ServerListPingEvent from '@/events/ServerListPingEvent';
import type { Player } from '@/structures/Player';
import callEvents from '@/utils/callEvents';
import { readLong } from '@arthurita/encoding';
import type { UncompressedPacket } from '@arthurita/packets';
import { getVersionPackets } from '@arthurita/packets';

export function handleStatusRequest(_packet: UncompressedPacket, player: Player) {
  const event = new ServerListPingEvent(player);
  callEvents(player.server, 'serverListPing', event);

  const packets = getVersionPackets(player.version);
  const packet = new packets.StatusClientboundStatusResponsePacket(event.data);

  player.sendPacket(packet);
}

export function handlePingRequest(packet: UncompressedPacket, player: Player) {
  const packets = getVersionPackets(player.version);
  const payload = readLong(packet.data);

  const responsePacket = new packets.StatusClientboundPingResponsePacket(payload.value);

  player.sendPacket(responsePacket);
  player.socket.destroy();
}
