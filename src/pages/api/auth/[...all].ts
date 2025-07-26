import { toNodeHandler } from 'better-auth/node';
import  auth from '@/lib/auth/index';

// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);