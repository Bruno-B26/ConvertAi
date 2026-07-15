# Architecture Rules

## The Request Flow

Every HTTP request follows the same path. **Do not skip steps.**

```
HTTP Request
    ↓
[1] Route        — defined by @Controller + @Get/@Post/@Patch/@Delete
    ↓
[2] Middleware   — runs before everything else (logging, request id)
    ↓
[3] Guard        — decides if the request is allowed (auth checks)
    ↓
[4] Pipe         — validates and transforms the input (DTOs)
    ↓
[5] Controller   — receives the input, calls the service, returns a response
    ↓
[6] Service      — applies business rules, calls the repository
    ↓
[7] Repository   — talks to MongoDB through Mongoose
    ↓
MongoDB
```

## What Each Layer Can and Cannot Do

| Layer       | Can do                                                   | Cannot do                                      |
|-------------|----------------------------------------------------------|------------------------------------------------|
| Controller  | Receive a DTO, call **one** service method, return data  | Business rules, database calls                 |
| Service     | Business rules, call repositories, throw errors          | Touch `req`/`res`, call Mongoose directly      |
| Repository  | Read and write to MongoDB                                | Business rules, throw HTTP exceptions          |
| Middleware  | Logging, attach data to the request (e.g. request id)    | Business rules, database writes                |

## Folder Structure

```
src/
├── main.ts                          # app bootstrap
├── app.module.ts                    # root module
├── common/                          # shared, app-wide stuff
│   ├── filters/                     # global exception filter
│   ├── middlewares/                 # global middlewares
│   └── pipes/
├── config/                          # ConfigModule setup
├── database/                        # MongooseModule setup
└── modules/
    └── <feature>/                   # one folder per feature
        ├── <feature>.module.ts
        ├── <feature>.controller.ts
        ├── <feature>.service.ts
        ├── <feature>.repository.ts
        ├── schemas/
        │   └── <feature>.schema.ts  # Mongoose schema
        └── dto/
            ├── create-<feature>.dto.ts
            ├── update-<feature>.dto.ts
            └── <feature>-response.dto.ts
```

## Rule of Thumb

If you don't know where to put a piece of code, ask: **"What does this code do?"**

- "It defines a URL" → controller
- "It checks if something is allowed by the business" → service
- "It reads or writes data" → repository
- "It runs on every request" → middleware
