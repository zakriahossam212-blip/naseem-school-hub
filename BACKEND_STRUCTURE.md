# Backend Architecture & Structure Guide

## Overview

The backend follows a layered architecture pattern with clear separation of concerns:

```
backend/
├── src/
│   ├── index.ts                           # Express app setup & server start
│   ├── config/                            # Configuration & environment
│   │   ├── index.ts                       # Main config loader
│   │   ├── supabase.ts                    # Supabase client setup
│   │   └── swagger.ts                     # Swagger/OpenAPI documentation
│   │
│   ├── middleware/                        # Express middleware
│   │   ├── auth.ts                        # Clerk authentication
│   │   └── response.ts                    # Standardized responses
│   │
│   ├── routes/                            # API route handlers (grouped by domain)
│   │   ├── auth.ts                        # Authentication endpoints
│   │   ├── courses.ts                     # Course management
│   │   ├── assignments.ts                 # Assignment operations
│   │   ├── submissions.ts                 # Submission handling
│   │   ├── profiles.ts                    # User profiles
│   │   ├── enrollments.ts                 # Course enrollments
│   │   ├── schedule.ts                    # Class schedules
│   │   ├── messages.ts                    # Messaging system
│   │   └── parent.ts                      # Parent portal
│   │
│   ├── services/                          # Business logic layer (feature-based)
│   │   ├── auth/                          # Authentication service
│   │   │   ├── AuthService.ts             # Main auth logic
│   │   │   ├── types.ts                   # Auth-specific types
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   ├── courses/                       # Course management service
│   │   │   ├── CourseService.ts           # Course logic
│   │   │   ├── EnrollmentService.ts       # Enrollment logic
│   │   │   ├── LessonService.ts           # Lesson logic
│   │   │   ├── types.ts                   # Course types
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   ├── assignments/                   # Assignment & grading service
│   │   │   ├── AssignmentService.ts       # Assignment CRUD
│   │   │   ├── SubmissionService.ts       # Submission handling
│   │   │   ├── GradingService.ts          # Grading logic
│   │   │   ├── types.ts                   # Assignment types
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   ├── messaging/                     # Messaging service
│   │   │   ├── MessageService.ts          # Message logic
│   │   │   ├── types.ts                   # Message types
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   ├── schedule/                      # Schedule service
│   │   │   ├── ScheduleService.ts         # Schedule logic
│   │   │   ├── types.ts                   # Schedule types
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   ├── parent/                        # Parent portal service
│   │   │   ├── ParentService.ts           # Parent logic
│   │   │   ├── types.ts                   # Parent types
│   │   │   └── index.ts                   # Barrel export
│   │   │
│   │   └── common/                        # Shared services
│   │       ├── ProfileService.ts          # Profile operations
│   │       ├── FileService.ts             # File management
│   │       ├── types.ts                   # Common types
│   │       └── index.ts                   # Barrel export
│   │
│   ├── repositories/                      # Data access layer (future)
│   │   ├── base/                          # Base repository pattern
│   │   │   ├── BaseRepository.ts          # Abstract base class
│   │   │   └── index.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── ProfileRepository.ts       # Profile CRUD
│   │   │   └── index.ts
│   │   │
│   │   ├── courses/
│   │   │   ├── CourseRepository.ts        # Course CRUD
│   │   │   ├── EnrollmentRepository.ts    # Enrollment CRUD
│   │   │   ├── LessonRepository.ts        # Lesson CRUD
│   │   │   └── index.ts
│   │   │
│   │   ├── assignments/
│   │   │   ├── AssignmentRepository.ts    # Assignment CRUD
│   │   │   ├── SubmissionRepository.ts    # Submission CRUD
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                       # Central export
│   │
│   ├── schemas/                           # Zod validation schemas (future)
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── courses/
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── assignments/
│   │   │   ├── create.ts
│   │   │   ├── submit.ts
│   │   │   ├── grade.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                       # Central export
│   │
│   ├── types/                             # TypeScript type definitions
│   │   ├── api.ts                         # API response/request types
│   │   ├── auth.ts                        # Authentication types
│   │   ├── courses.ts                     # Course-related types
│   │   ├── assignments.ts                 # Assignment-related types
│   │   ├── common.ts                      # Common utility types
│   │   └── index.ts                       # Barrel export
│   │
│   └── utils/                             # Utility functions
│       ├── errors.ts                      # Error handling & classes
│       ├── db.ts                          # Database utilities
│       ├── logging.ts                     # Logging utilities (optional)
│       ├── validators.ts                  # Custom validators
│       ├── formatters.ts                  # Data formatters
│       └── index.ts                       # Barrel export
│
├── prisma/
│   ├── schema.prisma                      # Database schema
│   └── migrations/                        # Database migrations
│
├── .env                                   # Environment variables (gitignored)
├── .env.example                           # Example env template
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture Layers Explained

### 1. **Routes Layer** (`src/routes/`)
- Entry points for HTTP requests
- **Responsibility**: Parse requests, validate basic input, delegate to services
- **Pattern**: Each route file handles one resource domain
- **Naming**: `<resource>.ts` (e.g., `courses.ts`, `assignments.ts`)

### 2. **Services Layer** (`src/services/`)
- Contains all business logic
- **Responsibility**: Business rules, data validation, orchestration
- **Pattern**: Feature-based organization with related services grouped
- **Naming**: `<Feature>Service.ts` (e.g., `CourseService`, `SubmissionService`)
- **Exports**: Barrel export from `index.ts` in each feature folder

### 3. **Repositories Layer** (`src/repositories/`)
- Data access abstraction (future implementation)
- **Responsibility**: Database queries, ORM interaction
- **Pattern**: One repository per domain entity
- **Naming**: `<Entity>Repository.ts` (e.g., `CourseRepository`, `SubmissionRepository`)

### 4. **Schemas Layer** (`src/schemas/`)
- Input validation with Zod (future implementation)
- **Responsibility**: Validate request data before reaching services
- **Pattern**: One schema file per operation type
- **Naming**: `<operation>.ts` (e.g., `create.ts`, `submit.ts`, `grade.ts`)

### 5. **Types Layer** (`src/types/`)
- TypeScript type definitions
- **Responsibility**: Define all types and interfaces
- **Pattern**: Organized by domain
- **Naming**: `<domain>.ts` (e.g., `courses.ts`, `assignments.ts`)

### 6. **Utils Layer** (`src/utils/`)
- Shared utility functions
- **Responsibility**: Cross-cutting concerns (errors, logging, validation)
- **Pattern**: One file per utility category
- **Naming**: Descriptive (e.g., `errors.ts`, `validators.ts`)

### 7. **Middleware Layer** (`src/middleware/`)
- Express middleware functions
- **Responsibility**: Request processing, authentication, response formatting
- **Pattern**: One middleware concern per file
- **Naming**: `<concern>.ts` (e.g., `auth.ts`, `response.ts`)

### 8. **Config Layer** (`src/config/`)
- Configuration & initialization
- **Responsibility**: Environment setup, external service initialization
- **Pattern**: One config per external service
- **Naming**: `<service>.ts` (e.g., `supabase.ts`, `swagger.ts`)

## Current Status

### ✅ Complete
- Routes (9 routes)
- Config (3 config files)
- Middleware (2 middleware)
- Utils (2 utils)
- Types (1 file - needs expansion)
- Services (3 services - needs expansion)

### 🔲 To Implement (Priority Order)

#### Phase 1: Complete Services Layer
- Reorganize existing services into feature folders:
  - `services/auth/` → AuthService
  - `services/courses/` → CourseService, EnrollmentService, LessonService
  - `services/assignments/` → AssignmentService, SubmissionService, GradingService
- Add missing services:
  - `services/messaging/` → MessageService
  - `services/schedule/` → ScheduleService
  - `services/parent/` → ParentService
  - `services/common/` → ProfileService, FileService

#### Phase 2: Expand Types
- Organize types by domain:
  - `types/auth.ts` → Auth-specific types
  - `types/courses.ts` → Course, Enrollment, Lesson types
  - `types/assignments.ts` → Assignment, Submission types
  - `types/api.ts` → API response/request wrappers
  - `types/common.ts` → Shared types

#### Phase 3: Add Validation Schemas
- Create `schemas/` directory
- Add Zod schemas for:
  - Auth requests (login, register)
  - Course operations (create, update)
  - Assignment operations (create, submit, grade)
  - All other resources

#### Phase 4: Add Repositories
- Create `repositories/` directory
- Implement repository pattern for:
  - Profile access
  - Course access
  - Enrollment access
  - Assignment access
  - Submission access
- Allows easier testing and data source switching

## Naming Conventions

### Services
```typescript
// Class names - PascalCase + Service suffix
export class CourseService { }
export class SubmissionService { }
export class EnrollmentService { }
export class GradingService { }

// Methods - camelCase
async createCourse() { }
async getCourseById() { }
async updateCourse() { }
async deleteCourse() { }
async enrollStudent() { }
```

### Repositories
```typescript
// Class names - PascalCase + Repository suffix
export class CourseRepository { }
export class SubmissionRepository { }

// Methods - camelCase
async create() { }
async findById() { }
async findMany() { }
async update() { }
async delete() { }
```

### Types/Interfaces
```typescript
// Interfaces - IPascalCase
export interface ICreateCourseRequest { }
export interface ICreateCourseResponse { }
export interface ICourseDto { }

// Types - PascalCase (no prefix for DTOs)
export type CourseWithLessons = Course & { lessons: Lesson[] };
export type SubmissionStatus = 'SUBMITTED' | 'GRADED' | 'LATE';
```

### Routes
```typescript
// File names - lowercase with hyphens or underscores (converted to camelCase)
export const router = Router();

router.get('/', handleGetAll);           // GET /api/courses
router.post('/', handleCreate);          // POST /api/courses
router.get('/:id', handleGetOne);        // GET /api/courses/:id
router.put('/:id', handleUpdate);        // PUT /api/courses/:id
router.delete('/:id', handleDelete);     // DELETE /api/courses/:id
```

## Data Flow Example

### Creating a Course
```
1. HTTP POST /api/courses
   ↓
2. Route Handler (routes/courses.ts)
   - Parse request body
   - Extract user from auth context
   ↓
3. Validation (future: schemas/courses/create.ts)
   - Validate with Zod schema
   ↓
4. Service Layer (services/courses/CourseService.ts)
   - Business logic
   - Call repository
   - Return DTO
   ↓
5. Repository Layer (repositories/courses/CourseRepository.ts)
   - Execute Prisma query
   - Return raw data
   ↓
6. Response Middleware
   - Format response
   - Send to client
```

## Import Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@middleware/*": ["src/middleware/*"],
      "@routes/*": ["src/routes/*"],
      "@services/*": ["src/services/*"],
      "@repositories/*": ["src/repositories/*"],
      "@schemas/*": ["src/schemas/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

## Best Practices

1. **Single Responsibility**: Each file/class does one thing well
2. **DRY**: Don't repeat yourself - extract common logic to utils/base classes
3. **Meaningful Names**: Use descriptive, intention-revealing names
4. **Error Handling**: Use custom error classes in `utils/errors.ts`
5. **Type Safety**: Use strict TypeScript - no `any` types
6. **Logging**: Use logging utils for debugging
7. **Documentation**: JSDoc comments for complex functions
8. **Testing**: Each layer should be independently testable

## Next Steps

1. **Organize Services** by feature (auth, courses, assignments, messaging, schedule, parent, common)
2. **Expand Types** to cover all domains
3. **Add Validation** with Zod schemas
4. **Implement Repositories** for data access
5. **Add Tests** with Jest and Supertest
6. **Document APIs** with Swagger/OpenAPI
7. **Add Logging** with Winston or Pino

