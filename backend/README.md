# Naseem School Hub - Backend API

A production-ready Node.js + TypeScript backend for the Naseem School Hub learning management system.

## Architecture Overview

```
backend/
├── src/
│   ├── index.ts              # Express app setup & routing
│   ├── config/               # Configuration & environment variables
│   ├── middleware/           # Express middleware (auth, responses, etc)
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic layer
│   ├── repositories/         # Data access (future: if needed)
│   ├── schemas/              # Zod validation schemas (future)
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions (errors, db, etc)
├── prisma/
│   ├── schema.prisma         # Prisma data model
│   └── migrations/           # Database migrations
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Runtime**: Node.js (ES2022)
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Clerk
- **Validation**: Zod (ready to be integrated)
- **Dev Tools**: tsx, TypeScript compiler

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string (from Supabase)
- `CLERK_SECRET_KEY` - Your Clerk secret key

### 3. Setup Database

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

All endpoints require authentication with Clerk token in `Authorization: Bearer <token>` header (except public endpoints).

### Authentication
- `POST /api/auth/ensure-profile` - Create/update profile on first login
- `GET /api/auth/me` - Get current user's profile

### Courses
- `GET /api/courses` - List all courses (with optional `?teacherId` filter)
- `POST /api/courses` - Create course (teacher only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (teacher only)
- `DELETE /api/courses/:id` - Delete course (teacher only)
- `POST /api/courses/:id/enroll` - Enroll in course

### Assignments
- `GET /api/assignments` - List assignments (with optional `?courseId` filter)
- `POST /api/assignments` - Create assignment (teacher only)
- `GET /api/assignments/:id` - Get assignment details
- `DELETE /api/assignments/:id` - Delete assignment (teacher only)

### Submissions
- `GET /api/submissions?assignmentId=...` - List submissions for assignment
- `POST /api/submissions` - Submit assignment
- `PATCH /api/submissions/:id` - Grade submission (teacher) or update (student)

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `GET /api/profiles?userIds=id1,id2,...` - Get multiple profiles

### Enrollments
- `GET /api/enrollments` - Get student's enrolled course IDs

### Schedule (stub - ready for implementation)
- `GET /api/schedule` - List schedule entries
- `POST /api/schedule` - Create schedule entry
- `DELETE /api/schedule/:id` - Delete schedule entry

### Messages (stub - ready for implementation)
- `GET /api/messages/inbox` - Get user's messages
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark as read

### Parent Portal (stub - ready for implementation)
- `POST /api/parent/link` - Link parent to student
- `GET /api/parent/students` - Get linked students
- `GET /api/parent/students/:studentId/grades` - Get student's grades
- `GET /api/parent/students/:studentId/courses` - Get student's courses

## Project Structure

### Services Layer

Each feature has a service class containing business logic:

- **AuthService** - User authentication & profile management
- **CourseService** - Course CRUD & student enrollments
- **AssignmentService** - Assignment CRUD, submissions, grading
- **MessageService** (stub) - User messaging
- **ScheduleService** (stub) - Schedule management

### Middleware

- **auth.ts** - Clerk token verification & role checks
- **response.ts** - Standardized response formatting

### Types

All DTOs (Data Transfer Objects) are defined in `src/types/index.ts` to match the frontend API client expectations.

## Database Schema

The Prisma schema includes models for:

- **Profile** - User information (connected to Clerk)
- **Course** - Courses with teacher relationship
- **Enrollment** - Student course enrollments
- **Lesson** - Course lessons/modules
- **Assignment** - Course assignments
- **Submission** - Assignment submissions with grading
- **ScheduleEntry** - Class schedule & events
- **Message** - User-to-user messaging
- **FileRecord** - File upload tracking
- **AuditLog** - Activity logging

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

Common error codes:
- `BAD_REQUEST` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `UNPROCESSABLE_ENTITY` (422)
- `INTERNAL_ERROR` (500)

## Development

### Type Checking
```bash
npm run typecheck
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Database Tools

View/edit data in Prisma Studio:
```bash
npm run prisma:studio
```

## Next Steps

1. **Implement remaining services** (Messages, Schedule, Parent)
2. **Add input validation** (Zod schemas)
3. **Add comprehensive testing** (Jest, Supertest)
4. **Setup logging** (Winston, Pino)
5. **Add file upload support** (GCS integration)
6. **Setup Clerk webhooks** (user sync, role management)
7. **Add caching** (Redis for performance)
8. **Setup CI/CD** (GitHub Actions, Vercel, etc)

## Environment Variables

```
# Database (from Supabase)
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres

# Clerk authentication
CLERK_SECRET_KEY=sk_live_...

# API Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

## Contributing

- Keep services focused on single responsibility
- Use TypeScript strict mode
- Write error messages clearly
- Follow existing code patterns
- Test before committing

## Support

For issues or questions, check:
- Prisma docs: https://www.prisma.io/docs/
- Express docs: https://expressjs.com/
- Clerk docs: https://clerk.com/docs
