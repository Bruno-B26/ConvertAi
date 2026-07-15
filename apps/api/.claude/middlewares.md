# Middleware, Guards, Pipes & Filters

NestJS has different tools for different jobs. Pick the right one — don't put everything in middleware.

## Which one to use

| What you want to do                             | Use this           |
|-------------------------------------------------|--------------------|
| Log requests, attach a request id               | **Middleware**     |
| Decide if a user is allowed to access a route   | **Guard**          |
| Validate or transform the request body          | **Pipe**           |
| Catch errors and format the response            | **Exception Filter** |

## Middleware Example

A middleware runs before everything else. Use it for low-level stuff only.

```ts
// src/common/middlewares/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    req['id'] = req.headers['x-request-id'] ?? randomUUID();
    next();
  }
}
```

Apply it globally in `main.ts`:

```ts
app.use(new RequestIdMiddleware().use);
```

Or per module:

```ts
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SomeMiddleware).forRoutes('users');
  }
}
```

## Middleware Rules

1. **No business logic.** Middlewares do logging and request setup, nothing else.
2. **No database writes.** Read-only data attachments (like request id) are fine.
3. **If you need to decide "is this allowed?", use a Guard, not a middleware.**

## Guard Example

A guard answers: "should this request be allowed?"

```ts
// src/common/guards/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    return Boolean(req.user); // true = allowed, false = blocked
  }
}
```

Use it with `@UseGuards(AuthGuard)` on a controller or a single route.

## Pipes (Validation)

Don't write custom pipes for simple validation. The global `ValidationPipe` does the job — configure it once in `main.ts`:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // ignore unknown fields
    forbidNonWhitelisted: true, // return 400 if unknown fields are sent
    transform: true,            // turn the request body into a DTO instance
  }),
);
```

After this, every DTO field with `class-validator` decorators is checked automatically.

## Exception Filters

See `error-handling.md`.
