import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlClick } from './entities/url-click.entity';
import { Url } from '../urls/entities/url.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UrlClick)
    private readonly clickRepo: Repository<UrlClick>,
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
  ) {}

  async getSummary(urlId: string, userId: string) {
    const url = await this.urlRepo.findOne({ where: { id: urlId } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId && url.userId !== userId) throw new ForbiddenException();

    const totalClicks = await this.clickRepo.count({ where: { urlId } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clicksToday = await this.clickRepo
      .createQueryBuilder('c')
      .where('c.urlId = :urlId', { urlId })
      .andWhere('c.createdAt >= :today', { today })
      .getCount();

    // Unique visitors by distinct IP
    const uniqueResult = await this.clickRepo
      .createQueryBuilder('c')
      .select('COUNT(DISTINCT c.ipAddress)', 'count')
      .where('c.urlId = :urlId', { urlId })
      .andWhere('c.ipAddress IS NOT NULL')
      .getRawOne();

    const uniqueVisitors = parseInt(uniqueResult?.count || '0', 10);

    return {
      totalClicks,
      uniqueVisitors: uniqueVisitors || (totalClicks > 0 ? 1 : 0),
      clicksToday,
      url: {
        id: url.id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        createdAt: url.createdAt,
      },
    };
  }

  async getTimeSeries(urlId: string, userId: string, days = 30) {
    const url = await this.urlRepo.findOne({ where: { id: urlId } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId && url.userId !== userId) throw new ForbiddenException();

    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await this.clickRepo
      .createQueryBuilder('c')
      .select("DATE_TRUNC('day', c.createdAt)", 'date')
      .addSelect('COUNT(*)', 'clicks')
      .where('c.urlId = :urlId', { urlId })
      .andWhere('c.createdAt >= :since', { since })
      .groupBy("DATE_TRUNC('day', c.createdAt)")
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      date: r.date,
      clicks: parseInt(r.clicks, 10),
    }));
  }

  async getBreakdown(urlId: string, userId: string) {
    const url = await this.urlRepo.findOne({ where: { id: urlId } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId && url.userId !== userId) throw new ForbiddenException();

    const byCountry = await this.clickRepo
      .createQueryBuilder('c')
      .select('c.country', 'country')
      .addSelect('COUNT(*)', 'clicks')
      .where('c.urlId = :urlId', { urlId })
      .groupBy('c.country')
      .orderBy('clicks', 'DESC')
      .limit(10)
      .getRawMany();

    const byBrowser = await this.clickRepo
      .createQueryBuilder('c')
      .select('c.browser', 'browser')
      .addSelect('COUNT(*)', 'clicks')
      .where('c.urlId = :urlId', { urlId })
      .groupBy('c.browser')
      .orderBy('clicks', 'DESC')
      .limit(10)
      .getRawMany();

    const byDevice = await this.clickRepo
      .createQueryBuilder('c')
      .select('c.device', 'device')
      .addSelect('COUNT(*)', 'clicks')
      .where('c.urlId = :urlId', { urlId })
      .groupBy('c.device')
      .orderBy('clicks', 'DESC')
      .limit(10)
      .getRawMany();

    const byReferrer = await this.clickRepo
      .createQueryBuilder('c')
      .select('c.referrer', 'referrer')
      .addSelect('COUNT(*)', 'clicks')
      .where('c.urlId = :urlId', { urlId })
      .groupBy('c.referrer')
      .orderBy('clicks', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      byCountry: byCountry.map((r) => ({ country: r.country || 'Unknown', clicks: parseInt(r.clicks, 10) })),
      byBrowser: byBrowser.map((r) => ({ browser: r.browser || 'Unknown', clicks: parseInt(r.clicks, 10) })),
      byDevice: byDevice.map((r) => ({ device: r.device || 'Desktop', clicks: parseInt(r.clicks, 10) })),
      byReferrer: byReferrer.map((r) => ({ referrer: r.referrer || 'Direct', clicks: parseInt(r.clicks, 10) })),
    };
  }
}
