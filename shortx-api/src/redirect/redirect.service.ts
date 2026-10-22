import { Injectable, NotFoundException, GoneException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
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

  async resolve(shortCode: string): Promise<Url> {
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

    return url;
  }

  async trackClick(
    urlId: string,
    meta: {
      ipAddress?: string;
      userAgent?: string;
      referrer?: string;
    },
  ): Promise<void> {
    try {
      let country: string | undefined;
      let browser: string | undefined;
      let device: string | undefined;

      if (meta.ipAddress) {
        const cleanIp = meta.ipAddress.replace(/^::ffff:/, '').trim();
        const geo = geoip.lookup(cleanIp);
        if (geo?.country) {
          country = geo.country;
        }
      }

      if (meta.userAgent) {
        const parser = new UAParser(meta.userAgent);
        const b = parser.getBrowser();
        const d = parser.getDevice();
        browser = b.name ? `${b.name}${b.major ? ' ' + b.major : ''}` : undefined;
        device = d.type ? d.type.charAt(0).toUpperCase() + d.type.slice(1) : (d.model ? `${d.model}` : 'Desktop');
      }

      const click = this.clickRepo.create({
        urlId,
        ipAddress: meta.ipAddress || null,
        userAgent: meta.userAgent || null,
        referrer: meta.referrer || null,
        country: country || null,
        browser: browser || null,
        device: device || null,
      });

      await this.clickRepo.save(click);
    } catch (err: any) {
      // Non-blocking - analytics should never break redirects
      console.error('Failed to track click:', err?.message || err);
    }
  }
}
