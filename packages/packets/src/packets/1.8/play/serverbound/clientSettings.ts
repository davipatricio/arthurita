import { UncompressedPacket } from '@/structures';
import type { PlayerSettingsChatMode, ServerboundPacket } from '@/typings';
import { readBoolean, readByte, readString } from '@arthurita/encoding';

export class PlayServerboundClientSettingsPacket extends UncompressedPacket implements ServerboundPacket {
  public locale: string;
  public viewDistance: number;
  public chatMode: PlayerSettingsChatMode;
  public hasChatColors: boolean;
  public displayedSkinParts: number;

  constructor(data: Buffer) {
    super();

    this.setID(0x15).setData(data)._decode();
  }

  toJSON() {
    return {
      locale: this.locale,
      viewDistance: this.viewDistance,
      chatMode: this.chatMode,
      hasChatColors: this.hasChatColors,
      displayedSkinParts: this.displayedSkinParts
    };
  }

  _decode() {
    let offset = 0;
    const locale = readString(this.data);
    offset += locale.length;

    const viewDistance = readByte(this.data.subarray(offset));
    offset += viewDistance.length;

    const chatMode = readByte(this.data.subarray(offset));
    offset += chatMode.length;

    const hasChatColors = readBoolean(this.data.subarray(offset));
    offset += hasChatColors.length;

    const displayedSkinParts = readByte(this.data.subarray(offset));
    offset += displayedSkinParts.length;

    this.locale = locale.value;
    this.viewDistance = viewDistance.value;
    this.chatMode = chatMode.value;
    this.hasChatColors = hasChatColors.value;
    this.displayedSkinParts = displayedSkinParts.value;
  }
}
