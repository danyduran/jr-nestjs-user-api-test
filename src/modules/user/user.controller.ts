import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CsvParser } from 'src/providers/csv-parser.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User API')
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({ type: UserDto })
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    return await this.userService.createUser(body);
  }

  @Patch('/update/:_id')
  @ApiOperation({ summary: 'Partially update a user' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async updateById(@Param('_id') _id: string, @Body() body: UpdateUserDto): Promise<UserDto> {
    const userSaved = await this.userService.findByObjectId(_id);
    if(!userSaved){
      throw new NotFoundException(`User id '${_id}' not found.`)
    }

    if (userSaved && !userSaved.email && !body.email){
      throw new BadRequestException("Email is required to update the existing record.")
    }

    return await this.userService.patchUser(_id, body);
  }

  @Delete('/:_id')
  @ApiOperation({ summary: 'Delete a user ' })
  async deleteById(@Param('_id') _id: string): Promise<UserDto> {
    try {
      return await this.userService.deleteUser(_id);
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(`User id '${_id}' not found.`);
    }
  }

  @Get('/username/:username')
  @ApiOperation({ summary: 'Find user by username' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getByUsername(@Param('username') username: string): Promise<UserDto> {
    return await this.userService.findByUserName(username);
  }

  @Get('/:_id')
  @ApiOperation({ summary: 'Find user by mongo object id' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  async getById(@Param('_id') _id: string): Promise<UserDto> {
    const user = await this.userService.findByObjectId(_id);

    if (!user) {
      throw new NotFoundException(`User id '${_id}' not found.`);
    }

    return user;
  }

  @Post('/search')
  @ApiOperation({ summary: 'Search a user by combination of firstName, lastName, username.' })
  @ApiOkResponse({ type: UserDto })
  async search(@Body() body: Pick<UpdateUserDto, "firstName" | "lastName" | "username">): Promise<UserDto> {
    const user = await this.userService.searchUser(body);

    if(!user) {
      throw new NotFoundException(`User not found.`);
    }

    return user;
  }

  @Post('/seed-data')
  @ApiOperation({ summary: 'Load data from ./seed-data/users.csv into our mongo database' })
  async seedData(): Promise<boolean> {
    const users = await CsvParser.parse('seed-data/users.csv');
    let results = true;

    for await (const user of users) {
      try {
        this.userService.createUser(user)
      } catch (error) {
        results = false
      }
    }

    return results;
  }
}
