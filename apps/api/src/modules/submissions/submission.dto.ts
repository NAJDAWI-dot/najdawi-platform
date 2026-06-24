import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  contentItemId: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;
}

export class GradeSubmissionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
