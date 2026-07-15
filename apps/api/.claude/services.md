# Service Rules

Services hold the **business logic**. This is where you write the rules of your application.

## What a service does

- Checks business rules (e.g. "email must be unique", "only admins can do this").
- Calls one or more repositories.
- Throws errors when something is wrong (`NotFoundException`, `ConflictException`, etc).
- Returns plain data or a response DTO — never a raw Mongoose document.

## What a service MUST NOT do

- Read `req`, `res`, headers, or cookies.
- Call Mongoose models directly. Always go through the repository.
- Return Mongoose documents to the controller. Map them to a plain object or response DTO first.

## Example

```ts
// src/modules/users/users.service.ts
import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersRepository.create(dto);

    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  }
}
```

## Rules

1. **Inject dependencies in the constructor** with `private readonly`.
2. **Method names describe what the business does**: `register`, `archive`, `transferOwnership`. Not just `create` or `update` everywhere.
3. **Throw the right exception:**
   - Not found → `NotFoundException`
   - Already exists / state conflict → `ConflictException`
   - Bad input that the DTO couldn't catch → `BadRequestException`
   - Not allowed → `ForbiddenException`
4. **Need data from another feature?** Call that feature's service, never its repository. Example: `OrdersService` calls `UsersService.findOne(...)`.
5. **No `console.log`.** Use `Logger`:
   ```ts
   private readonly logger = new Logger(UsersService.name);
   this.logger.log('User created');
   ```
