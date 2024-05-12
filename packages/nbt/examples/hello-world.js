import { readFile } from 'node:fs/promises';
import { parseNBT } from '../dist/index.js';

const file = await readFile('./examples/bigtest.nbt');
const data = await parseNBT(file);

console.log(data);
