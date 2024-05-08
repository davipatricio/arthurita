import { PlayerState, type Player } from '@/structures/Player';
import type { UncompressedPacket } from '@arthurita/packets';
import { ServerDifficulty, getVersionPackets } from '@arthurita/packets';

const packets = getVersionPackets(47);

export function handleLoginStart(packet: UncompressedPacket, player: Player) {
  const loginPacket = new packets.LoginServerboundLoginStartPacket(packet.data);

  player.name = loginPacket.playerName;

  sendLoginSuccess(player);
  player.state = PlayerState.Play;

  const joinGamePacket = new packets.PlayClientboundJoinGamePacket();
  player.sendPacket(joinGamePacket);

  const serverDifficultyPacket = new packets.PlayClientboundServerDifficultyPacket(ServerDifficulty.PEACEFUL);
  player.sendPacket(serverDifficultyPacket);
}

function sendLoginSuccess(player: Player) {
  const packet = new packets.LoginClientboundLoginSuccessPacket(player.name);
  player.sendPacket(packet);
}
