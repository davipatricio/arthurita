import * as v1_8_packets from './versions/1.8';

export function getVersionPackets(protocol: number) {
  switch (protocol) {
    case 47:
      return v1_8_packets;
  }

  throw new Error(`Unknown protocol version: ${protocol}`);
}

export * from './typings';
export * from './structures';
