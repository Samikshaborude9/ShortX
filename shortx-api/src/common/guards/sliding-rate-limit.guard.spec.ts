import { Reflector } from '@nestjs/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SlidingRateLimitGuard } from './sliding-rate-limit.guard';
import { RedisService } from '../../redis/redis.service';

describe('SlidingRateLimitGuard', () => {
  let guard: SlidingRateLimitGuard;
  let mockReflector: any;
  let mockRedisService: any;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    };
    mockRedisService = {
      checkSlidingWindow: jest.fn(),
    };
    guard = new SlidingRateLimitGuard(mockReflector, mockRedisService);
  });

  const createMockContext = (user?: any, ip = '127.0.0.1') => {
    const headers: Record<string, string> = {};
    const responseHeaders: Record<string, any> = {};
    const req = {
      user,
      ip,
      headers,
    };
    const res = {
      setHeader: jest.fn((key: string, val: any) => {
        responseHeaders[key] = val;
      }),
      responseHeaders,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
      res,
    };
  };

  it('should pass through if no RateLimit metadata is present', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    const context = createMockContext();

    const allowed = await guard.canActivate(context as any);
    expect(allowed).toBe(true);
    expect(mockRedisService.checkSlidingWindow).not.toHaveBeenCalled();
  });

  it('should allow request within limits and set rate limit headers', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({
      keyPrefix: 'test',
      limit: 10,
      windowSeconds: 60,
    });
    mockRedisService.checkSlidingWindow.mockResolvedValue({
      allowed: true,
      remaining: 8,
      retryAfter: 0,
    });

    const context = createMockContext();
    const allowed = await guard.canActivate(context as any);

    expect(allowed).toBe(true);
    expect(context.res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
    expect(context.res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 8);
  });

  it('should throw 429 Too Many Requests and set Retry-After header when limit is exceeded', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({
      keyPrefix: 'test',
      limit: 10,
      windowSeconds: 60,
    });
    mockRedisService.checkSlidingWindow.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfter: 45,
    });

    const context = createMockContext();

    try {
      await guard.canActivate(context as any);
      fail('Expected guard to throw 429 HttpException');
    } catch (err: any) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(context.res.setHeader).toHaveBeenCalledWith('Retry-After', 45);
    }
  });

  it('should differentiate authenticated users from unauthenticated IPs', async () => {
    mockReflector.getAllAndOverride.mockReturnValue({
      keyPrefix: 'test',
      limitResolver: (req: any) => (req.user?.id ? 100 : 10),
      windowSeconds: 60,
    });
    mockRedisService.checkSlidingWindow.mockResolvedValue({
      allowed: true,
      remaining: 99,
      retryAfter: 0,
    });

    const userContext = createMockContext({ id: 'user-123' });
    await guard.canActivate(userContext as any);

    expect(mockRedisService.checkSlidingWindow).toHaveBeenCalledWith(
      'ratelimit:test:user:user-123',
      100,
      60,
    );
  });
});
