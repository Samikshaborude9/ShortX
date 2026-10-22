import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  keyPrefix: string;
  limit?: number;
  limitResolver?: (req: any) => number;
  windowSeconds?: number;
}

export const RATE_LIMIT_KEY = 'RATE_LIMIT_KEY';
export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);
