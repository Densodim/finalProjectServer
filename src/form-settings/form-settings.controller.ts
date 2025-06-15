import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FormSettingsService } from './form-settings.service';
import { UpdateFormSettingDto } from './dto/update-form-setting.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FormSettingEntity } from './entities/form-setting.entity';

@Controller('form-settings')
@ApiTags('FormSettings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FormSettingsController {
  constructor(private readonly formSettingsService: FormSettingsService) {}

  @Get(':formId/settings')
  @ApiOperation({ summary: 'Get the shape settings' })
  @ApiOkResponse({ type: FormSettingEntity })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @HttpCode(200)
  getSettings(@Param('formId', ParseIntPipe) id: number) {
    return this.formSettingsService.getSetting(id);
  }

  @Post(':formId/settings')
  @ApiCreatedResponse({ type: FormSettingEntity })
  @ApiOperation({ summary: 'Update settings' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  updateSettings(
    @Param('formId') id: string,
    @Body() updateFormSettingDto: UpdateFormSettingDto,
  ) {
    return this.formSettingsService.updateSettings(+id, updateFormSettingDto);
  }
}
