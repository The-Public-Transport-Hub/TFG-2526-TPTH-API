# TPTH API - The Public Transport Hub

Backend API for **Tu Guagua**, a public transport application focused on Tenerife.

The API normalizes transport data from different providers and exposes a clean, stable interface for mobile clients.

## Overview

TPTH API centralizes public transport information from external sources such as TITSA Open Data and Metro Tenerife. The goal is to avoid coupling the mobile application directly to third-party formats, giving the project full control over response models, synchronization, validation and future extensions.

The API currently supports:

- Bus lines
- Bus stops
- Tram lines
- Tram stops
- Real-time arrivals
- Admin synchronization routes protected with bearer authentication
- OpenAPI documentation with Scalar
- Automated tests and CI validation

## Tech Stack

- **Runtime:** Bun
- **HTTP framework:** Hono
- **API documentation:** Hono OpenAPI + Scalar
- **Validation:** Zod
- **Database:** MongoDB Atlas
- **Testing:** Bun test
- **CI:** GitHub Actions
- **Deployment:** Railway

## Architecture

The project follows a feature-based hexagonal architecture.

```text
src/
  app/                # Server bootstrap and route composition
  admin/              # Private admin routes
  features/
    lines/
      domain/         # Business models and ports
      aplication/     # Use cases
      infrastructure/ # HTTP, DB and provider adapters
    stops/
    trams/
  shared/             # Shared config, database, schemas and utilities
```

Main rules:

- `domain` defines business models and ports.
- `aplication` contains use cases and depends on domain ports.
- `infrastructure` implements adapters for HTTP, MongoDB and external providers.
- Public routes use `OpenAPIHono`.
- Admin routes use plain `Hono`, so they are not exposed in the public documentation.

## Public Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Checks API and database availability |

### Bus Lines

| Method | Path | Description |
|---|---|---|
| `GET` | `/lines?page=1&q=10` | List bus lines |
| `GET` | `/lines/{id}` | Get bus line details and stops |

### Stops

| Method | Path | Description |
|---|---|---|
| `GET` | `/stops/bus?page=1&q=orotava` | List bus stops |
| `GET` | `/stops/bus/{id}` | Get bus stop details and arrivals |
| `GET` | `/stops/tram?page=1&q=trinidad` | List tram stops |
| `GET` | `/stops/tram/{id}` | Get tram stop details and arrivals |

### Trams

| Method | Path | Description |
|---|---|---|
| `GET` | `/trams?q=L1` | List tram lines |
| `GET` | `/trams/{id}?direction=outbound` | Get tram line details |

## Admin Endpoints

Admin endpoints require bearer authentication:

```http
Authorization: Bearer <ADMIN_API_KEY>
```

| Method | Path | Description |
|---|---|---|
| `POST` | `/admin/sync/lines` | Synchronize bus lines and line stops |
| `POST` | `/admin/sync/stops/bus` | Synchronize bus stops |
| `POST` | `/admin/sync/stops/tram` | Synchronize tram stops |
| `POST` | `/admin/sync/trams` | Synchronize tram lines |

## Documentation

OpenAPI JSON:

```text
/doc
```

Scalar reference:

```text
/reference
```

When running locally:

```text
http://localhost:3000/reference
```

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
BUN_ENV=development
PORT=3000
MONGO_URI=
DB_NAME=
MONGO_SERVER_SELECTION_TIMEOUT_MS=5000
ADMIN_API_KEY=
DEV_API_TOKEN=
CORS_ORIGIN=
ENABLE_CRON=false
```

### Required Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | MongoDB database name |
| `ADMIN_API_KEY` | Bearer token used to protect admin routes |
| `PORT` | API port |
| `BUN_ENV` | Runtime environment |

## Local Development

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Run the production entrypoint locally:

```bash
bun run start
```

## Testing

Run TypeScript validation:

```bash
bun run typecheck
```

Run the automated test suite:

```bash
bun test
```

Current test coverage includes:

- Use cases
- Public response contracts
- Query schemas
- External provider schemas
- Data converters
- MongoDB document schemas
- Admin authentication
- Health and documentation routes
- Shared utilities

## Continuous Integration

The repository includes a GitHub Actions workflow that runs on every push or pull request to `main`.

The CI pipeline performs:

1. Repository checkout
2. Bun setup
3. Dependency installation
4. TypeScript validation
5. Automated tests

Workflow file:

```text
.github/workflows/ci.yaml
```

## Deployment

The API is deployed on Railway using Bun and MongoDB Atlas as the production database.

The Dockerfile uses a multi-stage setup:

- Installs production dependencies
- Copies application source
- Runs the API with Bun
- Exposes port `3000`

## Known Limitations

- User authentication and personal cloud data
- Some real-time tram data endpoints depend on external provider network restrictions.
- The API currently prioritizes normalized transport data for the mobile application over exposing every raw provider field.

## Future Work

Planned improvements include:

- User accounts and authenticated personal data
- Favorite stops and lines synchronized in the cloud
- Map-oriented endpoints
- Route planning between origin and destination
- More complete provider monitoring
- Repository-level integration tests with a test MongoDB instance

## Author

Eduardo Santander Restrepo  
Final Degree Project - The Public Transport Hub
