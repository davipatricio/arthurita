import { Packet } from '@arthurita/packets';
import type { Player } from './Player';

export enum HeartbeatStatus {
  ACKED = 'ACKED',
  SENT = 'SENT',
  TIMEOUT = 'TIMEOUT'
}

export class PlayerHeartbeater {
  private _ackedTimer: Timer;
  private _interval: Timer;
  public sequence = 0;
  public status = HeartbeatStatus.ACKED;

  constructor(public player: Player) {}

  start() {
    this._interval = setInterval(() => {
      if (this.status !== 'ACKED') return;

      if (this.player.socket.readyState !== 'open') {
        this.stop();
        return;
      }

      this.sendHeartbeat();

      // close connection if keepalive is not acknowledged within 30 seconds
      this._ackedTimer = setTimeout(() => {
        if (this.player.socket.readyState !== 'open') return;

        if (this.status !== 'ACKED') {
          this.stop();
          this.player.socket.end();
        }
      }, 30000);
    }, 500);
  }

  sendHeartbeat() {
    this.status = HeartbeatStatus.SENT;
    this.sequence++;

    // TODO: create a proper packet
    const _temporaryKeepAlivePacket = new Packet({
      id: 0x00
    });

    _temporaryKeepAlivePacket.putVarInt(this.sequence);

    this.player.sendPacket(_temporaryKeepAlivePacket);
  }

  stop() {
    clearInterval(this._interval);
    clearTimeout(this._ackedTimer);
  }

  ack() {
    this.status = HeartbeatStatus.ACKED;
    clearTimeout(this._ackedTimer);
  }
}
