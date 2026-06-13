# Supabase Integration Guide

This document describes how to set up and integrate the Naseem School Hub with Supabase PostgreSQL.

## Your Supabase Project

- **Project URL**: https://hivftccjveppcexwaihv.supabase.co
- **Publishable Key**: sb_publishable_AmI9hPOfB1DwoscE-t0Qdw_leoxkUIb

## Database Connection Setup

### 1. Get Your Database Password

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project **naseem-school-hub**
3. Navigate to **Settings** > **Database** > **Connection String**
4. Copy the PostgreSQL connection string or use the one below with your password

### 2. Connection String Format

```
postgresql://postgres:[YOUR_PASSWORD]@db.hivftccjveppcexwaihv.supabase.co:5432/postgres
```

Replace `[YOUR_PASSWORD]` with your database password from Supabase dashboard.

### 3. Update `.env` File

Edit `backend/.env` and update the `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.hivftccjveppcexwaihv.supabase.co:5432/postgres
```

## Database Schema Setup

### 1. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 2. Run Initial Migration

This creates all tables defined in `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

When prompted, give the migration a name like: `init`

### 3. Verify Setup

View your database schema in Prisma Studio:

```bash
npm run prisma:studio
```

This opens an interactive UI where you can view and edit data.

## Supabase Features Available

### Authentication (Clerk Integration)
- Your app uses Clerk for authentication
- Clerk manages user authentication, Supabase stores user data (Profile model)

### Database Features
✅ **Built-in with Supabase PostgreSQL:**
- Full PostgreSQL support with 50GB+ storage
- Automatic backups
- Point-in-time recovery
- Real-time database changes via WebSockets
- Row-level security (RLS)

### Security & RLS (Row-Level Security)

Consider enabling RLS on critical tables:

```sql
-- Enable RLS
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Submission" ENABLE ROW LEVEL SECURITY;
```

**Example RLS Policy (for Profile table):**
```sql
CREATE POLICY "Users can view own profile"
ON "Profile" FOR SELECT
USING (auth.uid()::text = "userId");
```

## Models in Database

### User Management
- **Profile** - User data (connected to Clerk userId)
- **ParentLink** - Parent-student relationships

### Course Management
- **Course** - Course information (teacher-owned)
- **Enrollment** - Student course enrollments
- **Lesson** - Lessons within courses
- **ScheduleEntry** - Class schedule & events

### Assignments & Grading
- **Assignment** - Course assignments
- **Submission** - Student assignment submissions with grades
- **AuditLog** - Track all changes

### Communication
- **Message** - User-to-user messaging

### Files
- **FileRecord** - File upload tracking (for future cloud storage integration)

## Common Tasks

### Add a New Course
```typescript
const course = await prisma.course.create({
  data: {
    title: "Mathematics 101",
    description: "Introduction to Calculus",
    teacherId: "clerk_user_id"
  }
});
```

### Enroll a Student
```typescript
const enrollment = await prisma.enrollment.create({
  data: {
    studentId: "clerk_user_id",
    courseId: "course_id"
  }
});
```

### Submit an Assignment
```typescript
const submission = await prisma.submission.create({
  data: {
    assignmentId: "assignment_id",
    studentId: "clerk_user_id",
    content: "Student's answer",
    status: "SUBMITTED"
  }
});
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:...@db.hivftccjveppcexwaihv.supabase.co:5432/postgres` |
| `CLERK_SECRET_KEY` | Clerk API key | `sk_live_...` |
| `NODE_ENV` | Environment | `development` \| `production` |
| `PORT` | Backend port | `3000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Troubleshooting

### "Can't reach database"
- Verify `DATABASE_URL` is correct
- Check if Supabase project is active
- Ensure PostgreSQL connection string format is correct

### "Prisma migrations fail"
```bash
# Check migration status
npm run prisma:migrate status

# View what would be migrated
npm run prisma:migrate plan
```

### "Type errors in code"
```bash
# Regenerate Prisma client
npm run prisma:generate

# Check all types
npm run typecheck
```

## Deployment to Production

### 1. Create Production Database
- Create a new Supabase project for production (or use separate database)

### 2. Update Production `.env`
```env
DATABASE_URL=postgresql://postgres:[PROD_PASSWORD]@db.prod-supabase.supabase.co:5432/postgres
NODE_ENV=production
```

### 3. Run Migrations
```bash
npm run prisma:migrate deploy
```

### 4. Deploy Backend
Deploy to Vercel, Railway, or your hosting provider

## Next Steps

1. ✅ Add your database password to `backend/.env`
2. ✅ Run `npm run prisma:migrate` to create tables
3. ✅ Start the backend: `npm run dev`
4. ✅ Test API endpoints
5. ✅ Configure Clerk webhooks for user sync

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Clerk Documentation](https://clerk.com/docs)

