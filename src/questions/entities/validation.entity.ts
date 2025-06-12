import { ApiPropertyOptional } from '@nestjs/swagger';

export class QuestionValidationEntity {
  @ApiPropertyOptional()
  minLength?: number;

  @ApiPropertyOptional()
  maxLength?: number;

  @ApiPropertyOptional()
  pattern?: string;

  @ApiPropertyOptional()
  minValue?: number;

  @ApiPropertyOptional()
  maxValue?: number;

  @ApiPropertyOptional()
  customMessage?: string;
}
