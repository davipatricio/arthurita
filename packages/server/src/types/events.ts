import type { PlayerJoinEvent, PlayerQuitEvent, ServerListPingEvent } from '@/events';

export interface MCServerEvents {
  serverListPing(event: ServerListPingEvent): void;
  playerJoin(event: PlayerJoinEvent): void;
  playerQuit(event: PlayerQuitEvent): void;
}
