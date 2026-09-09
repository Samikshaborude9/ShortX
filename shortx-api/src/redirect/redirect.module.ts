import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { Url } from '../urls/entities/url.entity';
import { UrlClick } from '../analytics/entities/url-click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, UrlClick])],
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}
