import type { MCServer, Player } from '@/structures';

export class PlayerQuitEvent {
  public readonly server: MCServer;

  public constructor(public readonly player: Player) {
    this.server = player.server;
  }
}
