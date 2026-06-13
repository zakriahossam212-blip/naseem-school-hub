# Database Configuration Guide

## Overview

This project uses **Supabase PostgreSQL** for the backend and **Prisma ORM** for database management.

### Your Supabase Project Details
- **URL**: https://hivftccjveppcexwaihv.supabase.co
- **Publishable Key**: sb_publishable_AmI9hPOfB1DwoscE-t0Qdw_leoxkUIb
- **Database**: PostgreSQL (hosted on Supabase)

---

## Quick Start

### 1. Set Database Password

Get your PostgreSQL password:
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database** → **Database Settings**
4. View or reset your password

### 2. Update Backend .env

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.hivftccjveppcexwaihv.supabase.co:5432/postgres
```

Replace `[PASSWORD]` with your actual password.

### 3. Initialize Database

```bash
cd backend
npm install  # if not done yet

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate
```

When prompted for migration name, enter: `init`

### 4. Verify Setup

```bash
npm run prisma:studio
```

Opens a UI to view and manage your database.

---

## Database Schema

### Core Tables

**Profile** (User Data)
```sql
- userId (STRING) - Primary key, linked to Clerk
- fullName (STRING)
- avatarUrl (STRING)
- role (ENUM: STUDENT, TEACHER, PARENT, ADMIN)
- createdAt, updatedAt (DATETIME)
```

**Course** (Courses)
```sql
- id (STRING) - Primary key
- title (STRING)
- description (STRING)
- teacherId (STRING) - Foreign key to Profile
- createdAt, updatedAt (DATETIME)
```

**Enrollment** (Student Course Enrollments)
```sql
- id (STRING) - Primary key
- studentId (STRING) - Foreign key to Profile
- courseId (STRING) - Foreign key to Course
- enrolledAt (DATETIME)
- UNIQUE(studentId, courseId)
```

**Assignment** (Course Assignments)
```sql
- id (STRING) - Primary key
- courseId (STRING) - Foreign key to Course
- title (STRING)
- description (STRING)
- dueDate (DATETIME)
- maxGrade (INT) - Default: 100
- attachmentUrl (STRING)
- createdBy (STRING) - Foreign key to Profile
- createdAt, updatedAt (DATETIME)
```

**Submission** (Assignment Submissions & Grades)
```sql
- id (STRING) - Primary key
- assignmentId (STRING) - Foreign key to Assignment
- studentId (STRING) - Foreign key to Profile
- content (STRING) - Student's answer
- fileUrl (STRING) - Uploaded file URL
- grade (INT) - NULL if not graded
- feedback (STRING)
- status (STRING: SUBMITTED, GRADED, LATE)
- gradedBy (STRING) - Foreign key to Profile (teacher)
- submittedAt (DATETIME)
- gradedAt (DATETIME)
- UNIQUE(assignmentId, studentId)
```

**Lesson** (Course Lessons)
```sql
- id (STRING) - Primary key
- courseId (STRING) - Foreign key to Course
- title (STRING)
- content (STRING) - Markdown/HTML content
- videoUrl (STRING)
- orderIndex (INT)
- createdBy (STRING) - Foreign key to Profile
- UNIQUE(courseId, orderIndex)
```

**ScheduleEntry** (Class Schedule & Events)
```sql
- id (STRING) - Primary key
- title (STRING)
- type (STRING: LESSON, EXAM, EVENT)
- courseId (STRING) - Foreign key to Course (optional)
- dayOfWeek (STRING: MON, TUE, etc)
- startTime (STRING: HH:MM)
- endTime (STRING: HH:MM)
- specificDate (DATETIME) - For one-time events
- location (STRING)
- createdBy (STRING) - Foreign key to Profile
```

**Message** (User Messaging)
```sql
- id (STRING) - Primary key
- fromUserId (STRING) - Foreign key to Profile
- toUserId (STRING) - Foreign key to Profile
- subject (STRING)
- body (STRING)
- isRead (BOOLEAN)
- createdAt (DATETIME)
```

**ParentLink** (Parent-Student Relationship)
```sql
- id (STRING) - Primary key
- parentId (STRING) - Foreign key to Profile
- studentId (STRING) - Foreign key to Profile
- createdAt (DATETIME)
- UNIQUE(parentId, studentId)
```

**FileRecord** (File Storage Tracking)
```sql
- id (STRING) - Primary key
- objectPath (STRING) - Cloud storage path
- ownerUserId (STRING) - Foreign key to Profile
- fileName (STRING)
- mimeType (STRING)
- size (INT)
- uploadedAt (DATETIME)
```

**AuditLog** (Change Tracking)
```sql
- id (STRING) - Primary key
- action (STRING: CREATE, UPDATE, DELETE)
- entityType (STRING: Course, Assignment, etc)
- entityId (STRING)
- userId (STRING)
- changes (JSON) - Before/after values
- createdAt (DATETIME)
```

---

## Common Database Operations

### Create Profile (on first login)
```typescript
const profile = await prisma.profile.create({
  data: {
    userId: clerkUserId,
    fullName: "John Doe",
    role: "STUDENT"
  }
});
```

### Create Course
```typescript
const course = await prisma.course.create({
  data: {
    title: "Mathematics 101",
    description: "Intro to Calculus",
    teacherId: teacherClerkId
  }
});
```

### Enroll Student in Course
```typescript
const enrollment = await prisma.enrollment.create({
  data: {
    studentId: studentClerkId,
    courseId: courseId
  }
});
```

### Create Assignment
```typescript
const assignment = await prisma.assignment.create({
  data: {
    courseId: courseId,
    title: "Chapter 1 Exercises",
    description: "Complete exercises 1-10",
    dueDate: new Date("2026-02-15"),
    maxGrade: 100,
    createdBy: teacherClerkId
  }
});
```

### Submit Assignment
```typescript
const submission = await prisma.submission.create({
  data: {
    assignmentId: assignmentId,
    studentId: studentClerkId,
    content: "Student's answer here",
    status: "SUBMITTED"
  }
});
```

### Grade Submission
```typescript
const gradedSubmission = await prisma.submission.update({
  where: { id: submissionId },
  data: {
    grade: 85,
    feedback: "Great work! Watch out for step 3.",
    status: "GRADED",
    gradedBy: teacherClerkId,
    gradedAt: new Date()
  }
});
```

### Get Student's Courses
```typescript
const enrollments = await prisma.enrollment.findMany({
  where: { studentId: studentClerkId },
  include: { course: true }
});
```

### Get Course Submissions
```typescript
const submissions = await prisma.submission.findMany({
  where: { assignment: { courseId: courseId } },
  include: { student: true, assignment: true }
});
```

---

## Maintenance Tasks

### Backup Your Database
Supabase automatically backs up data. To manually export:
1. Go to Supabase Dashboard
2. Click **Settings** → **Database** → **Backups**
3. Choose export format (SQL, CSV, etc)

### Check Database Size
```bash
# Via Supabase Dashboard → Settings → Database
# Or via psql:
SELECT pg_size_pretty(pg_database_size('postgres'));
```

### View Active Connections
```bash
# Via Supabase Dashboard → Settings → Database Connections
```

### Reset Database
⚠️ **WARNING: This deletes all data**
```bash
# Via Supabase Dashboard → Settings → Reset Database
```

---

## Troubleshooting

### "Cannot connect to database"
1. Verify `DATABASE_URL` in `.env`
2. Check if Supabase project is active
3. Ensure password is correct (reset if needed)
4. Check firewall/network access

### "Prisma error: Column does not exist"
```bash
# Regenerate Prisma client
npm run prisma:generate
```

### "Migration fails"
```bash
# Check what migrations are pending
npm run prisma:migrate status

# Reset migrations (⚠️ deletes all data locally)
npm run prisma:migrate reset
```

### "Type errors in IDE"
```bash
npm run prisma:generate
npm run typecheck
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@db.hivftccjveppcexwaihv.supabase.co:5432/postgres` |
| `CLERK_SECRET_KEY` | Clerk API secret | `sk_live_...` |
| `NODE_ENV` | Environment | `development` \| `production` |
| `PORT` | Server port | `3000` |
| `API_BASE_URL` | Backend URL | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

---

## Security Best Practices

✅ **Enable Row-Level Security (RLS)**
```sql
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Submission" ENABLE ROW LEVEL SECURITY;
```

✅ **Limit Database Connection Pool**
- Default: 10 connections
- Production: Set based on your load

✅ **Use Strong Passwords**
- Change default Supabase password
- Store in secure password manager

✅ **Monitor Access**
- Check Supabase logs for unauthorized attempts
- Set up alerts for unusual activity

✅ **Backup Strategy**
- Supabase auto-backups: Enabled
- Manual exports: Weekly
- Point-in-time recovery: Available

---

## Performance Tips

1. **Add Indexes** (already defined in schema)
   - Profile: role, createdAt
   - Course: teacherId, createdAt
   - Enrollment: courseId
   - Assignment: courseId, dueDate
   - Submission: assignmentId, studentId

2. **Pagination**
   ```typescript
   const courses = await prisma.course.findMany({
     skip: (page - 1) * 10,
     take: 10,
     orderBy: { createdAt: 'desc' }
   });
   ```

3. **Eager Loading**
   ```typescript
   const course = await prisma.course.findUnique({
     where: { id: courseId },
     include: {
       teacher: true,
       assignments: true,
       enrollments: true
     }
   });
   ```

4. **Avoid N+1 Queries**
   - Always use `include` or `select`
   - Use `groupBy` for aggregations

---

## Next Steps

1. ✅ Configure DATABASE_URL with your password
2. ✅ Run `npm run prisma:migrate`
3. ✅ Test with `npm run prisma:studio`
4. ✅ Start backend: `npm run dev`
5. ✅ Implement Clerk webhooks for user sync
6. ✅ Add Row-Level Security policies (optional but recommended)

