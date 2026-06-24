# MOS Platform 🎓

A full-stack **Microsoft Office Specialist (MOS) exam preparation platform** built as an Nx monorepo.

[![CI](https://github.com/your-org/mos-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/mos-platform/actions/workflows/ci.yml)

---

## 🏗️ Architecture

```
mos-platform/
├── apps/
│   ├── web/          # Vite + React 19 + TypeScript + Tailwind CSS
│   └── api/          # NestJS + TypeORM + PostgreSQL
├── packages/
│   └── shared/       # Shared TypeScript interfaces & enums
├── docker-compose.yml
└── .github/workflows/
```

## ✨ Features

### Frontend (`apps/web`)
- **Vite + React 19 + TypeScript**
- **Zustand** state management (`authStore`, `courseStore`, `enrollmentStore`, `quizStore`)
- **React Router v6** with role-based protected routes
- **Tailwind CSS** with dark mode design system
- **Axios** with JWT token injection & auto-refresh interceptors

#### Pages
| Route | Description |
|-------|-------------|
| `/auth/login` | Sign-in form |
| `/auth/register` | Account creation |
| `/courses` | Catalog with module/level/examCode/search filters |
| `/courses/:id` | Course detail with enroll CTA |
| `/courses/:id/learn` | Content viewer (PDF, video, links) + quiz launcher |
| `/student/dashboard` | Enrolled course progress cards |
| `/admin/dashboard` | Stats: enrollments, revenue, completion rates |
| `/admin/courses` | CRUD table + publish toggle |
| `/admin/users` | User list + role editor |
| `/quiz/:quizId` | Quiz player with timer + question stepper |
| `/quiz/:quizId/results` | Score, pass/fail, retry CTA |

### Backend (`apps/api`)
- **NestJS + TypeORM + PostgreSQL**
- **JWT** access + refresh token auth
- **Google OAuth2** support (optional)
- **Role-based access control**: `admin`, `instructor`, `student`

#### Modules
| Module | Endpoints |
|--------|-----------|
| `auth` | POST `/api/auth/register`, `/login`, `/refresh`, `/logout` |
| `users` | GET/PATCH/DELETE `/api/users` (admin) |
| `courses` | Full CRUD + publish toggle + filtering |
| `content` | Per-course content items (video/pdf/link/lab) |
| `enrollments` | Enroll, drop, progress update |
| `assessments` | Quiz CRUD + attempt start/submit + auto-scoring |
| `discussions` | Thread + reply model (Phase 2 stub) |
| `notifications` | Nodemailer enrollment confirmation + reminders |
| `reports` | Admin: enrollment count, completion rate, avg score |
| `payments` | Stripe checkout stub (Phase 3) |

### Shared Package (`packages/shared`)
- TypeScript interfaces: `User`, `Course`, `Content`, `Enrollment`, `Quiz`, `Question`, `Choice`, `Attempt`
- Enums: `UserRole`, `SoftwareModule`, `CourseLevel`, `ContentType`, `EnrollmentStatus`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm 10+

### 1. Clone & install dependencies

```bash
git clone https://github.com/your-org/mos-platform.git
cd mos-platform
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start the database

```bash
docker compose up -d
```

PostgreSQL will be available at `localhost:5432`.
pgAdmin UI at `http://localhost:5050` (admin@mos.local / admin).

### 4. Run database migrations

```bash
cd apps/api
npm run migration:run
cd ../..
```

### 5. Start development servers

```bash
# Terminal 1: API
npm run dev:api

# Terminal 2: Frontend
npm run dev:web
```

- **API**: http://localhost:3000/api
- **Web**: http://localhost:5173

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection URL |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_EXPIRY` | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `S3_BUCKET` | AWS S3 bucket name |
| `S3_REGION` | AWS S3 region |
| `AWS_ACCESS_KEY` | AWS access key ID |
| `AWS_SECRET_KEY` | AWS secret access key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port |
| `MAIL_USER` | SMTP username |
| `MAIL_PASS` | SMTP password |
| `FRONTEND_URL` | Frontend origin URL |
| `VITE_API_URL` | API base URL (frontend) |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests only
npx nx test web

# API tests only
npx nx test api

# With coverage
npx nx test web --coverage
```

---

## 🔨 Build

```bash
# Build frontend (outputs to dist/apps/web)
npm run build:web

# Build API (outputs to dist/apps/api)
npm run build:api
```

---

## 📦 Development Commands

```bash
# Lint all projects
npm run lint

# Format all files
npm run format

# Generate TypeORM migration
cd apps/api && npm run migration:generate -- -n MigrationName

# Revert last migration
cd apps/api && npm run migration:revert
```

---

## 🌐 Deployment

### Vercel (Frontend)
1. Import the monorepo to Vercel
2. Set **Root Directory** to `apps/web`
3. Set **Build Command** to `cd ../.. && npx nx build web --configuration=production`
4. Set **Output Directory** to `dist`
5. Add env var: `VITE_API_URL=https://your-api.railway.app/api`

### Railway (API)
1. Create a new Railway project
2. Add the **PostgreSQL** plugin — `DATABASE_URL` is auto-injected
3. Set **Root Directory** to `apps/api`
4. Set **Start Command** to `node dist/main`
5. Add all other env vars via Railway dashboard
6. `PORT` is automatically assigned by Railway

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `RAILWAY_TOKEN` | Railway deployment token |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `VITE_API_URL` | Production API URL for build |

---

## 📁 Project Structure

```
apps/
├── api/src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── decorators/   # @Roles, @CurrentUser
│   │   ├── guards/       # RolesGuard
│   │   └── filters/      # AllExceptionsFilter
│   ├── database/
│   │   ├── data-source.ts
│   │   └── migrations/
│   └── modules/
│       ├── auth/         # JWT auth + Google OAuth
│       ├── users/        # User CRUD + role assignment
│       ├── courses/      # Course CRUD + filtering + publish
│       ├── content/      # Per-course content items
│       ├── enrollments/  # Enroll/drop/progress
│       ├── assessments/  # Quiz + attempt + auto-scoring
│       ├── discussions/  # Phase 2 stub
│       ├── notifications/ # Nodemailer
│       ├── reports/      # Admin analytics
│       └── payments/     # Stripe Phase 3 stub
├── web/src/
│   ├── pages/
│   │   ├── auth/         # Login, Register
│   │   ├── courses/      # Catalog, Detail, Learn
│   │   ├── student/      # Dashboard
│   │   ├── admin/        # Dashboard, Courses, Users
│   │   └── quiz/         # Player, Results
│   ├── stores/           # Zustand stores
│   ├── services/         # Typed API wrappers
│   ├── components/       # Layout, UI components
│   └── router/           # AppRouter, ProtectedRoute
packages/
└── shared/src/
    ├── enums.ts
    ├── interfaces.ts
    └── index.ts
```

---

## 🔐 Security Notes

- All secrets are loaded from environment variables — **never hardcoded**
- JWT tokens are short-lived (15m access, 7d refresh) with auto-rotation
- Passwords hashed with bcrypt (12 rounds)
- CORS restricted to `FRONTEND_URL`
- Global `ValidationPipe` with `whitelist: true` to strip unknown fields
- `RolesGuard` enforces RBAC on all sensitive endpoints

---

## 📋 Roadmap

- [x] Phase 1: Core platform (auth, courses, enrollments, quizzes)
- [ ] Phase 2: Discussions (threads + replies)
- [ ] Phase 3: Payments (Stripe checkout + webhooks + auto-enroll)
- [ ] Phase 4: Admin analytics charts, S3 file uploads
- [ ] Phase 5: Mobile app (React Native)

---

## 🤝 Contributing

1. Fork and clone the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes, run `npm run lint` and `npm test`
4. Open a PR to `develop` — CI will run automatically

---

## 📄 License

MIT © MOS Platform
