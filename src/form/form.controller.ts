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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { FormEntity } from './entities/form.entity';
import { UpdateFormTagsDto } from './dto/update-form-tags.dto';
import { Roles } from '../auth/authorization/roles.decorator';
import { SearchFormDto } from './dto/search-form.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('form')
@ApiTags('Forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @ApiCreatedResponse({ type: FormEntity })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createFormDto: CreateFormDto,
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.formService.create(createFormDto, req.user.id, file);
  }

  @Get()
  @ApiOkResponse({ type: FormEntity })
  @ApiOperation({ summary: 'displays all the forms all users' })
  findAll() {
    return this.formService.findAll();
  }

  @Get('formsUser')
  @ApiOkResponse({ type: FormEntity, isArray: true })
  @ApiOperation({ summary: 'displays all the forms of one user' })
  findAllUser(@Req() req: RequestWithUser) {
    return this.formService.findAllUser(req.user.id);
  }

  @Get('deleteForm')
  @ApiOperation({ summary: 'Delete form' })
  @ApiOkResponse({ type: FormEntity })
  findDelete(@Req() req: RequestWithUser) {
    return this.formService.findAllDeleted(req.user.id);
  }

  @Get('publishedForm')
  @ApiOkResponse({ type: FormEntity, isArray: true })
  @ApiOperation({ summary: 'displays all published Form' })
  publishedForm() {
    return this.formService.displayPublished();
  }

  @Get(':id')
  @ApiOkResponse({ type: FormEntity })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.formService.findOne(+id, req.user.id);
  }

  @Post('/search')
  @ApiOperation({ summary: 'Search form' })
  fullTextSearch(@Body() body: SearchFormDto) {
    return this.formService.fullTextSearch(body.query);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FormEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFormDto: UpdateFormDto,
    @Req() req: RequestWithUser,
  ) {
    return this.formService.update(id, updateFormDto, req.user.id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Soft delete form' })
  @ApiOkResponse({ type: FormEntity })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.formService.softDelete(id, req.user.id);
  }

  @Post('tags/add')
  @ApiOperation({ summary: 'Add tag' })
  @ApiOkResponse({ description: 'Add tag' })
  @HttpCode(200)
  @ApiBadRequestResponse({ description: 'Tag already exists' })
  addTags(@Body() updateTagDto: UpdateFormTagsDto) {
    return this.formService.addTags(updateTagDto);
  }

  @Post('tags/remove')
  @ApiOperation({ summary: 'Remove tag' })
  @ApiOkResponse({ description: 'Remove tag' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  removeTags(@Body() updateTagDto: UpdateFormTagsDto) {
    return this.formService.deleteTags(updateTagDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: FormEntity })
  @ApiOperation({ summary: 'Delete form only can use ADMIN' })
  removeForm(@Param('id', ParseIntPipe) id: number) {
    return this.formService.remove(id);
  }
}

//type
export interface RequestWithUser extends Request {
  user: Pick<User, 'id' | 'email'>;
}
