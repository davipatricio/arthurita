import { readFile } from 'node:fs/promises';
import { parseNBT } from '../dist/index.js';

const file = await readFile('./examples/servers.dat');
console.log(parseNBT(file));
