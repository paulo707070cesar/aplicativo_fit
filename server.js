import { register } from 'tsx/esm/api';

register();
process.env.NODE_ENV ??= 'production';
await import('./server.ts');