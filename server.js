import { register } from 'tsx/esm/api';

register();
process.env.NODE_ENV ??= 'production';
void import('./server.ts').catch((error) => {
  console.error('Failed to start FitPulse server:', error);
  process.exit(1);
});