import { Packet } from '@/structures/Packet';

interface LoginClientboundLoginStartPacketPayload {
  username: string;
  uuid: string;
}

export class LoginClientboundLoginStartPacket extends Packet {
  constructor(payload?: LoginClientboundLoginStartPacketPayload) {
    super({ id: 0x02 });

    if (payload) this.serialize(payload);
  }

  serialize(payload: LoginClientboundLoginStartPacketPayload) {
    this.putUUID(payload.uuid);
    this.putString(payload.username);
    this.putVarInt(0);
  }
}
