# User Microservices

A microservices architecture for user management and authentication built with Node.js, Express, and TypeScript.

## Project Structure

```
user-micro-server/
├── apps/
│   ├── api-gateway/          # API Gateway service (Port 7000)
│   ├── auth-service/         # Authentication service (Port 7001)
│   └── user-service/         # User management service (Port 7002)
├── packages/
│   └── shared/               # Shared utilities and types
├── package.json              # Root package.json with workspaces
├── tsconfig.base.json        # Base TypeScript configuration
└── README.md                 # This file
```

## Services

### API Gateway
- **Port**: 7000
- **Purpose**: Entry point for all client requests, handles routing and JWT validation
- **Features**: Request proxying, authentication middleware, CORS handling

### Auth Service
- **Port**: 7001
- **Purpose**: User authentication and authorization
- **Database**: PostgreSQL (auth_db)
- **Features**: Login, registration, JWT token generation, password hashing

### User Service
- **Port**: 7002
- **Purpose**: User CRUD operations and management
- **Database**: PostgreSQL (userdb)
- **Features**: User creation, updates, deletion, real-time notifications via Socket.IO, role-based permissions

### Shared Package
- **Purpose**: Common utilities shared across services
- **Contents**: JWT utilities, logging configuration (Winston)

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v13 or higher)
- Docker (optional, for containerized databases)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-micro-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up databases**

   Create two PostgreSQL databases:
   - `auth_db` for the auth service
   - `userdb` for the user service

4. **Database setup for each service**

   For Auth Service:
   ```bash
   cd apps/auth-service
   npm run db:create
   npm run db:migrate
   ```

   For User Service:
   ```bash
   cd apps/user-service
   npm run db:create
   npm run db:migrate
   npm run db:seed
   ```

## Environment Variables

Each service has its own `.env` file. Make sure to update sensitive values like `JWT_SECRET` and database credentials before production deployment.

### API Gateway (.env)
```env
NODE_ENV=development
PORT=7000
JWT_SECRET=your_jwt_secret
AUTH_SERVICE_URL=http://localhost:7001
USER_SERVICE_URL=http://localhost:7002
```

### Auth Service (.env)
```env
NODE_ENV=development
PORT=7001
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
USER_SERVICE_URL=http://localhost:7002
INTERNAL_API_KEY=internal_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=auth_db
```

### User Service (.env)
```env
NODE_ENV=development
PORT=7002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=userdb
DB_USER=postgres
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
INTERNAL_API_KEY=internal_secret_key
```

## Running the Application

### Development Mode

Run all services concurrently:
```bash
npm run dev
```

Run individual services:
```bash
npm run dev:gateway    # API Gateway only
npm run dev:auth       # Auth Service only
npm run dev:user       # User Service only
```

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Logging**: Winston
- **Development**: nodemon, concurrently
- **Linting**: ESLint
- **Formatting**: Prettier