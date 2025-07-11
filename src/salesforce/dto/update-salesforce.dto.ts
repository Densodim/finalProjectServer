import { PartialType } from '@nestjs/swagger';
import { CreateSalesforceDto } from './create-salesforce.dto';

export class UpdateSalesforceDto extends PartialType(CreateSalesforceDto) {}
