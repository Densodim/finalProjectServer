import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";
import { Transform } from "class-transformer";

export class GetSurveyQuestionsDto {
  @ApiProperty({
    description: "Odoo survey ID to get questions for",
    example: 123,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  surveyId: number;
}
