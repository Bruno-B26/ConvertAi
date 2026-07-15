# Controller Rules

Controllers handle HTTP. They must stay **thin** — they only receive the request, call a service, and return a response.

## What a controller does

- Defines the URL (`@Controller('users')` + `@Get('...')`, `@Post('...')`, etc).
- Reads the input using `@Body`, `@Param`, `@Query`.
- Calls **one** service method.
- Returns the result.

## What a controller MUST NOT do

- Apply business rules (no `if` statements about domain logic).
- Talk to the database or to Mongoose models.
- Read or write directly to `req` / `res`.

## Example

```ts
// src/modules/users/users.controller.ts
import {
  Controller, Get, Post, Body, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }
}
```

## Rules

1. **Each handler is short** — usually 1 to 3 lines (not counting decorators). If it grows, move logic to the service.
2. **Don't validate by hand.** The global `ValidationPipe` validates the DTO automatically. See `dtos-validation.md`.
3. **Use `@HttpCode()` when the default isn't right.** Examples: `201` for create, `204` for delete.
4. **Group routes by feature.** All `users` routes live in `UsersController`. Don't split them.
5. **For MongoDB IDs**, accept them as `string` in the param. Validate using a DTO with `@IsMongoId()` when needed.
