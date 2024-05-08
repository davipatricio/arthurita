export * from './datatypes';

// const basePacket = Buffer.from([
//   // Packet ID
//   ...writeVarInt(0),
//   // Packet Data
//   // Protocol Version
//   ...writeVarInt(2),
//   // Server Address
//   ...writeString('localhost'),
//   // Server Port
//   ...writeUnsignedShort(25565),
//   // Next State
//   ...writeVarInt(1)
// ]);

// const handshakePacket = Buffer.concat([writeVarInt(basePacket.length), basePacket]);

// console.log({
//   handshakePacket
// })

// let offset = 0;

// const packetLength = readVarInt(handshakePacket);
// offset += packetLength.length;

// const packetId = readVarInt(handshakePacket.subarray(offset));
// offset += packetId.length;

// const packetData = handshakePacket.subarray(offset);
// offset = 0;

// const protocolVersion = readVarInt(packetData);
// offset += protocolVersion.length;

// const serverAddress = readString(packetData.subarray(offset));
// offset += serverAddress.length;

// const serverPort = readUnsignedShort(packetData.subarray(offset));
// offset += serverPort.length;

// const nextState = readVarInt(packetData.subarray(offset));

// console.log({ packetLength, packetId, protocolVersion, serverAddress, serverPort, nextState });
