import { ServerListPingEvent } from '@/events';
import type { Player } from '@/structures/Player';
import callEvents from '@/utils/callEvents';
import type { UncompressedPacket } from '@arthurita/packets';
import { getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

export function handleStatusRequest(_packet: UncompressedPacket, player: Player) {
  const event = new ServerListPingEvent(player);
  callEvents(player.server, 'serverListPing', event);

  const packet = new packets.StatusClientboundStatusResponsePacket(event.data);
  player._sendPacket(packet);
}

export function handlePingRequest(incomingPacket: UncompressedPacket, player: Player) {
  const { payload } = new packets.StatusServerboundPingRequestPacket(incomingPacket.data);
  const packet = new packets.StatusClientboundPingResponsePacket(payload);

  player._sendPacket(packet);
  player.socket.destroy();
}
