import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OdooService } from './odoo.service';
import { ExportToOdooDto } from './dto/export-to-odoo.dto';
import { ExportToOdooResultDto } from './dto/export-result.dto';

@Controller('odoo')
@ApiTags('Odoo Integration')
export class OdooController {
  constructor(private readonly odooService: OdooService) {}

  @Get('surveys')
  @ApiOperation({
    summary: 'Get surveys list from Odoo',
    description: 'Returns list of all surveys available in Odoo',
  })
  @ApiResponse({
    status: 200,
    description: 'Surveys list successfully retrieved',
  })
  getSurveys() {
    return this.odooService.getSurveys();
  }

  @Post('import-from-odoo')
  @ApiOperation({
    summary: 'Import data from Odoo to local database',
    description:
      'Imports form templates and questions from Odoo to local database',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          description: 'User ID for import',
          example: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Data successfully imported',
  })
  async importFromOdoo(@Body() body: { userId: number }) {
    return this.odooService.importFromOdooToLocal(body.userId);
  }

  @Post('export-to-odoo')
  @ApiOperation({
    summary: 'Export form to Odoo',
    description: 'Creates a new survey in Odoo based on local form',
  })
  @ApiResponse({
    status: 201,
    description: 'Form successfully exported to Odoo',
    type: ExportToOdooResultDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Form not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to export to Odoo',
  })
  async exportToOdoo(@Body() body: ExportToOdooDto) {
    return this.odooService.exportFormToOdoo(body.formId);
  }
}
