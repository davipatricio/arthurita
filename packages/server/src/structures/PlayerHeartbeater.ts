import { writeVarInt } from '@arthurita/encoding';
import type { Player } from '..';

export type HeartbeatStatus = 'ACKED' | 'SENT' | 'TIMEOUT';

export class PlayerHeartbeater {
  private _ackedTimer: Timer;
  private _interval: Timer;
  public sequence = 0;
  public status = 'ACKED' as HeartbeatStatus;

  constructor(public player: Player) {}

  start() {
    this._interval = setInterval(() => {
      if (this.status !== 'ACKED') return;

      if (this.player.socket.destroyed) {
        this.stop();
        return;
      }

      this.sendHeartbeat();

      // close connection if keepalive is not acknowledged within 30 seconds
      this._ackedTimer = setTimeout(() => {
        if (this.player.socket.destroyed) return;

        if (this.status !== 'ACKED') {
          this.stop();
          this.player.socket?.destroy();
        }
      }, 30000);
    }, 500);
  }

  sendHeartbeat() {
    this.status = 'SENT';
    this.sequence++;

    const packetId = writeVarInt(0x00);
    const keepAliveID = writeVarInt(this.sequence);
    const packetLength = writeVarInt(packetId.length + keepAliveID.length);

    // TODO: create a proper packet
    this.player.socket.write(Buffer.from([...packetLength, ...packetId, ...keepAliveID]));
  }

  stop() {
    clearInterval(this._interval);
    clearTimeout(this._ackedTimer);
  }

  ack() {
    this.status = 'ACKED';
    clearTimeout(this._ackedTimer);
  }
}
