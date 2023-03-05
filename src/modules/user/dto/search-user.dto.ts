import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../schemas/user.schema';

export class SearchUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'password',
]) {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  username: string;

  constructor(args?: Partial<SearchUserDto>) {
    super();
    Object.assign(this, args);
  }
}
