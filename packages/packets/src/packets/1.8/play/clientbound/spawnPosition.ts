import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeOldPosition } from '@arthurita/encoding';

interface PlayClientboundSpawnPositionPayload {
  x: bigint;
  y: bigint;
  z: bigint;
}

export class PlayClientboundSpawnPositionPacket extends UncompressedPacket implements ClientboundPacket {
  constructor(public readonly payload: PlayClientboundSpawnPositionPayload) {
    super();

    this.setID(0x05)._encode();
  }

  _encode() {
    const buffer = writeOldPosition(this.payload);

    const data = Buffer.concat([buffer]);

    this.setData(data);
  }
}
