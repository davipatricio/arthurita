import type { PlayerJoinEvent, ServerListPingEvent } from '@/events';

export interface MCServerEvents {
  serverListPing(event: ServerListPingEvent): void;
  playerJoin(event: PlayerJoinEvent): void;
}
