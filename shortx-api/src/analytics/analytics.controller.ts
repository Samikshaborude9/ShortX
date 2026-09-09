import { Controller, Get, Param, Query, UseGuards, Request, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@Controller('api/analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':urlId')
  getSummary(@Param('urlId') urlId: string, @Request() req) {
    return this.analyticsService.getSummary(urlId, req.user.id);
  }

  @Get(':urlId/timeseries')
  getTimeSeries(
    @Param('urlId') urlId: string,
    @Request() req,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.analyticsService.getTimeSeries(urlId, req.user.id, days);
  }

  @Get(':urlId/breakdown')
  getBreakdown(@Param('urlId') urlId: string, @Request() req) {
    return this.analyticsService.getBreakdown(urlId, req.user.id);
  }
}
