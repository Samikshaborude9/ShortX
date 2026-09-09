import { Injectable, NotFoundException, GoneException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../urls/entities/url.entity';
import { UrlClick } from '../analytics/entities/url-click.entity';

@Injectable()
export class RedirectService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
    @InjectRepository(UrlClick)
    private readonly clickRepo: Repository<UrlClick>,
  ) {}

  async resolve(shortCode: string): Promise<string> {
    const url = await this.urlRepo.findOne({ where: { shortCode } });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (!url.isActive) {
      throw new GoneException('This URL has been disabled');
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      throw new GoneException('This URL has expired');
    }

    return url.originalUrl;
  }

  async trackClick(urlId: string, meta: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    country?: string;
    browser?: string;
    device?: string;
  }): Promise<void> {
    try {
      const click = this.clickRepo.create({ urlId, ...meta });
      await this.clickRepo.save(click);
    } catch (err) {
      // Non-blocking - analytics should never break redirects
      console.error('Failed to track click:', err.message);
    }
  }
}
