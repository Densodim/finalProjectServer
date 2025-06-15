import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiCreatedResponse({
    type: CategoryEntity,
    description: 'The category has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({
    type: CategoryEntity,
    isArray: true,
    description: 'List of all categories with form counts',
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({
    type: CategoryEntity,
    description: 'The found category with its forms',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({
    type: CategoryEntity,
    description: 'The category has been successfully updated.',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({
    type: CategoryEntity,
    description: 'The category has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get category statistics' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiOkResponse({
    description: 'Category statistics including total forms and responses',
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryStats(id);
  }
}
