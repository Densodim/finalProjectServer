import { ApiProperty } from "@nestjs/swagger";

export class ExportToOdooResultDto {
  @ApiProperty({
    description: "Odoo survey ID",
    example: 123,
  })
  odooSurveyId: number;

  @ApiProperty({
    description: "Success message",
    example: "Form successfully created in Odoo",
  })
  message: string;

  @ApiProperty({
    description: "Form title",
    example: "Customer Feedback Form",
  })
  formTitle: string;

  @ApiProperty({
    description: "Number of questions exported",
    example: 5,
  })
  questionsCount: number;
}
