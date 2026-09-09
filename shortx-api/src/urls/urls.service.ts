import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Url } from './entities/url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateShortCode(length = 6): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS[Math.floor(Math.random() * BASE62_CHARS.length)];
  }
  return result;
}

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepo: Repository<Url>,
    private readonly configService: ConfigService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get('APP_BASE_URL') || 'http://localhost:3001';
  }

  async create(dto: CreateUrlDto, userId?: string): Promise<any> {
    // Handle custom alias
    if (dto.customAlias) {
      const existing = await this.urlRepo.findOne({
        where: [{ shortCode: dto.customAlias }, { customAlias: dto.customAlias }],
      });
      if (existing) {
        throw new ConflictException('Custom alias already taken');
      }
    }

    // Generate unique short code
    let shortCode: string;
    let attempts = 0;
    do {
      shortCode = dto.customAlias || generateShortCode();
      const existing = await this.urlRepo.findOne({ where: { shortCode } });
      if (!existing) break;
      if (dto.customAlias) throw new ConflictException('Custom alias already taken');
      attempts++;
      if (attempts > 10) throw new Error('Failed to generate unique short code');
    } while (true);

    const url = this.urlRepo.create({
      originalUrl: dto.originalUrl,
      shortCode,
      customAlias: dto.customAlias || null,
      userId: userId || null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });

    const saved = await this.urlRepo.save(url);

    return {
      id: saved.id,
      shortCode: saved.shortCode,
      shortUrl: `${this.baseUrl}/${saved.shortCode}`,
      originalUrl: saved.originalUrl,
      createdAt: saved.createdAt,
      expiresAt: saved.expiresAt,
    };
  }

  async findByUser(userId: string, page = 1, limit = 10, search?: string): Promise<[any[], number]> {
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (search) {
      return this.urlRepo.findAndCount({
        where: [
          { userId, originalUrl: ILike(`%${search}%`) },
          { userId, shortCode: ILike(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
    }
    const [urls, total] = await this.urlRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return [
      urls.map((url) => ({
        ...url,
        shortUrl: `${this.baseUrl}/${url.shortCode}`,
      })),
      total,
    ];
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.urlRepo.findOne({ where: { shortCode } });
  }

  async findById(id: string): Promise<Url | null> {
    return this.urlRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateUrlDto, userId: string): Promise<Url> {
    const url = await this.urlRepo.findOne({ where: { id } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId !== userId) throw new ForbiddenException();

    if (dto.isActive !== undefined) url.isActive = dto.isActive;
    if (dto.expiresAt !== undefined) url.expiresAt = new Date(dto.expiresAt);

    return this.urlRepo.save(url);
  }

  async remove(id: string, userId: string): Promise<void> {
    const url = await this.urlRepo.findOne({ where: { id } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId !== userId) throw new ForbiddenException();
    await this.urlRepo.remove(url);
  }

  async getStats(id: string, userId: string) {
    const url = await this.urlRepo.findOne({ where: { id } });
    if (!url) throw new NotFoundException('URL not found');
    if (url.userId && url.userId !== userId) throw new ForbiddenException();
    return url;
  }
}
