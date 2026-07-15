# DTOs & Validation

A **DTO** (Data Transfer Object) is a class that describes the shape of the data flowing between layers. They make payloads explicit and let NestJS validate them automatically.

## Types of DTO

| Type      | File name pattern              | What it's for                              |
|-----------|--------------------------------|--------------------------------------------|
| Create    | `create-<feature>.dto.ts`      | The body when creating something           |
| Update    | `update-<feature>.dto.ts`      | The body when updating something           |
| Query     | `<feature>-query.dto.ts`       | The query string (filters, pagination)     |
| Response  | `<feature>-response.dto.ts`    | The shape returned to the client           |

## Create DTO Example

```ts
// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
```

## Update DTO Example

Use `PartialType` so every field becomes optional, without rewriting the class:

```ts
// src/modules/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

## Response DTO Example

A plain class describing exactly what the API returns. It does not have validators — its job is to document the response.

```ts
// src/modules/users/dto/user-response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
}
```

The service builds and returns this object. Never return the Mongoose document directly — it has internal fields like `password` and `__v` that should not leak.

## Rules

1. **Every controller input is a DTO.** Don't use `@Body() body: any` or inline interfaces.
2. **Every response that goes out is a DTO.** Build the object in the service.
3. **Validation lives on the create DTO.** The service trusts that the DTO is already valid.
4. **For MongoDB IDs** in DTOs, use `@IsMongoId()` from `class-validator`.
5. **For nested objects**, decorate the field with `@ValidateNested()` and `@Type(() => ChildDto)` — otherwise validation silently passes.
