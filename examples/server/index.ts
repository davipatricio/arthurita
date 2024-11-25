import { MCServer } from '../../packages/server';

const server = new MCServer({ debug: true });
await server.start();
