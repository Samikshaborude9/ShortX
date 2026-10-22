import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  Optional,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { SlidingRateLimitGuard } from '../common/guards/sliding-rate-limit.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';

@Controller('api/urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard, SlidingRateLimitGuard)
  @RateLimit({
    keyPrefix: 'urls_create',
    limitResolver: (req) => (req.user?.id ? 100 : 10),
    windowSeconds: 60,
  })
  create(@Body() dto: CreateUrlDto, @Request() req) {
    return this.urlsService.create(dto, req.user?.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'ASC' | 'DESC',
  ) {
    const [urls, total] = await this.urlsService.findByUser(req.user.id, page, limit, search, sort);
    return {
      data: urls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Request() req) {
    return this.urlsService.getStats(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdateUrlDto, @Request() req) {
    return this.urlsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req) {
    return this.urlsService.remove(id, req.user.id);
  }
}
