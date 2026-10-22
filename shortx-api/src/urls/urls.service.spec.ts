import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlsService, generateShortCode } from './urls.service';
import { Url } from './entities/url.entity';

import { RedisService } from '../redis/redis.service';

describe('UrlsService', () => {
  let service: UrlsService;
  let mockUrlRepo: any;
  let mockConfigService: any;
  let mockRedisService: any;

  beforeEach(async () => {
    mockUrlRepo = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn((dto) => ({ ...dto, id: 'test-uuid', createdAt: new Date() })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'APP_BASE_URL') return 'http://localhost:3001';
        return null;
      }),
    };

    mockRedisService = {
      del: jest.fn().mockResolvedValue(1),
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: mockUrlRepo,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  describe('generateShortCode', () => {
    it('should generate a 6-character alphanumeric string', () => {
      const code = generateShortCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[a-zA-Z0-9]{6}$/);
    });

    it('should generate distinct codes on consecutive calls', () => {
      const code1 = generateShortCode();
      const code2 = generateShortCode();
      expect(code1).not.toEqual(code2);
    });
  });

  describe('create', () => {
    it('should create a short URL successfully for anonymous users', async () => {
      mockUrlRepo.findOne.mockResolvedValue(null);

      const result = await service.create({ originalUrl: 'https://example.com' });

      expect(mockUrlRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          originalUrl: 'https://example.com',
          userId: null,
        }),
      );
      expect(result).toHaveProperty('shortUrl');
      expect(result.shortUrl).toContain('http://localhost:3001/');
    });

    it('should create a short URL with user ID if authenticated', async () => {
      mockUrlRepo.findOne.mockResolvedValue(null);

      const result = await service.create({ originalUrl: 'https://example.com' }, 'user-uuid');

      expect(mockUrlRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          originalUrl: 'https://example.com',
          userId: 'user-uuid',
        }),
      );
      expect(result.id).toBe('test-uuid');
    });

    it('should throw ConflictException if custom alias already exists', async () => {
      mockUrlRepo.findOne.mockResolvedValue({ id: 'existing-id', shortCode: 'custom' });

      await expect(
        service.create({ originalUrl: 'https://example.com', customAlias: 'custom' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if URL is missing', async () => {
      mockUrlRepo.findOne.mockResolvedValue(null);
      await expect(
        service.update('non-existent', { isActive: false }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the URL', async () => {
      mockUrlRepo.findOne.mockResolvedValue({ id: 'u1', userId: 'owner-id' });
      await expect(
        service.update('u1', { isActive: false }, 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update isActive and expiresAt', async () => {
      const url = { id: 'u1', userId: 'user-1', isActive: true, expiresAt: null };
      mockUrlRepo.findOne.mockResolvedValue(url);

      const result = await service.update('u1', { isActive: false }, 'user-1');
      expect(result.isActive).toBe(false);
      expect(mockUrlRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft-delete the URL', async () => {
      mockUrlRepo.findOne.mockResolvedValue({ id: 'u1', userId: 'user-1' });

      await service.remove('u1', 'user-1');
      expect(mockUrlRepo.softDelete).toHaveBeenCalledWith('u1');
    });
  });
});
