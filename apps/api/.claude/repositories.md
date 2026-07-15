# Repository Rules

Repositories are the **only place that talks to MongoDB**. The service asks the repository for data — it never calls Mongoose itself.

## What a repository does

- Receives the Mongoose `Model` through dependency injection.
- Runs queries (`find`, `findOne`, `create`, `updateOne`, `deleteOne`, etc).
- Returns Mongoose documents or `null` when nothing is found.

## What a repository MUST NOT do

- Apply business rules (no `if` checks about whether something should happen).
- Throw `NotFoundException` or any other HTTP exception. Return `null` and let the service decide.
- Call other services or other repositories.

## The Schema

Define the schema first using `@nestjs/mongoose` decorators:

```ts
// src/modules/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  displayName?: string;

  // timestamps adds these:
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

## The Repository

```ts
// src/modules/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  create(dto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(dto);
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
```

## Rules

1. **One repository per schema.** `UsersRepository` only handles `User`. Don't make a generic repository for everything.
2. **Method names say what they do**: `findActiveByTenant`, not `customQuery1`.
3. **Return `null` when nothing is found.** Never throw from a repository.
4. **Always call `.exec()`** on Mongoose queries — it returns a real `Promise` and makes errors easier to debug.
5. **Don't leak Mongoose details outside the repository.** The service shouldn't know about `lean()`, `populate()`, or query builders. Wrap them in repository methods.
6. **If you need pagination**, accept `page` and `limit` as parameters and return both the items and the total count.
