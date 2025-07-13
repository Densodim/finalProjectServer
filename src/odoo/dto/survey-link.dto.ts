import { ApiProperty } from "@nestjs/swagger";

export class SurveyLinkDto {
  @ApiProperty({
    description: "Odoo survey ID",
    example: 123,
  })
  surveyId: number;

  @ApiProperty({
    description: "Survey title",
    example: "Customer Feedback Survey",
  })
  surveyTitle: string;

  @ApiProperty({
    description: "Direct link to access the survey in Odoo",
    example:
      "https://denso.odoo.com/survey/start/ba7d8b78-a0b8-4dde-aabe-0ebca60dc874",
  })
  surveyLink: string;

  @ApiProperty({
    description: "Access token for the survey",
    example: "ba7d8b78-a0b8-4dde-aabe-0ebca60dc874",
  })
  accessToken: string;
}
