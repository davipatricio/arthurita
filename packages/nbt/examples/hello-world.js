import { parseNBT } from '../dist/index.js';
import { readFile } from 'node:fs/promises';

const file = await readFile('./examples/servers.dat');
console.log(parseNBT(file));
