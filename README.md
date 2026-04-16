# User Microservices Server

User-management microservices system built with Node.js, Express, TypeScript, PostgreSQL, Sequelize, and Socket.IO.

## Architecture Overview

- `api-gateway` is the public entry point and proxies requests to internal services.
- `auth-service` handles authentication, token lifecycle, and auth-related email flows.
- `user-service` handles user/role CRUD and emits real-time events.
- `shared` contains reusable logger, mailer, and common middleware modules.

## Folder Analysis

```
server/
├── apps/
│   ├── api-gateway/              # Gateway service (default: 7000)
│   │   ├── src/config/           # Env-driven service URLs + JWT secret
│   │   ├── src/middlewares/      # Auth and error middlewares
│   │   ├── src/routes/           # Proxy routes: /api/auth, /api/users, /api/roles
│   │   ├── src/types/            # Express type augmentation
│   │   └── src/index.ts          # Service bootstrap
│   ├── auth-service/             # Authentication service (default: 7001)
│   │   ├── src/config/           # App + DB + JWT + mail config
│   │   ├── src/controllers/      # Auth request handlers
│   │   ├── src/middlewares/      # Service-specific auth middleware
│   │   ├── src/migrations/       # Sequelize DB migrations
│   │   ├── src/models/           # Sequelize models
│   │   ├── src/routes/           # Auth routes mounted at /api/auth
│   │   ├── src/services/         # Auth business logic
│   │   ├── src/templates/        # Email templates (OTP/reset)
│   │   └── src/app.ts            # Service bootstrap
│   └── user-service/             # User/role service (default: 7002)
│       ├── src/config/           # App + DB + mail + internal key config
│       ├── src/controllers/      # User and role request handlers
│       ├── src/middlewares/      # Auth and validation middleware
│       ├── src/migrations/       # Sequelize DB migrations
│       ├── src/models/           # Sequelize models
│       ├── src/routes/           # /api/users, /api/roles, /api/internal routes
│       ├── src/schemas/          # Zod validation schemas
│       ├── src/seeders/          # Initial role/user seed data
│       ├── src/services/         # User, role, and mail business logic
│       ├── src/templates/        # Email templates
│       └── src/app.ts            # HTTP + Socket.IO bootstrap
├── shared/
│   ├── logger/                   # Winston logger
│   ├── mailer/                   # Nodemailer transporter factory
│   └── middleware/               # Shared auth/error/not-found middlewares
├── package.json                  # Root scripts + npm workspaces
├── tsconfig.base.json            # Base TypeScript compiler settings
└── README.md                     # Project documentation
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 13+

## Setup

1. Install dependencies at repo root:

```bash
npm install
```

2. Create a single root `.env` file in `server/` (all services read from the root file).

3. Create PostgreSQL databases:
- `auth_db`
- `user_db`

4. Run migrations (and seeds for user service):

```bash
cd apps/auth-service
npm run db:migrate

cd ../user-service
npm run db:migrate
npm run db:seed
```

## Environment Variables (Root `.env`)

```env
# General
NODE_ENV=development
JWT_SECRET=change_me
INTERNAL_API_KEY=internal_secret_key

# Service ports
GATEWAY_PORT=7000
AUTH_SERVICE_PORT=7001
USER_SERVICE_PORT=7002

# Service-to-service URLs
AUTH_SERVICE_URL=http://localhost:7001
USER_SERVICE_URL=http://localhost:7002

# Auth service DB
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5432
AUTH_DB_USER=postgres
AUTH_DB_PASSWORD=postgres
AUTH_DB_NAME=auth_db

# User service DB
USER_DB_HOST=localhost
USER_DB_PORT=5432
USER_DB_USER=postgres
USER_DB_PASSWORD=postgres
USER_DB_NAME=user_db

# Mail settings (used by auth-service and user-service)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_ADDRESS=noreply@example.com
MAIL_USERNAME=noreply@example.com
MAIL_PASSWORD=change_me
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
```

## Run the Services

Run all services:

```bash
npm run dev
```

Run one service:

```bash
npm run dev:gateway
npm run dev:auth
npm run dev:user
```