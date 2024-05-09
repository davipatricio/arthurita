import { UncompressedPacket } from '@/structures';
import type { ClientboundPacket } from '@/typings';
import { writeByte, writeString } from '@arthurita/encoding';

type ChatPosition = 'chatbox' | 'actionbar';

export class PlayClientboundChatMessagePacket extends UncompressedPacket implements ClientboundPacket {
  constructor(
    public readonly payload: string,
    public readonly position: ChatPosition
  ) {
    super();

    this.setID(0x02)._encode();
  }

  _encode() {
    const text = writeString(JSON.stringify({ text: this.payload }));
    const postion = writeByte(this.position === 'chatbox' ? 0 : 2);

    const data = Buffer.concat([text, postion]);

    this.setData(data);
  }
}
