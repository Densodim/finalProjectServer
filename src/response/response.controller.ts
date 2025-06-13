import { Body, Controller, Post } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from './entities/response.entity';

@Controller('response')
@ApiTags('Response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post('submit')
  @ApiCreatedResponse({
    description: 'Form submitted with answers',
    type: ResponseEntity,
  })
  create(@Body() createResponseDto: CreateResponseDto) {
    return this.responseService.submitForm(createResponseDto);
  }
}
