import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

export class ConfigurationServerboundClientInformationPacket extends Packet {
  public locale: string;
  public viewDistance: number;
  public chatMode: number;
  public chatColors: boolean;
  public displayedSkinParts: number;
  public mainHand: number;
  public enableTextFiltering: boolean;
  public allowServerListings: boolean;

  constructor(data: Buffer) {
    super({ id: Protocol.configuration.serverbound['minecraft:client_information'].protocol_id, data });

    this.deserialize();
  }

  deserialize() {
    const locale = this.readString();
    const viewDistance = this.readByte();
    const chatMode = this.readVarInt();
    const chatColors = this.readBoolean();
    const displayedSkinParts = this.readUnsignedByte();
    const mainHand = this.readVarInt();
    const enableTextFiltering = this.readBoolean();
    const allowServerListings = this.readBoolean();

    this.locale = locale;
    this.viewDistance = viewDistance;
    this.chatMode = chatMode;
    this.chatColors = chatColors;
    this.displayedSkinParts = displayedSkinParts;
    this.mainHand = mainHand;
    this.enableTextFiltering = enableTextFiltering;
    this.allowServerListings = allowServerListings;
  }
}
