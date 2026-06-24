import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsUrl,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { SoftwareModule, CourseLevel } from '@mos/shared';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  shortDescription: string;

  @IsEnum(SoftwareModule)
  module: SoftwareModule;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsString()
  examCode: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export class CourseFilterDto {
  @IsEnum(SoftwareModule)
  @IsOptional()
  module?: SoftwareModule;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @IsString()
  @IsOptional()
  examCode?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
