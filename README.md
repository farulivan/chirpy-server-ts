# Chirpy Server

A Twitter-like microblogging API built with **TypeScript**, **Express.js**, and **PostgreSQL**. This project demonstrates clean architecture principles, proper layer separation, and production-ready patterns for building scalable REST APIs.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/                 # Business entities & interfaces
│   └── entities/           # Core domain models (User, Chirp)
├── services/               # Business logic layer
│   ├── chirp.service.ts    # Chirp use cases
│   ├── user.service.ts     # User & auth use cases
│   └── content-filter.service.ts
├── infrastructure/         # External concerns
│   ├── auth/               # Authentication (JWT, Password hashing)
│   └── database/           # Database (Drizzle ORM, Repositories)
├── presentation/           # HTTP layer
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   └── routes/             # Route definitions
└── shared/                 # Cross-cutting concerns
    ├── constants.ts        # Application constants
    └── errors/             # Custom error classes
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Domain** | Pure business entities, no dependencies on frameworks |
| **Application** | Business logic, orchestrates domain entities |
| **Infrastructure** | Database access, external services, authentication |
| **Presentation** | HTTP concerns, request/response handling |
| **Shared** | Utilities used across all layers |

## 🚀 Features

- **User Management**: Registration, authentication, profile updates
- **Chirps (Tweets)**: Create, read, delete with 140-character limit
- **Authentication**: JWT access tokens + refresh token rotation
- **Content Moderation**: Automatic profanity filtering
- **Premium Features**: Chirpy Red subscription via webhook
- **Database Migrations**: Automated with Drizzle Kit

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe JavaScript |
| **Express.js 5** | Web framework |
| **PostgreSQL** | Primary database |
| **Drizzle ORM** | Type-safe database queries |
| **Argon2** | Password hashing (winner of PHC) |
| **JWT** | Stateless authentication |
| **Vitest** | Unit testing |

## 📦 Installation

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- PostgreSQL 14+

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/chirpy-server-ts.git
cd chirpy-server-ts

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/chirpy` |
| `SECRET` | JWT signing secret | `your-256-bit-secret` |
| `POLKA_KEY` | Webhook API key | `polka-api-key` |
| `PLATFORM` | Environment (`dev`/`prod`) | `dev` |

## 📚 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/users` | Register new user | - |
| `POST` | `/api/login` | Login, get tokens | - |
| `POST` | `/api/refresh` | Refresh access token | Bearer (refresh) |
| `POST` | `/api/revoke` | Revoke refresh token | Bearer (refresh) |
| `PUT` | `/api/users` | Update user profile | Bearer |

### Chirps

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/chirps` | Create a chirp | Bearer |
| `GET` | `/api/chirps` | List all chirps | - |
| `GET` | `/api/chirps?author_id=<uuid>` | Filter by author | - |
| `GET` | `/api/chirps?sort=desc` | Sort by date | - |
| `GET` | `/api/chirps/:id` | Get single chirp | - |
| `DELETE` | `/api/chirps/:id` | Delete own chirp | Bearer |

### Health & Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/healthz` | Health check | - |
| `POST` | `/admin/reset` | Reset database (dev only) | - |

### Webhooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/polka/webhooks` | Polka payment webhook | ApiKey |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📁 Project Structure Details

### Domain Layer (`src/domain/`)

Contains pure TypeScript interfaces representing business entities:

```typescript
// User entity
interface User {
  id: string;
  email: string;
  isChirpyRed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Chirp entity
interface Chirp {
  id: string;
  body: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Application Layer (`src/application/`)

Business logic encapsulated in services:

- **ChirpService**: Create, read, delete chirps with validation
- **UserService**: Registration, authentication, profile management
- **ContentFilterService**: Profanity detection and filtering

### Infrastructure Layer (`src/infrastructure/`)

External concerns isolated from business logic:

- **Repositories**: Database access patterns (CRUD operations)
- **Auth**: JWT creation/validation, password hashing

### Presentation Layer (`src/presentation/`)

HTTP-specific code:

- **Controllers**: Handle requests, delegate to services
- **Middleware**: Auth guards, error handling, logging
- **Routes**: Express router definitions

## 🔒 Security Features

- **Password Hashing**: Argon2id (memory-hard, resistant to GPU attacks)
- **JWT Tokens**: Short-lived access tokens (1 hour)
- **Refresh Tokens**: Long-lived (60 days), stored in database, revocable
- **API Key Auth**: Webhook endpoints protected with API keys
- **Input Validation**: Request body validation in controllers
- **Error Handling**: Centralized error middleware, no stack traces in production

## 🚧 Future Improvements

### High Priority

1. **Input Validation with Zod**
   - Add schema validation for all request bodies
   - Generate OpenAPI documentation from schemas
   - Improve error messages for invalid inputs

2. **Dependency Injection Container**
   - Implement IoC container (e.g., tsyringe, inversify)
   - Enable easier testing with mock dependencies
   - Improve modularity and testability

3. **API Versioning**
   - Add `/api/v1/` prefix to all routes
   - Enable backward-compatible API evolution

4. **Rate Limiting**
   - Implement per-user and per-IP rate limits
   - Protect against brute force attacks

### Medium Priority

5. **Request ID Tracing**
   - Add unique request IDs to all requests
   - Include in logs for debugging
   - Return in response headers

6. **Structured Logging**
   - Replace console.log with structured logger (pino/winston)
   - Add log levels, timestamps, context
   - Enable log aggregation

7. **Database Connection Pooling**
   - Configure proper connection pool settings
   - Add health checks for database connectivity

8. **Integration Tests**
   - Add supertest-based API tests
   - Test full request/response cycles
   - Add database fixtures

### Lower Priority

9. **Caching Layer**
   - Add Redis for session/token caching
   - Cache frequently accessed chirps
   - Implement cache invalidation

10. **Pagination**
    - Add cursor-based pagination for chirps
    - Include pagination metadata in responses

11. **Search Functionality**
    - Full-text search for chirps
    - Search by hashtags, mentions

12. **Real-time Features**
    - WebSocket support for live updates
    - Server-Sent Events for notifications

13. **Metrics & Monitoring**
    - Prometheus metrics endpoint
    - Request duration histograms
    - Error rate tracking

14. **Docker Support**
    - Add Dockerfile and docker-compose.yml
    - Multi-stage builds for production
    - Health check endpoints

15. **CI/CD Pipeline**
    - GitHub Actions for testing
    - Automated deployments
    - Code coverage reporting

## 📄 License

ISC

## 👤 Author

Built as a portfolio project demonstrating clean architecture and TypeScript best practices.
