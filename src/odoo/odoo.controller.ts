import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OdooService } from "./odoo.service";
import { ExportToOdooDto } from "./dto/export-to-odoo.dto";
import { ExportToOdooResultDto } from "./dto/export-result.dto";
import { SurveyLinkDto } from "./dto/survey-link.dto";

@Controller("odoo")
@ApiTags("Odoo Integration")
export class OdooController {
  constructor(private readonly odooService: OdooService) {}

  @Get("surveys")
  @ApiOperation({
    summary: "Get surveys list from Odoo",
    description: "Returns list of all surveys available in Odoo",
  })
  @ApiResponse({
    status: 200,
    description: "Surveys list successfully retrieved",
  })
  getSurveys() {
    return this.odooService.getSurveys();
  }

  @Get("questions/:surveyId")
  @ApiOperation({
    summary: "Get questions for specific survey from Odoo",
    description: "Returns list of questions for a specific survey in Odoo",
  })
  @ApiResponse({
    status: 200,
    description: "Questions list successfully retrieved",
  })
  @ApiResponse({
    status: 404,
    description: "Survey not found",
  })
  getSurveyQuestions(@Param("surveyId") surveyId: string) {
    return this.odooService.getSurveyQuestions(Number(surveyId));
  }

  @Get("survey/:id")
  @ApiOperation({
    summary: "Get survey details from Odoo",
    description: "Returns detailed information about a specific survey",
  })
  @ApiResponse({
    status: 200,
    description: "Survey details successfully retrieved",
  })
  @ApiResponse({
    status: 404,
    description: "Survey not found",
  })
  getSurveyDetails(@Param("id") id: string) {
    return this.odooService.getSurveyDetails(Number(id));
  }

  @Get("survey/:id/link")
  @ApiOperation({
    summary: "Get survey link from Odoo",
    description: "Returns a direct link to access the survey in Odoo",
  })
  @ApiResponse({
    status: 200,
    description: "Survey link successfully retrieved",
    type: SurveyLinkDto,
  })
  @ApiResponse({
    status: 404,
    description: "Survey not found",
  })
  getSurveyLink(@Param("id") id: string) {
    return this.odooService.getSurveyLink(Number(id));
  }

  @Post("import-from-odoo")
  @ApiOperation({
    summary: "Import data from Odoo to local database",
    description:
      "Imports form templates and questions from Odoo to local database",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: {
          type: "number",
          description: "User ID for import",
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Data successfully imported",
  })
  async importFromOdoo(@Body() body: { userId: number }) {
    return this.odooService.importFromOdooToLocal(body.userId);
  }

  @Post("export-to-odoo")
  @ApiOperation({
    summary: "Export form to Odoo",
    description: "Creates a new survey in Odoo based on local form",
  })
  @ApiResponse({
    status: 201,
    description: "Form successfully exported to Odoo",
    type: ExportToOdooResultDto,
  })
  @ApiResponse({
    status: 404,
    description: "Form not found",
  })
  @ApiResponse({
    status: 500,
    description: "Failed to export to Odoo",
  })
  async exportToOdoo(@Body() body: ExportToOdooDto) {
    return this.odooService.exportFormToOdoo(body.formId);
  }

  @Get("survey/:id/responses")
  @ApiOperation({
    summary: "Get survey responses from Odoo",
    description: "Returns all responses for a specific survey",
  })
  @ApiResponse({
    status: 200,
    description: "Survey responses successfully retrieved",
  })
  @ApiResponse({
    status: 404,
    description: "Survey not found",
  })
  getSurveyResponses(@Param("id", ParseIntPipe) id: string) {
    return this.odooService.getSurveyResponses(Number(id));
  }
}
