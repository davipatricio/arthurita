import { readFile } from 'node:fs/promises';
import { parseNBT, writeNBTCompound } from '../dist/index.js';

const file = await readFile('./examples/hello-world.nbt');
// const data = await parseNBT(file);

console.log('base hello world', file);

console.log(
  await parseNBT(
    writeNBTCompound({
      name: 'hello world',
      type: 'compound',
      value: [
        {
          name: 'name',
          value: 'Bananrama',
          type: 'string'
        }
      ]
    })
  )
);
