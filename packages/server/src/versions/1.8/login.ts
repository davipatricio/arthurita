import { PlayerState, type Player } from '@/structures/Player';
import { writeString } from '@arthurita/encoding';
import type { UncompressedPacket } from '@arthurita/packets';
import { ServerDifficulty, getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

// https://wiki.vg/index.php?title=Protocol_FAQ&oldid=8076
export function handleLoginStart(packet: UncompressedPacket, player: Player) {
  const loginPacket = new packets.LoginServerboundLoginStartPacket(packet.data);

  player.name = loginPacket.playerName;
  player.state = PlayerState.Play;

  sendLoginSuccess(player);

  // https://wiki.vg/index.php?title=Plugin_channels&oldid=7435#MC.7CBrand
  // For version 1.12.2(protocol version 340) and below, channel name is: MC|Brand
  const brandPacket = new packets.PlayClientboundPluginMessagePacket('MC|Brand', writeString('arthurita'));
  player._sendPacket(brandPacket);

  const joinGamePacket = new packets.PlayClientboundJoinGamePacket();
  player._sendPacket(joinGamePacket);

  const serverDifficultyPacket = new packets.PlayClientboundServerDifficultyPacket(ServerDifficulty.PEACEFUL);
  player._sendPacket(serverDifficultyPacket);

  const spawnPositionPacket = new packets.PlayClientboundSpawnPositionPacket({ x: 0n, y: 0n, z: 0n });
  player._sendPacket(spawnPositionPacket);

  const abilitiesPacket = new packets.PlayClientboundPlayerAbilitiesPacket({ flags: 0, fieldOfViewModifier: 0.1, flyingSpeed: 0.05 });
  player._sendPacket(abilitiesPacket);

  player._startKeepAlive();
}

function sendLoginSuccess(player: Player) {
  const packet = new packets.LoginClientboundLoginSuccessPacket(player.name);
  player._sendPacket(packet);
}
