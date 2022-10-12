import { OmitType } from '@nestjs/mapped-types';
import { Prisma, Role, User } from '@prisma/client';
import { IsBase64, IsEmail, IsEnum, IsString } from 'class-validator';
import { ListInput } from '../../shared/models/shared.dto';

export class CreateUserInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(Role, { each: true })
  roles: Role[];
}

export class ChangePasswordInput {
  @IsBase64()
  token: string;

  @IsString()
  password: string;
}

export class UpdateUserInput extends OmitType(CreateUserInput, [
  'name',
  'email',
]) {}

class SearchUserInput extends OmitType(CreateUserInput, ['roles']) {}

export class ListUserInput extends ListInput<
  SearchUserInput,
  Prisma.UserWhereInput
>(['name', 'email']) {}

export class ListUserOutput {
  items: Omit<User, 'password'>[];
  total: number;
}
