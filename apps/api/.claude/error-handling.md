# Error Handling

The whole API returns errors in the same shape. There are two parts: **throwing** errors and **formatting** them.

## Where errors come from

| Where         | What it throws                                                    |
|---------------|-------------------------------------------------------------------|
| ValidationPipe | `BadRequestException` (automatic — fires when a DTO is invalid)  |
| Guard          | `UnauthorizedException` or `ForbiddenException`                  |
| Service        | `NotFoundException`, `ConflictException`, `BadRequestException`  |
| Repository     | **Nothing.** Returns `null` when something is missing.           |

## Throwing in a service

Use NestJS's built-in exceptions — don't create your own classes:

```ts
import { NotFoundException, ConflictException } from '@nestjs/common';

if (!user) {
  throw new NotFoundException(`User ${id} not found`);
}

if (existing) {
  throw new ConflictException('Email already registered');
}
```

## Global Exception Filter

This filter turns any thrown error into a consistent JSON response. Create it once and register it globally.

```ts
// src/common/filters/global-exception.filter.ts
import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttp ? exception.getResponse() : 'Internal server error';

    // Log unexpected errors only (500s)
    if (status >= 500) {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      error: message,
    });
  }
}
```

Register it in `app.module.ts`:

```ts
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
```

## Rules

1. **Don't `try/catch` just to log and rethrow.** Let the error bubble up to the global filter.
2. **Don't swallow errors silently.** If you catch, you must handle or rethrow.
3. **Don't leak internal details** like stack traces or database errors in the response. The filter above handles that.
4. **Error messages are short and clear.** "User not found" — not "PG_ERR_22: relation users no rows".
