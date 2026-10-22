import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { RedisService } from '../../redis/redis.service';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';

@Injectable()
export class SlidingRateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const user = (req as any).user;
    const rawIp = req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress;
    const ip = Array.isArray(rawIp)
      ? rawIp[0]
      : typeof rawIp === 'string'
      ? rawIp.split(',')[0].trim()
      : 'unknown';

    let identifier: string;
    let limit: number;

    if (user?.id) {
      identifier = `user:${user.id}`;
      limit = options.limitResolver ? options.limitResolver(req) : options.limit || 100;
    } else {
      identifier = `ip:${ip}`;
      limit = options.limitResolver ? options.limitResolver(req) : options.limit || 10;
    }

    const windowSeconds = options.windowSeconds || 60;
    const key = `ratelimit:${options.keyPrefix}:${identifier}`;

    const result = await this.redisService.checkSlidingWindow(key, limit, windowSeconds);

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
    }

    if (!result.allowed) {
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', result.retryAfter);
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too Many Requests. Rate limit exceeded.',
          error: 'Too Many Requests',
          retryAfter: result.retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
