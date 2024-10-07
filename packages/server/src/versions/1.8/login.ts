import { type Player, PlayerState } from '@/structures';
import type { UncompressedPacket } from '@arthurita/packets';
import { ServerDifficulty, getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

// https://wiki.vg/index.php?title=Protocol_FAQ&oldid=8076
export function handleLoginStart(packet: UncompressedPacket, player: Player) {
  const loginPacket = new packets.LoginServerboundLoginStartPacket(packet.data);
  player.name = loginPacket.playerName;
  player.state = PlayerState.Play;

  sendLoginSuccess(player);

  const joinGamePacket = new packets.PlayClientboundJoinGamePacket();
  player.sendPacket(joinGamePacket);

  const serverDifficultyPacket = new packets.PlayClientboundServerDifficultyPacket(ServerDifficulty.PEACEFUL);
  player.sendPacket(serverDifficultyPacket);

  const spawnPositionPacket = new packets.PlayClientboundSpawnPositionPacket({ x: 0n, y: 0n, z: 0n });
  player.sendPacket(spawnPositionPacket);

  const abilitiesPacket = new packets.PlayClientboundPlayerAbilitiesPacket({ flags: 0, fieldOfViewModifier: 0.1, flyingSpeed: 0.05 });
  player.sendPacket(abilitiesPacket);

  player._heartbeater.start();
}

function sendLoginSuccess(player: Player) {
  const packet = new packets.LoginClientboundLoginSuccessPacket(player.name);
  player.sendPacket(packet);
}
