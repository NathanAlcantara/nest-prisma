import { OmitType } from '@nestjs/mapped-types';
import { Role, User } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';
import { ListInput } from '../../shared/models/shared.dto';

export class CreateUserInput {
  @IsEmail()
  email: string;

  @IsEnum(Role, { each: true })
  roles: Role[];
}

export class UpdateUserInput extends OmitType(CreateUserInput, ['email']) {}

class SearchUserInput extends OmitType(CreateUserInput, ['roles']) {}

export class ListUserInput extends ListInput<SearchUserInput>(['email']) {}

export class ListUserOutput {
  items: Omit<User, 'password'>[];
  total: number;
}
