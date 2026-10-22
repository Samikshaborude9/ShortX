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
    const url = await this.redirectService.resolve(shortCode);

    // Extract client IP address accurately
    const xForwardedFor = req.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : typeof xForwardedFor === 'string'
      ? xForwardedFor.split(',')[0].trim()
      : req.ip || req.socket?.remoteAddress;

    const userAgent = req.headers['user-agent'];
    const referrer = req.headers['referer'] as string;

    // Track click asynchronously with url.id (non-blocking)
    this.redirectService
      .trackClick(url.id, {
        ipAddress,
        userAgent,
        referrer,
      })
      .catch(() => {});

    return res.redirect(302, url.originalUrl);
  }
}
