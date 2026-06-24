import { IsString, IsEnum, IsUrl, IsNumber, IsOptional, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ContentType } from '@mos/shared';

export class CreateContentItemDto {
  @IsString()
  title: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsString()
  url: string;

  @IsNumber()
  @Min(0)
  order: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateContentItemDto extends PartialType(CreateContentItemDto) {}
