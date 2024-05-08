import type ServerListPingEvent from "@/events/ServerListPingEvent";

export interface MCServerEvents {
  serverListPing(event: ServerListPingEvent): void;
}
