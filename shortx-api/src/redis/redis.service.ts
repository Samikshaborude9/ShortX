import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;

  private hits = 0;
  private misses = 0;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';

    try {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 3) {
            return null; // Stop reconnecting if server is not present
          }
          return Math.min(times * 100, 1000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to Redis at ${redisUrl}`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Running in fallback mode.`);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      // Non-blocking connection attempt
      this.client.connect().catch((err) => {
        this.isConnected = false;
        this.logger.warn(`Could not connect to Redis: ${err.message}. Fallback mode active.`);
      });
    } catch (err: any) {
      this.logger.warn(`Failed to initialize Redis client: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit().catch(() => {});
    }
  }

  get isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  // Basic Cache Operations
  async get(key: string): Promise<string | null> {
    if (!this.isReady || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds = 3600): Promise<'OK' | null> {
    if (!this.isReady || !this.client) return null;
    try {
      if (ttlSeconds > 0) {
        return await this.client.set(key, value, 'EX', ttlSeconds);
      }
      return await this.client.set(key, value);
    } catch {
      return null;
    }
  }

  async del(...keys: string[]): Promise<number> {
    if (!this.isReady || !this.client || keys.length === 0) return 0;
    try {
      return await this.client.del(...keys);
    } catch {
      return 0;
    }
  }

  // Hit / Miss Metrics
  recordHit(): void {
    this.hits++;
    if (this.hits % 50 === 0) {
      this.logMetrics();
    }
  }

  recordMiss(): void {
    this.misses++;
    if (this.misses % 50 === 0) {
      this.logMetrics();
    }
  }

  getMetrics() {
    const total = this.hits + this.misses;
    const ratio = total > 0 ? ((this.hits / total) * 100).toFixed(2) + '%' : '0.00%';
    return {
      hits: this.hits,
      misses: this.misses,
      total,
      hitRatio: ratio,
    };
  }

  private logMetrics() {
    const metrics = this.getMetrics();
    this.logger.log(
      `[Redis Cache Metrics] Hits: ${metrics.hits} | Misses: ${metrics.misses} | Hit Ratio: ${metrics.hitRatio}`,
    );
  }

  // Sliding Window Rate Limiting
  async checkSlidingWindow(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
    if (!this.isReady || !this.client) {
      // If Redis is temporarily unavailable, allow traffic to prevent outage
      return { allowed: true, remaining: limit, retryAfter: 0 };
    }

    const now = Date.now();
    const clearBefore = now - windowSeconds * 1000;

    try {
      const multi = this.client.multi();
      multi.zremrangebyscore(key, 0, clearBefore);
      multi.zcard(key);
      multi.expire(key, windowSeconds * 2);

      const results = await multi.exec();
      const currentCount = (results?.[1]?.[1] as number) || 0;

      if (currentCount >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfter: windowSeconds,
        };
      }

      await this.client.zadd(key, now, `${now}-${Math.random()}`);

      return {
        allowed: true,
        remaining: Math.max(0, limit - currentCount - 1),
        retryAfter: 0,
      };
    } catch (err: any) {
      this.logger.warn(`Sliding window rate limit error: ${err.message}`);
      return { allowed: true, remaining: limit, retryAfter: 0 };
    }
  }
}
