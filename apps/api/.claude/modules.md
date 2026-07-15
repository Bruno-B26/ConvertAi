# Module Rules

A module is a folder that groups everything related to one feature (controller, service, repository, schema, DTOs).

## When to create a new module

Create a new module when you're starting a new feature. Examples: `users`, `auth`, `products`, `orders`.

Don't create a module for a single utility — put utilities in `src/common/`.

## Module Template

Every feature module looks like this:

```ts
// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService], // export only what other modules need
})
export class UsersModule {}
```

## Rules

1. **Register the Mongoose schema with `MongooseModule.forFeature(...)`** inside the module that owns it.
2. **Export only the service.** Other modules should never import a repository directly.
3. **The repository is a provider**, just like the service.
4. **Don't make two modules depend on each other in a circle.** If `OrdersModule` needs `UsersModule` and vice-versa, something is wrong — ask for help before using `forwardRef`.

## The Root Module (`app.module.ts`)

`src/app.module.ts` only imports other modules. It should not have controllers or services of its own.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    AuthModule,
    // ...other feature modules
  ],
})
export class AppModule {}
```
