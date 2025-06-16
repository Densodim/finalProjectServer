import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OptionEntity } from './entities/option.entity';

@Controller('questions/:questionId/options')
@ApiTags('Options from questions')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create an option' })
  @ApiCreatedResponse({ type: OptionEntity })
  @ApiBadRequestResponse({
    description: 'Problems in creating the option, not correct input data',
  })
  @HttpCode(201)
  create(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    return this.optionService.create(questionId, createOptionDto);
  }

  @ApiOperation({ summary: 'Get a list of issues of issue' })
  @ApiOkResponse({ type: OptionEntity, isArray: true })
  @ApiBadRequestResponse({
    description: 'Problems when getting a list of issues of issue',
    type: OptionEntity,
  })
  @HttpCode(200)
  @Get()
  findAll(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.optionService.findAll(questionId);
  }

  @ApiOperation({ summary: 'Get a issue' })
  @ApiOkResponse({ type: OptionEntity })
  @ApiBadRequestResponse({ description: 'Problems when getting' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return this.optionService.findOne(questionId, id);
  }

  @ApiOperation({ summary: 'Update the option' })
  @ApiOkResponse({ type: OptionEntity, isArray: true })
  @ApiBadRequestResponse({
    description: 'Problems in update the option, not correct input data',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    return this.optionService.update(questionId, id, updateOptionDto);
  }

  @ApiOperation({ summary: 'Delete the option' })
  @ApiOkResponse({ type: OptionEntity })
  @ApiBadRequestResponse({ description: 'Problems in delete the option' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return this.optionService.remove(questionId, id);
  }
}
