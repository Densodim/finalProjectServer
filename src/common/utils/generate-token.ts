import { randomBytes } from 'crypto';

export const generateApiToken = () => randomBytes(32).toString('hex');
