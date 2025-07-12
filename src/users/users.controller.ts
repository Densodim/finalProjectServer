import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UserEntity } from "./entities/user.entity";
import { Roles } from "../auth/authorization/roles.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/authorization/roles.guard";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Get all users only can use ADMIN" })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update user only can use ADMIN" })
  @ApiOkResponse({ type: UserEntity })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Delete user only can use ADMIN" })
  @ApiOkResponse({ type: UserEntity })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }

  @Get("drafts")
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findDrafts() {
    return this.usersService.findDrafts();
  }

  @Get("me/token")
  @ApiOperation({
    summary: "Получить API токен пользователя",
    description:
      "Возвращает API токен для доступа к агрегированным результатам форм. Если токен не существует, создает новый.",
  })
  @ApiOkResponse({
    description: "API токен успешно получен",
    schema: {
      type: "object",
      properties: {
        apiToken: {
          type: "string",
          description: "API токен для внешнего доступа",
          example: "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
        },
      },
    },
  })
  async getApiToken(@Req() req: any) {
    return this.usersService.getApiToken(req.user.id);
  }
}
