import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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

@Controller('form')
@ApiTags('create Form')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @ApiCreatedResponse({ type: FormEntity })
  create(@Body() createFormDto: CreateFormDto, @Req() req: RequestWithUser) {
    return this.formService.create(createFormDto, req.user.id);
  }

  @Get()
  @ApiOkResponse({ type: FormEntity, isArray: true })
  findAll(@Req() req: RequestWithUser) {
    return this.formService.findAll(req.user.id);
  }

  @Get('deleteForm')
  @ApiOkResponse({ type: FormEntity })
  findDelete(@Req() req: RequestWithUser) {
    return this.formService.findAllDeleted(req.user.id);
  }

  @Get(':id')
  @ApiOkResponse({ type: FormEntity })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.formService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: FormEntity })
  update(
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
    @Req() req: RequestWithUser,
  ) {
    return this.formService.update(+id, updateFormDto, req.user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: FormEntity })
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.formService.softDelete(+id, req.user.id);
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
}

//type
export interface RequestWithUser extends Request {
  user: Pick<User, 'id' | 'email'>;
}
