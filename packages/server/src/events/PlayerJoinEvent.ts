import type { MCServer, Player } from '@/structures';

export class PlayerJoinEvent {
  public readonly server: MCServer;

  public constructor(public readonly player: Player) {
    this.server = player.server;
  }
}
