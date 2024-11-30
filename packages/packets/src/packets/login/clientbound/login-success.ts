import { Packet } from '#structures/Packet';
import Protocol from '#utils/packets';

interface LoginClientboundLoginSuccessPacketPayload {
  username: string;
  uuid: string;
}

export class LoginClientboundLoginSuccessPacket extends Packet {
  constructor(payload?: LoginClientboundLoginSuccessPacketPayload) {
    super({ id: Protocol.login.clientbound['minecraft:login_finished'].protocol_id });

    if (payload) this.serialize(payload);
  }

  serialize(payload: LoginClientboundLoginSuccessPacketPayload) {
    this.putUUID(payload.uuid);
    this.putString(payload.username);
    this.putVarInt(0);
  }
}
