import { IsOptional, IsBoolean, IsDateString, IsString, Length } from 'class-validator';

export class UpdateUrlDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  customAlias?: string;
}
