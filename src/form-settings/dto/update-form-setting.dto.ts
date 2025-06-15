import { PartialType } from '@nestjs/swagger';
import { CreateFormSettingDto } from './create-form-setting.dto';

export class UpdateFormSettingDto extends PartialType(CreateFormSettingDto) {}
