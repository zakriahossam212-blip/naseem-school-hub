# Backend API Integration Guide

## Architecture Overview

The backend follows a **layered architecture** with clear separation of concerns:

```
Request → Middleware → Routes → Services → Repositories → Database
                                ↓ (Error Handling & Logging)
```

## Layer Breakdown

### 1. **Routes Layer** (`src/routes/`)
- **Responsibility**: HTTP endpoint handling, request validation
- **Location**: `src/routes/{feature}.ts`
- **Pattern**: Express Router with async handlers
- **Error Handling**: Caught by `asyncHandler` wrapper

```typescript
router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
  const data = await service.getData(req.params.id);
  res.success(data);
}));
```

### 2. **Services Layer** (`src/services/`)
- **Responsibility**: Business logic, orchestration, data transformation
- **Location**: `src/services/{feature}/ServiceName.ts`
- **Pattern**: Class-based with dependency injection (repositories)
- **Usage**: Receives repositories in constructor

```typescript
export class CourseService {
  constructor(private courseRepo: CourseRepository) {}
  
  async createCourse(data: CreateCourseDTO) {
    // Business logic
    return await this.courseRepo.create(data);
  }
}
```

### 3. **Repositories Layer** (`src/repositories/`)
- **Responsibility**: Data access abstraction over Prisma
- **Location**: `src/repositories/{feature}/Repository.ts`
- **Pattern**: Base class with CRUD operations
- **Features**: Error handling, validation, DTO mapping

```typescript
export class CourseRepository extends BaseRepository {
  async create(data: CreateCourseData) {
    return await this.prisma.course.create({ data });
  }
}
```

### 4. **Middleware Layer** (`src/middleware/`)
- **requestLogger**: Adds request ID (UUID), logs timing
- **auth**: Validates Clerk JWT tokens
- **response**: Sets JSON response format
- **error**: Global error handler

### 5. **Utilities** (`src/utils/`)
- **logger.ts**: Structured logging with context
- **errors.ts**: Error classes and handlers
- **db.ts**: Prisma client initialization
- **schemas/**: Zod validation schemas

## Feature Organization

### Courses Feature
```
src/services/courses/
├── CourseService.ts
├── EnrollmentService.ts
├── LessonService.ts
└── index.ts

src/repositories/courses/
├── CourseRepository.ts
├── EnrollmentRepository.ts
└── index.ts

src/routes/
├── courses.ts      (GET, POST, PUT, DELETE /courses)
└── enrollments.ts  (GET, POST /enrollments)
```

### Assignments Feature
```
src/services/assignments/
├── AssignmentService.ts
├── SubmissionService.ts
├── GradingService.ts
└── index.ts

src/repositories/assignments/
├── AssignmentRepository.ts
├── SubmissionRepository.ts
└── index.ts

src/routes/
├── assignments.ts   (GET, POST, PUT /assignments)
└── submissions.ts   (GET, POST /submissions)
```

## Data Flow Example

### Create Course Request

1. **Request**
   ```
   POST /api/v1/courses
   { title, description, instructorId, code }
   ```

2. **Route Handler** (`src/routes/courses.ts`)
   ```typescript
   router.post('/', asyncHandler(async (req, res) => {
     const validated = createCourseSchema.parse(req.body);
     const course = await courseService.createCourse(validated);
     res.success(course, 201);
   }));
   ```

3. **Service** (`src/services/courses/CourseService.ts`)
   ```typescript
   async createCourse(data: CreateCourseDTO) {
     logger.info('Creating course', { title: data.title });
     return await this.courseRepository.create(data);
   }
   ```

4. **Repository** (`src/repositories/courses/CourseRepository.ts`)
   ```typescript
   async create(data) {
     try {
       const course = await this.prisma.course.create({ data });
       logger.logDbOperation('CREATE', 'course', duration);
       return this.mapToDto(course);
     } catch (error) {
       this.handleError(error, 'Failed to create course');
     }
   }
   ```

5. **Database** (`Prisma`)
   ```sql
   INSERT INTO courses (title, description, instructorId, code)
   VALUES (...);
   ```

6. **Response**
   ```json
   {
     "success": true,
     "data": {
       "id": "course1",
       "title": "TypeScript Basics",
       ...
     }
   }
   ```

## Error Handling Flow

### Example: Validation Error

1. **Route receives invalid data**
   ```typescript
   POST /api/v1/courses
   { title: "TS" }  // Too short
   ```

2. **Schema validation fails** (`src/schemas/courses/create.ts`)
   ```typescript
   const schema = z.object({
     title: z.string().min(3)  // Throws ValidationError
   });
   ```

3. **asyncHandler catches error**
   ```typescript
   // In errors.ts asyncHandler wrapper
   Promise.resolve(fn(...)).catch(err => {
     logger.error('Async error', err, { path, requestId });
     next(err); // Pass to error handler
   });
   ```

4. **Global error handler processes** (`src/middleware/error.ts`)
   ```typescript
   if (err instanceof AppError) {
     return res.status(err.statusCode).json({
       success: false,
       error: err.message,
       code: err.code,
       requestId
     });
   }
   ```

5. **Client receives error**
   ```json
   {
     "success": false,
     "error": "Validation failed",
     "code": "BAD_REQUEST",
     "statusCode": 400,
     "requestId": "uuid-here"
   }
   ```

## Logging Integration

### Request Logging
```
[2026-06-13T10:30:45.123Z] [INFO] GET /api/v1/courses | {
  "requestId": "uuid-1234",
  "userId": "user1",
  "ip": "127.0.0.1"
}
```

### Response Logging
```
[2026-06-13T10:30:45.167Z] [INFO] GET /api/v1/courses → 200 | {
  "requestId": "uuid-1234",
  "duration": "44ms"
}
```

### Database Operation Logging
```
[2026-06-13T10:30:45.150Z] [DEBUG] DB: CREATE on courses | {
  "duration": "20ms"
}
```

### Error Logging
```
[2026-06-13T10:30:45.200Z] [WARN] Error: Validation failed | {
  "statusCode": 400,
  "code": "BAD_REQUEST",
  "path": "/api/v1/courses",
  "requestId": "uuid-1234"
}
```

## Dependency Injection Pattern

### Service Initialization
```typescript
// In index.ts or main app setup
import { prisma } from '@/utils/db';
import { CourseRepository, EnrollmentRepository } from '@/repositories/courses';
import { CourseService, EnrollmentService } from '@/services/courses';

export const courseRepository = new CourseRepository(prisma);
export const courseService = new CourseService(courseRepository);

export const enrollmentRepository = new EnrollmentRepository(prisma);
export const enrollmentService = new EnrollmentService(enrollmentRepository);
```

### Route Usage
```typescript
import { courseService } from '@/services/courses';

router.get('/:id', asyncHandler(async (req, res) => {
  const course = await courseService.getCourse(req.params.id);
  res.success(course);
}));
```

## Testing Strategy

### Unit Tests
- **Services**: Mock repositories
- **Repositories**: Mock Prisma client
- **Utils**: Test logger, error classes independently

### Integration Tests
- **Routes**: Use test database, real services
- **Schemas**: Validate input/output formats

### Example Mock Setup
```typescript
import { mockPrismaClient } from '__tests__/mocks/db.mock';

describe('CourseService', () => {
  let service: CourseService;
  let repo: CourseRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new CourseRepository(mockPrismaClient);
    service = new CourseService(repo);
  });
});
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Supabase
SUPABASE_URL=https://...
SUPABASE_KEY=...

# Clerk Auth
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Logging
LOG_LEVEL=INFO  # ERROR, WARN, INFO, DEBUG

# Environment
NODE_ENV=production
```

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/ensure-profile` - Create/update profile
- `GET /api/v1/auth/me` - Get current user

### Courses
- `GET /api/v1/courses` - List all courses
- `POST /api/v1/courses` - Create course
- `GET /api/v1/courses/:id` - Get course details
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Delete course

### Enrollments
- `GET /api/v1/enrollments` - List enrollments
- `POST /api/v1/enrollments` - Enroll student
- `DELETE /api/v1/enrollments/:id` - Remove enrollment

### Assignments
- `GET /api/v1/assignments` - List assignments
- `POST /api/v1/assignments` - Create assignment
- `PUT /api/v1/assignments/:id` - Update assignment
- `DELETE /api/v1/assignments/:id` - Delete assignment

### Submissions
- `GET /api/v1/submissions` - List submissions
- `POST /api/v1/submissions` - Submit assignment
- `PUT /api/v1/submissions/:id` - Grade submission

### Messages
- `GET /api/v1/messages/inbox` - Get inbox
- `POST /api/v1/messages` - Send message
- `PUT /api/v1/messages/:id/read` - Mark as read

### Schedule
- `GET /api/v1/schedule` - List schedule entries
- `POST /api/v1/schedule` - Create schedule entry
- `PUT /api/v1/schedule/:id` - Update schedule entry

### Parent Portal
- `POST /api/v1/parent/link-student` - Link student
- `GET /api/v1/parent/students` - Get linked students
- `GET /api/v1/parent/students/:id/overview` - Student overview
- `GET /api/v1/parent/students/:id/grades` - Student grades

## Best Practices

### 1. Error Handling
- Always extend `AppError` for custom errors
- Use specific error codes for client handling
- Log errors with full context

### 2. Validation
- Validate in routes before service call
- Use Zod schemas for type safety
- Provide detailed error messages

### 3. Logging
- Log at service layer (business logic)
- Include request ID for tracing
- Use appropriate log levels

### 4. Database Operations
- Use repositories, never Prisma directly in services
- Handle all database errors in repository
- Map entities to DTOs before returning

### 5. Performance
- Add indexes for frequently queried fields
- Limit query results with pagination
- Cache when appropriate

## Troubleshooting

### Request hangs or times out
1. Check database connection
2. Review service logic for infinite loops
3. Check logger for performance issues

### 500 errors
1. Check log for error details
2. Verify all dependencies are initialized
3. Test with curl to isolate issue

### Validation errors
1. Check request body format
2. Review schema in `src/schemas/{feature}`
3. Verify required fields are provided

### Authentication issues
1. Check Clerk configuration
2. Verify JWT token in Authorization header
3. Check requireAuth middleware placement
