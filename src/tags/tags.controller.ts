import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TagEntity } from './entities/tag.entity';

@Controller('tags')
@ApiTags('Tags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create tags' })
  @ApiCreatedResponse({
    type: TagEntity,
    description: 'The tag has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({
    type: TagEntity,
    description: 'The tag has been successfully getting all tags.',
  })
  findAll() {
    return this.tagsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tag' })
  @ApiOkResponse({
    type: TagEntity,
    description: 'The tag has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tag' })
  @ApiOkResponse({
    type: TagEntity,
    description: 'The tag has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
