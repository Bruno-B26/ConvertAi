# Coding Conventions

## TypeScript

- Use `strict: true` in `tsconfig.json` (already on by default in new Nest projects).
- Avoid `any`. If you really need it, leave a comment explaining why.
- Use `readonly` for things injected in the constructor:
  ```ts
  constructor(private readonly usersService: UsersService) {}
  ```

## File and Symbol Naming

| Thing             | How to name it                  | Example                          |
|-------------------|---------------------------------|----------------------------------|
| File              | `kebab-case`                    | `create-user.dto.ts`             |
| Class             | `PascalCase`                    | `UsersService`                   |
| Variable/function | `camelCase`                     | `findUserById`                   |
| Constant          | `UPPER_SNAKE_CASE`              | `MAX_PAGE_SIZE`                  |
| DTO               | `<Action><Feature>Dto`          | `CreateUserDto`                  |
| Schema            | `<Feature>` (singular)          | `User`                           |

## Imports

Group imports in this order, with a blank line between groups:

```ts
// 1. Node built-ins
import { randomUUID } from 'crypto';

// 2. External packages
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

// 3. Your own code
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
```

## Logging

- Use NestJS's `Logger`, not `console.log`:
  ```ts
  private readonly logger = new Logger(UsersService.name);
  this.logger.log('User created');
  this.logger.error('Something went wrong');
  ```
- **Never log passwords, tokens, or full request bodies.**

## Configuration

- All environment variables go through `ConfigService`:
  ```ts
  constructor(private readonly config: ConfigService) {}
  const uri = this.config.get<string>('MONGODB_URI');
  ```
- Keep an up-to-date `.env.example` listing every variable the app needs.
- Never read `process.env` directly inside a service or controller.

## Async Code

- Always use `async/await`. Don't mix it with `.then()`/`.catch()` chains.
- Always `await` your promises — forgetting `await` is one of the most common bugs.

## Use the Nest CLI

Don't create files by hand. The CLI sets up everything correctly:

```bash
nest g module modules/orders         # generates the module
nest g controller modules/orders     # generates the controller + test
nest g service modules/orders        # generates the service + test
nest g class modules/orders/orders.repository --flat
```

## Git

- One feature per branch, one feature per pull request.
- Commit messages should describe what changed: `add user registration endpoint`.
- Never commit `.env` files, `node_modules/`, or the `dist/` folder.
