import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, GoneException } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Url } from '../urls/entities/url.entity';
import { UrlClick } from '../analytics/entities/url-click.entity';
import { RedisService } from '../redis/redis.service';

describe('RedirectService', () => {
  let service: RedirectService;
  let mockUrlRepo: any;
  let mockClickRepo: any;
  let mockRedisService: any;

  beforeEach(async () => {
    mockUrlRepo = {
      findOne: jest.fn(),
    };
    mockClickRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn().mockResolvedValue(true),
    };
    mockRedisService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      recordHit: jest.fn(),
      recordMiss: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepo,
        },
        {
          provide: getRepositoryToken(UrlClick),
          useValue: mockClickRepo,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
  });

  describe('resolve', () => {
    it('should return cached URL and record hit when cache exists', async () => {
      const cachedUrl = {
        id: 'url-uuid',
        shortCode: 'cached1',
        originalUrl: 'https://cached.com',
        isActive: true,
        expiresAt: null,
      };
      mockRedisService.get.mockResolvedValue(JSON.stringify(cachedUrl));

      const result = await service.resolve('cached1');
      expect(result).toEqual(cachedUrl);
      expect(mockRedisService.recordHit).toHaveBeenCalled();
      expect(mockUrlRepo.findOne).not.toHaveBeenCalled();
    });

    it('should fetch from DB, cache in Redis, and record miss on cache miss', async () => {
      const dbUrl = {
        id: 'url-uuid',
        shortCode: 'abc123',
        originalUrl: 'https://google.com',
        isActive: true,
        expiresAt: null,
      };
      mockRedisService.get.mockResolvedValue(null);
      mockUrlRepo.findOne.mockResolvedValue(dbUrl);

      const result = await service.resolve('abc123');
      expect(result).toEqual(dbUrl);
      expect(mockRedisService.recordMiss).toHaveBeenCalled();
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'url:short:abc123',
        JSON.stringify(dbUrl),
        3600,
      );
    });

    it('should throw NotFoundException if shortCode is not found in cache or DB', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockUrlRepo.findOne.mockResolvedValue(null);

      await expect(service.resolve('missing')).rejects.toThrow(NotFoundException);
    });

    it('should throw GoneException if cached URL is inactive', async () => {
      mockRedisService.get.mockResolvedValue(
        JSON.stringify({
          id: 'url-uuid',
          shortCode: 'disabled',
          originalUrl: 'https://example.com',
          isActive: false,
        }),
      );

      await expect(service.resolve('disabled')).rejects.toThrow(GoneException);
    });

    it('should throw GoneException if cached URL is expired', async () => {
      const pastDate = new Date(Date.now() - 100000);
      mockRedisService.get.mockResolvedValue(
        JSON.stringify({
          id: 'url-uuid',
          shortCode: 'expired',
          originalUrl: 'https://example.com',
          isActive: true,
          expiresAt: pastDate,
        }),
      );

      await expect(service.resolve('expired')).rejects.toThrow(GoneException);
    });
  });

  describe('trackClick', () => {
    it('should save click metadata without breaking', async () => {
      await expect(
        service.trackClick('url-uuid', {
          ipAddress: '8.8.8.8',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          referrer: 'https://twitter.com',
        }),
      ).resolves.not.toThrow();

      expect(mockClickRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          urlId: 'url-uuid',
          ipAddress: '8.8.8.8',
          device: 'Desktop',
        }),
      );
      expect(mockClickRepo.save).toHaveBeenCalled();
    });
  });
});
