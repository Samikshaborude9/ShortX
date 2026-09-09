import { IsUrl, IsOptional, IsString, IsDateString, MaxLength, Matches } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ require_protocol: true }, { message: 'originalUrl must be a valid URL starting with http:// or https://' })
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Custom alias can only contain letters, numbers, hyphens and underscores' })
  customAlias?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
