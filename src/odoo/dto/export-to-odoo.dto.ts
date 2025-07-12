import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";

export class ExportToOdooDto {
  @ApiProperty({
    description: "Form ID to export to Odoo",
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  formId: number;
}
