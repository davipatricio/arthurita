export * from '@/typings';
export * from '@/structures';

export function getVersionPackets(protocol: number) {
  switch (protocol) {
    case 47: {
      const v1_8_packets = require('@/versions/1.8') as typeof import('@/versions/1.8');
      return v1_8_packets;
    }
  }

  throw new Error(`Unknown protocol version: ${protocol}`);
}
