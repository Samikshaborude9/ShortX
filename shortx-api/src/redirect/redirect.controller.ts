import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const originalUrl = await this.redirectService.resolve(shortCode);

    // Track click asynchronously (non-blocking)
    this.redirectService.trackClick(shortCode, {
      ipAddress: req.ip || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'] as string,
    }).catch(() => {});

    return res.redirect(302, originalUrl);
  }
}
