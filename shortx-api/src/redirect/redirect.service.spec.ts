import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, GoneException } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Url } from '../urls/entities/url.entity';
import { UrlClick } from '../analytics/entities/url-click.entity';

describe('RedirectService', () => {
  let service: RedirectService;
  let mockUrlRepo: any;
  let mockClickRepo: any;

  beforeEach(async () => {
    mockUrlRepo = {
      findOne: jest.fn(),
    };
    mockClickRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn().mockResolvedValue(true),
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
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
  });

  describe('resolve', () => {
    it('should return the URL if active and not expired', async () => {
      const url = {
        id: 'url-uuid',
        shortCode: 'abc123',
        originalUrl: 'https://google.com',
        isActive: true,
        expiresAt: null,
      };
      mockUrlRepo.findOne.mockResolvedValue(url);

      const result = await service.resolve('abc123');
      expect(result).toEqual(url);
    });

    it('should throw NotFoundException if shortCode is not found', async () => {
      mockUrlRepo.findOne.mockResolvedValue(null);

      await expect(service.resolve('missing')).rejects.toThrow(NotFoundException);
    });

    it('should throw GoneException if URL is inactive', async () => {
      mockUrlRepo.findOne.mockResolvedValue({
        id: 'url-uuid',
        shortCode: 'disabled',
        originalUrl: 'https://example.com',
        isActive: false,
      });

      await expect(service.resolve('disabled')).rejects.toThrow(GoneException);
    });

    it('should throw GoneException if URL is expired', async () => {
      const pastDate = new Date(Date.now() - 100000);
      mockUrlRepo.findOne.mockResolvedValue({
        id: 'url-uuid',
        shortCode: 'expired',
        originalUrl: 'https://example.com',
        isActive: true,
        expiresAt: pastDate,
      });

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
