import { readFile } from 'node:fs/promises';
import { compressNBT, parseNBT, writeNBTCompound } from '../dist/index.js';

const file = await readFile('./examples/hello-world.nbt');
// const data = await parseNBT(file);

console.log('base hello world', file);

console.log(
  await parseNBT(
    await compressNBT(
      writeNBTCompound({
        name: 'hello world',
        type: 'compound',
        value: [
          {
            name: 'byte',
            value: 1,
            type: 'byte'
          },
          {
            name: 'double',
            value: 1.123456789,
            type: 'double'
          },
          {
            name: 'float',
            value: 1.123456,
            type: 'float'
          },
          {
            name: 'int',
            value: 2147483647,
            type: 'int'
          },
          {
            name: 'long',
            value: 10n,
            type: 'long'
          },
          {
            name: 'short',
            value: 25565,
            type: 'short'
          },
          {
            name: 'intarray',
            value: [1],
            type: 'intArray'
          },
          {
            name: 'hello',
            value: [1n],
            type: 'longArray'
          },
          {
            name: 'hello',
            value: [1, 2, 3, 4, 255],
            type: 'byteArray'
          }
        ]
      })
    )
  )
);
