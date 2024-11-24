import { Packet } from '#structures/Packet';

interface LoginClientboundLoginSuccessPacketPayload {
  username: string;
  uuid: string;
}

export class LoginClientboundLoginSuccessPacket extends Packet {
  constructor(payload?: LoginClientboundLoginSuccessPacketPayload) {
    super({ id: 0x02 });

    if (payload) this.serialize(payload);
  }

  serialize(payload: LoginClientboundLoginSuccessPacketPayload) {
    this.putUUID(payload.uuid);
    this.putString(payload.username);
    this.putVarInt(0);
  }
}
