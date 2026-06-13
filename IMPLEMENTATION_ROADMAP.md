# Backend Implementation Roadmap

## Current State Review ✅

### What's Already Built (✅ Ready)
1. **Routes Layer** - 9 complete route files
   - `auth.ts`, `courses.ts`, `assignments.ts`
   - `submissions.ts`, `profiles.ts`, `enrollments.ts`
   - `schedule.ts`, `messages.ts`, `parent.ts`

2. **Services Layer** - 3 core services (partial)
   - `AuthService.ts` - Profile management
   - `CourseService.ts` - Course operations
   - `AssignmentService.ts` - Assignment & submission handling

3. **Types Layer** - Comprehensive (✅ Just completed)
   - 50+ type definitions organized by domain
   - Complete DTOs for all resources
   - Request/response types

4. **Config Layer** - Complete
   - `index.ts` - Environment configuration
   - `supabase.ts` - Supabase client setup
   - `swagger.ts` - API documentation

5. **Middleware** - Complete
   - `auth.ts` - Clerk authentication
   - `response.ts` - Response formatting

6. **Utils** - Core utilities
   - `errors.ts` - Error handling
   - `db.ts` - Database utilities

7. **Database** - Configured
   - Prisma schema with 11 models
   - Connected to Supabase PostgreSQL
   - Ready for migrations

---

## Implementation Priority & Phasing

### 🔴 CRITICAL - Phase 1: Complete Services Layer (3-4 hours)
**Impact:** HIGH - Enables all business logic, unblocks route testing

#### 1.1 Reorganize Existing Services
Move from flat to feature-based structure:

**Current (Flat):**
```
services/
├── AuthService.ts
├── CourseService.ts
├── AssignmentService.ts
└── index.ts
```

**Target (Feature-Based):**
```
services/
├── auth/
│   ├── AuthService.ts (move from root)
│   ├── ProfileService.ts (new - extracted from AuthService)
│   └── index.ts (barrel export)
│
├── courses/
│   ├── CourseService.ts (move from root)
│   ├── EnrollmentService.ts (new - extracted from CourseService)
│   ├── LessonService.ts (new - create)
│   └── index.ts (barrel export)
│
├── assignments/
│   ├── AssignmentService.ts (move from root)
│   ├── SubmissionService.ts (new - extracted from AssignmentService)
│   ├── GradingService.ts (new - create)
│   └── index.ts (barrel export)
│
├── messaging/
│   ├── MessageService.ts (new)
│   └── index.ts
│
├── schedule/
│   ├── ScheduleService.ts (new)
│   └── index.ts
│
├── parent/
│   ├── ParentService.ts (new)
│   └── index.ts
│
└── index.ts (central barrel export)
```

#### 1.2 Action Items (In Order)

**Step 1: Create auth/ folder**
```typescript
// backend/src/services/auth/index.ts
export { AuthService, authService } from './AuthService';
export { ProfileService, profileService } from './ProfileService';
```

**Step 2: Create ProfileService** (Extract from AuthService)
```typescript
// backend/src/services/auth/ProfileService.ts
// Move getProfile, updateProfile, listProfiles from AuthService
export class ProfileService {
  async getProfile(userId: string): Promise<ProfileDto> { }
  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<ProfileDto> { }
  async listProfiles(userIds: string[]): Promise<ProfileDto[]> { }
}
```

**Step 3: Update AuthService** (Keep only auth logic)
```typescript
// backend/src/services/auth/AuthService.ts
// Keep ensureProfile, addRole
export class AuthService {
  async ensureProfile(userId: string, data: EnsureProfileRequest): Promise<ProfileDto> { }
  async addRole(userId: string, role: Role): Promise<void> { }
}
```

**Step 4: Create courses/ folder**
```typescript
// backend/src/services/courses/index.ts
export { CourseService, courseService } from './CourseService';
export { EnrollmentService, enrollmentService } from './EnrollmentService';
export { LessonService, lessonService } from './LessonService';
```

**Step 5: Create EnrollmentService** (Extract from CourseService)
```typescript
// backend/src/services/courses/EnrollmentService.ts
export class EnrollmentService {
  async enrollStudent(courseId: string, studentId: string): Promise<void> { }
  async getStudentEnrollments(studentId: string): Promise<string[]> { }
  async getCourseEnrollments(courseId: string): Promise<string[]> { }
}
```

**Step 6: Create LessonService** (New)
```typescript
// backend/src/services/courses/LessonService.ts
export class LessonService {
  async createLesson(data: CreateLessonRequest, createdBy: string): Promise<LessonDto> { }
  async getLesson(id: string): Promise<LessonDto> { }
  async listLessons(courseId: string): Promise<LessonDto[]> { }
  async updateLesson(id: string, data: UpdateLessonRequest, userId: string): Promise<LessonDto> { }
  async deleteLesson(id: string, userId: string): Promise<void> { }
}
```

**Step 7: Create assignments/ folder**
```typescript
// backend/src/services/assignments/index.ts
export { AssignmentService, assignmentService } from './AssignmentService';
export { SubmissionService, submissionService } from './SubmissionService';
export { GradingService, gradingService } from './GradingService';
```

**Step 8: Create SubmissionService** (Extract from AssignmentService)
```typescript
// backend/src/services/assignments/SubmissionService.ts
export class SubmissionService {
  async submitAssignment(assignmentId: string, studentId: string, data: CreateSubmissionRequest): Promise<SubmissionDto> { }
  async getSubmissions(assignmentId: string): Promise<SubmissionDto[]> { }
  async getStudentSubmission(assignmentId: string, studentId: string): Promise<SubmissionDto | null> { }
}
```

**Step 9: Create GradingService** (New)
```typescript
// backend/src/services/assignments/GradingService.ts
export class GradingService {
  async gradeSubmission(submissionId: string, teacherId: string, data: GradeSubmissionRequest): Promise<SubmissionDto> { }
  async getStudentGrades(studentId: string): Promise<GradeDto[]> { }
}
```

**Step 10: Create messaging/**, **schedule/**, **parent/** folders
```typescript
// Each with their respective services and barrel exports
```

**Effort:** 3-4 hours
**Files to Create:** 13 new files (7 services + 6 index.ts barrel exports)
**Files to Move:** 3 existing services
**Files to Delete:** None (keep old services until confirmed new ones work)

---

### 🟠 HIGH - Phase 2: Add Validation Schemas (2-3 hours)
**Impact:** HIGH - Validates all inputs before business logic

#### 2.1 Create Zod Validation Schemas

```
schemas/
├── auth/
│   ├── ensureProfile.ts
│   ├── updateProfile.ts
│   └── index.ts
│
├── courses/
│   ├── create.ts
│   ├── update.ts
│   ├── enroll.ts
│   └── index.ts
│
├── assignments/
│   ├── create.ts
│   ├── update.ts
│   ├── submit.ts
│   ├── grade.ts
│   └── index.ts
│
├── schedule/
│   ├── create.ts
│   ├── update.ts
│   └── index.ts
│
├── messages/
│   ├── send.ts
│   └── index.ts
│
└── index.ts (central export)
```

#### 2.2 Examples

```typescript
// backend/src/schemas/auth/ensureProfile.ts
import { z } from 'zod';

export const ensureProfileSchema = z.object({
  fullName: z.string().optional().nullable(),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN']).optional(),
});

export type EnsureProfileInput = z.infer<typeof ensureProfileSchema>;
```

```typescript
// backend/src/schemas/courses/create.ts
import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
```

#### 2.3 Integration in Routes

```typescript
// Before: routes/courses.ts
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const course = await courseService.createCourse(req.user.id, { title, description });
  res.json(course);
});

// After: routes/courses.ts
router.post('/', async (req, res) => {
  const validated = createCourseSchema.parse(req.body);
  const course = await courseService.createCourse(req.user.id, validated);
  res.json(course);
});
```

**Effort:** 2-3 hours
**Files to Create:** 15 schema files
**Payoff:** Type-safe input validation, better error messages

---

### 🟡 MEDIUM - Phase 3: Add Tests (4-6 hours)
**Impact:** MEDIUM - Ensures reliability, enables refactoring

#### 3.1 Test Structure

```
backend/
├── src/
├── __tests__/
│   ├── services/
│   │   ├── auth.test.ts
│   │   ├── courses.test.ts
│   │   ├── assignments.test.ts
│   │   └── ...
│   ├── routes/
│   │   ├── auth.test.ts
│   │   ├── courses.test.ts
│   │   └── ...
│   └── utils/
│       ├── errors.test.ts
│       └── db.test.ts
├── jest.config.js
└── tsconfig.test.json
```

#### 3.2 Example Test

```typescript
// backend/__tests__/services/courses.test.ts
import { CourseService } from '@/services/courses';
import { db } from '@/utils/db';

describe('CourseService', () => {
  const courseService = new CourseService();

  describe('createCourse', () => {
    it('should create a course', async () => {
      const course = await courseService.createCourse('teacher-id', {
        title: 'Math 101',
        description: 'Introduction to Calculus'
      });
      
      expect(course).toHaveProperty('id');
      expect(course.title).toBe('Math 101');
    });

    it('should throw error if teacher not found', async () => {
      await expect(
        courseService.createCourse('non-existent-id', { title: 'Course' })
      ).rejects.toThrow('Teacher profile not found');
    });
  });
});
```

**Effort:** 4-6 hours
**Setup Time:** 1 hour (Jest config, test utilities)
**Test Coverage Target:** 80%+

---

### 🔵 MEDIUM-LOW - Phase 4: Implement Repositories (4-5 hours)
**Impact:** MEDIUM - Enables testing, easier refactoring

#### 4.1 Repository Pattern

```typescript
// backend/src/repositories/base/BaseRepository.ts
export abstract class BaseRepository<T> {
  async findById(id: string): Promise<T | null> { }
  async findMany(filters?: any): Promise<T[]> { }
  async create(data: any): Promise<T> { }
  async update(id: string, data: any): Promise<T> { }
  async delete(id: string): Promise<void> { }
}

// backend/src/repositories/courses/CourseRepository.ts
export class CourseRepository extends BaseRepository<Course> {
  async findByTeacherId(teacherId: string): Promise<Course[]> { }
}
```

**Effort:** 4-5 hours
**Files to Create:** 8 repository files
**Benefit:** Decoupled data access, easier mocking for tests

---

### 🟢 LOW - Phase 5: Add Logging (2-3 hours)
**Impact:** LOW - Useful for debugging but not blocking

#### 5.1 Logging Setup

```typescript
// backend/src/utils/logging.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

**Effort:** 2-3 hours
**Optional:** Can use Pino or bunyan instead

---

## Quick Start Path (MVP)

If you want the fastest path to a working backend:

### Week 1: Foundation (Today - Tomorrow)
1. ✅ Services Layer Organization (Phase 1) - 3-4 hrs
2. ✅ Validation Schemas (Phase 2) - 2-3 hrs
3. **Total: 5-7 hours** → MVP ready

### Week 2: Quality (Next)
4. Add Tests (Phase 3) - 4-6 hrs
5. Error Handling Polish - 1-2 hrs

### Week 3: Scale (Future)
6. Repositories (Phase 4) - 4-5 hrs
7. Logging & Monitoring - 2-3 hrs

---

## Detailed Implementation Steps for Phase 1

### Step-by-step execution guide:

#### 1. Create services/auth/ folder

```bash
mkdir -p backend/src/services/auth
```

#### 2. Move AuthService.ts

```bash
cp backend/src/services/AuthService.ts backend/src/services/auth/AuthService.ts
```

#### 3. Create ProfileService.ts

Extract profile-related methods from AuthService:
- `getProfile()` → ProfileService
- `updateProfile()` → ProfileService
- `listProfiles()` → ProfileService

Keep in AuthService:
- `ensureProfile()` - Auth-specific
- `addRole()` - Auth-specific

#### 4. Create barrel export

```typescript
// backend/src/services/auth/index.ts
export { AuthService, authService } from './AuthService';
export { ProfileService, profileService } from './ProfileService';
export * from './types';
```

#### 5. Update root services/index.ts

```typescript
// backend/src/services/index.ts
export * from './auth';
export * from './courses';
export * from './assignments';
export * from './messaging';
export * from './schedule';
export * from './parent';
```

#### 6. Update routes to use new structure

```typescript
// Before
import { authService } from '@/services/AuthService';

// After
import { authService, profileService } from '@/services/auth';
```

#### 7. Test with:
```bash
npm run typecheck
npm run build
npm run dev
```

---

## Dependency Graph

```
Routes
  ↓
Services (CRITICAL - Phase 1)
  ↓
Schemas (HIGH - Phase 2)
  ↓
Repositories (MEDIUM - Phase 4)
  ↓
Tests (MEDIUM - Phase 3)
```

**Blocking Dependencies:**
- Phase 1 blocks: Everything else
- Phase 2 blocks: Production ready
- Phase 3 blocks: High confidence
- Phase 4 blocks: Advanced features

---

## File Checklist for Phase 1

### To Create (13 files)
- [ ] `services/auth/index.ts`
- [ ] `services/auth/ProfileService.ts`
- [ ] `services/courses/index.ts`
- [ ] `services/courses/EnrollmentService.ts`
- [ ] `services/courses/LessonService.ts`
- [ ] `services/assignments/index.ts`
- [ ] `services/assignments/SubmissionService.ts`
- [ ] `services/assignments/GradingService.ts`
- [ ] `services/messaging/index.ts`
- [ ] `services/messaging/MessageService.ts`
- [ ] `services/schedule/index.ts`
- [ ] `services/schedule/ScheduleService.ts`
- [ ] `services/parent/index.ts`
- [ ] `services/parent/ParentService.ts`

### To Move (3 files)
- [ ] AuthService.ts → services/auth/AuthService.ts
- [ ] CourseService.ts → services/courses/CourseService.ts
- [ ] AssignmentService.ts → services/assignments/AssignmentService.ts

### To Update (1 file)
- [ ] `services/index.ts` - Update imports

### To Delete (3 files - after tests pass)
- [ ] Delete old `services/AuthService.ts`
- [ ] Delete old `services/CourseService.ts`
- [ ] Delete old `services/AssignmentService.ts`

---

## Success Criteria

### Phase 1 Success ✅
- [ ] All services organized into feature folders
- [ ] TypeScript compiles without errors: `npm run typecheck`
- [ ] Build succeeds: `npm run build`
- [ ] Services can be imported from feature folders: `import { courseService } from '@/services/courses'`
- [ ] All existing tests still pass

### Phase 2 Success ✅
- [ ] All schemas created and tested
- [ ] Routes validate input before calling services
- [ ] Invalid input returns 400 with clear error message
- [ ] API spec updated in Swagger

### Overall Backend Readiness
- ✅ Database: Connected & Configured
- 🔲 Services: Organized (Phase 1)
- 🔲 Validation: Implemented (Phase 2)
- 🔲 Tests: Added (Phase 3)
- 🔲 Repositories: Abstracted (Phase 4)
- 🔲 Logging: Configured (Phase 5)

---

## Time Estimates

| Phase | Tasks | Effort | Priority |
|-------|-------|--------|----------|
| 1 | Services Organization | 3-4 hrs | 🔴 CRITICAL |
| 2 | Validation Schemas | 2-3 hrs | 🟠 HIGH |
| 3 | Tests | 4-6 hrs | 🟡 MEDIUM |
| 4 | Repositories | 4-5 hrs | 🔵 MEDIUM-LOW |
| 5 | Logging | 2-3 hrs | 🟢 LOW |
| **Total** | **All phases** | **15-21 hrs** | - |

**MVP (Phase 1+2):** 5-7 hours
**Production Ready (Phase 1-3):** 9-13 hours
**Fully Optimized (All):** 15-21 hours

---

## Next Command

When ready to start Phase 1:
```bash
cd backend
npm run typecheck  # Verify current state
# Start creating auth/ folder and services
```

