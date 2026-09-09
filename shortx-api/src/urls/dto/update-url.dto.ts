import { IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateUrlDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
