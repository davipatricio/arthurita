import type { MCServer } from '@/structures/MCServer';
import type { Player } from '..';

export class PlayerJoinEvent {
  public readonly server: MCServer;

  public constructor(public readonly player: Player) {
    this.server = player.server;
  }
}
