import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UrlClick } from './entities/url-click.entity';
import { Url } from '../urls/entities/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UrlClick, Url])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
