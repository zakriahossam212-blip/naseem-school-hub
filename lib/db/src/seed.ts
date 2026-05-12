import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const TEACHER_1 = "seed_teacher_ahmed_kamal";
const TEACHER_2 = "seed_teacher_fatima_nour";
const TEACHER_3 = "seed_teacher_omar_hassan";
const STUDENT_1 = "seed_student_youssef_ali";
const STUDENT_2 = "seed_student_nadia_samir";
const STUDENT_3 = "seed_student_kareem_fahmy";
const PARENT_1 = "seed_parent_ali_youssef";
const SYSTEM = "seed_system";

async function seed() {
  console.log("🌱 Seeding database...");

  console.log("  Creating profiles...");
  await db.insert(schema.profilesTable).values([
    { userId: TEACHER_1, fullName: "أ. أحمد كمال", avatarUrl: null },
    { userId: TEACHER_2, fullName: "أ. فاطمة نور", avatarUrl: null },
    { userId: TEACHER_3, fullName: "أ. عمر حسن", avatarUrl: null },
    { userId: STUDENT_1, fullName: "يوسف علي", avatarUrl: null },
    { userId: STUDENT_2, fullName: "نادية سمير", avatarUrl: null },
    { userId: STUDENT_3, fullName: "كريم فهمي", avatarUrl: null },
    { userId: PARENT_1, fullName: "علي يوسف", avatarUrl: null },
  ]).onConflictDoNothing();

  console.log("  Assigning roles...");
  await db.insert(schema.userRolesTable).values([
    { userId: TEACHER_1, role: "teacher" },
    { userId: TEACHER_2, role: "teacher" },
    { userId: TEACHER_3, role: "teacher" },
    { userId: STUDENT_1, role: "student" },
    { userId: STUDENT_2, role: "student" },
    { userId: STUDENT_3, role: "student" },
    { userId: PARENT_1, role: "parent" },
  ]).onConflictDoNothing();

  console.log("  Creating courses...");
  const [math, arabic, science, english, history, geography] = await db
    .insert(schema.coursesTable)
    .values([
      { title: "الرياضيات", description: "أساسيات الرياضيات والجبر والهندسة للمراحل المختلفة. يتناول المقرر الأعداد والعمليات الحسابية والجبر والهندسة الفراغية.", teacherId: TEACHER_1 },
      { title: "اللغة العربية", description: "قواعد اللغة العربية والنحو والصرف والأدب. يشمل المقرر الإملاء والتعبير الكتابي والقراءة والفهم والنصوص الأدبية.", teacherId: TEACHER_2 },
      { title: "العلوم", description: "الفيزياء والكيمياء والأحياء بأسلوب تفاعلي وممتع. يتضمن تجارب عملية وأنشطة علمية تثري الفهم.", teacherId: TEACHER_3 },
      { title: "اللغة الإنجليزية", description: "تعلم اللغة الإنجليزية من المستوى المبتدئ إلى المتقدم. يركز على مهارات الاستماع والتحدث والقراءة والكتابة.", teacherId: TEACHER_1 },
      { title: "التاريخ", description: "دراسة التاريخ العربي والإسلامي والحضارات القديمة. يستعرض المقرر أبرز الأحداث التاريخية وتأثيرها على الحاضر.", teacherId: TEACHER_2 },
      { title: "الجغرافيا", description: "استكشاف العالم من خلال دراسة الجغرافيا الطبيعية والبشرية. يتناول خرائط العالم والظواهر الطبيعية والتضاريس.", teacherId: TEACHER_3 },
    ])
    .returning();

  console.log("  Enrolling students...");
  await db.insert(schema.courseEnrollmentsTable).values([
    { courseId: math.id, studentId: STUDENT_1 },
    { courseId: math.id, studentId: STUDENT_2 },
    { courseId: arabic.id, studentId: STUDENT_1 },
    { courseId: arabic.id, studentId: STUDENT_3 },
    { courseId: science.id, studentId: STUDENT_2 },
    { courseId: science.id, studentId: STUDENT_3 },
    { courseId: english.id, studentId: STUDENT_1 },
    { courseId: english.id, studentId: STUDENT_2 },
    { courseId: english.id, studentId: STUDENT_3 },
  ]).onConflictDoNothing();

  console.log("  Creating lessons...");
  await db.insert(schema.lessonsTable).values([
    { courseId: math.id, title: "الأعداد الطبيعية والعمليات الأساسية", content: "نتعلم الأعداد الطبيعية وعمليات الجمع والطرح والضرب والقسمة مع أمثلة تطبيقية.", orderIndex: 1, createdBy: TEACHER_1 },
    { courseId: math.id, title: "الكسور والأعداد العشرية", content: "دراسة الكسور الاعتيادية والعشرية والعمليات عليها وتحويلها وترتيبها على خط الأعداد.", orderIndex: 2, createdBy: TEACHER_1 },
    { courseId: math.id, title: "الجبر: المعادلات من الدرجة الأولى", content: "مفهوم المتغير والمعادلة وطرق حل المعادلات من الدرجة الأولى بمجهول واحد.", orderIndex: 3, createdBy: TEACHER_1 },
    { courseId: math.id, title: "الهندسة: المثلثات وخواصها", content: "أنواع المثلثات وخواصها ومحيطها ومساحتها ومبرهنة فيثاغورس وتطبيقاتها.", orderIndex: 4, createdBy: TEACHER_1 },
    { courseId: arabic.id, title: "النحو: الجملة الاسمية والفعلية", content: "تعريف الجملة الاسمية والفعلية وأركانهما وعلامات الإعراب الأصلية والفرعية.", orderIndex: 1, createdBy: TEACHER_2 },
    { courseId: arabic.id, title: "الصرف: الفعل المجرد والمزيد", content: "أوزان الفعل المجرد الثلاثي والرباعي وأوزان المزيد ومعانيها.", orderIndex: 2, createdBy: TEACHER_2 },
    { courseId: arabic.id, title: "التعبير الكتابي: كيفية كتابة الفقرة", content: "مكونات الفقرة المتماسكة والجملة الرئيسية والجمل الداعمة والخاتمة.", orderIndex: 3, createdBy: TEACHER_2 },
    { courseId: arabic.id, title: "الأدب: الشعر الجاهلي", content: "خصائص الشعر الجاهلي وأغراضه وأبرز شعرائه مع نماذج مختارة وتحليل.", orderIndex: 4, createdBy: TEACHER_2 },
    { courseId: science.id, title: "الفيزياء: القوة والحركة", content: "مفهوم القوة وأنواعها وقوانين نيوتن للحركة وتطبيقاتها في الحياة اليومية.", orderIndex: 1, createdBy: TEACHER_3 },
    { courseId: science.id, title: "الكيمياء: الذرة والعناصر", content: "مكونات الذرة من بروتونات ونيوترونات وإلكترونات والجدول الدوري للعناصر.", orderIndex: 2, createdBy: TEACHER_3 },
    { courseId: science.id, title: "الأحياء: خلية الكائنات الحية", content: "مكونات الخلية الحيوانية والنباتية ووظائفها وكيفية انقسامها.", orderIndex: 3, createdBy: TEACHER_3 },
    { courseId: science.id, title: "الطاقة ومصادرها", content: "أشكال الطاقة المختلفة والطاقة المتجددة وغير المتجددة وأهمية الحفاظ على الطاقة.", orderIndex: 4, createdBy: TEACHER_3 },
    { courseId: english.id, title: "Unit 1: Greetings & Introductions", content: "Learn how to greet people and introduce yourself in formal and informal situations.", orderIndex: 1, createdBy: TEACHER_1 },
    { courseId: english.id, title: "Unit 2: Present Tense", content: "Simple present and present continuous tenses with practical exercises.", orderIndex: 2, createdBy: TEACHER_1 },
    { courseId: english.id, title: "Unit 3: Reading Comprehension", content: "Strategies for understanding and analyzing English texts with vocabulary building.", orderIndex: 3, createdBy: TEACHER_1 },
    { courseId: history.id, title: "الحضارة الفرعونية", content: "نشأة الحضارة المصرية القديمة وأبرز فراعنتها ومعالمها الحضارية.", orderIndex: 1, createdBy: TEACHER_2 },
    { courseId: history.id, title: "الفتح الإسلامي لمصر", content: "أحداث الفتح الإسلامي لمصر على يد عمرو بن العاص وأثره على المنطقة.", orderIndex: 2, createdBy: TEACHER_2 },
    { courseId: history.id, title: "الدولة العثمانية", content: "نشأة الدولة العثمانية وتوسعها وعلاقتها بالبلاد العربية.", orderIndex: 3, createdBy: TEACHER_2 },
    { courseId: geography.id, title: "خرائط العالم وإسقاطاتها", content: "أنواع الخرائط الجغرافية وكيفية قراءتها وإسقاطاتها المختلفة.", orderIndex: 1, createdBy: TEACHER_3 },
    { courseId: geography.id, title: "التضاريس الطبيعية", content: "الجبال والسهول والهضاب والأودية وتأثيرها على حياة الإنسان.", orderIndex: 2, createdBy: TEACHER_3 },
    { courseId: geography.id, title: "المناخ والمناطق المناخية", content: "أنواع المناخات في العالم والعوامل المؤثرة فيها والتغيرات المناخية.", orderIndex: 3, createdBy: TEACHER_3 },
  ]);

  console.log("  Creating assignments...");
  const due1 = new Date(); due1.setDate(due1.getDate() + 7);
  const due2 = new Date(); due2.setDate(due2.getDate() + 14);
  const due3 = new Date(); due3.setDate(due3.getDate() + 21);

  const assignments = await db.insert(schema.assignmentsTable).values([
    { courseId: math.id, title: "واجب: حل تمارين الجبر", description: "حل التمارين من 1 إلى 20 في الكتاب المدرسي صفحة 45، مع شرح خطوات الحل.", dueDate: due1, maxGrade: 20, createdBy: TEACHER_1 },
    { courseId: math.id, title: "اختبار قصير: الهندسة", description: "اختبار يشمل مسائل الهندسة والمثلثات ومبرهنة فيثاغورس.", dueDate: due2, maxGrade: 15, createdBy: TEACHER_1 },
    { courseId: arabic.id, title: "تعبير كتابي: يوم لا أنساه", description: "اكتب موضوع تعبير من 200 إلى 250 كلمة عن يوم لا تنساه في حياتك.", dueDate: due1, maxGrade: 25, createdBy: TEACHER_2 },
    { courseId: science.id, title: "تقرير: مصادر الطاقة المتجددة", description: "اكتب تقريراً علمياً عن أهم مصادر الطاقة المتجددة وكيفية الاستفادة منها.", dueDate: due2, maxGrade: 30, createdBy: TEACHER_3 },
    { courseId: english.id, title: "Essay: My Favourite Hobby", description: "Write a short essay (150-200 words) about your favourite hobby using present tense.", dueDate: due3, maxGrade: 20, createdBy: TEACHER_1 },
    { courseId: history.id, title: "بحث: إنجازات الحضارة الفرعونية", description: "اعمل بحثاً عن أبرز إنجازات الفراعنة في الطب والهندسة والفن.", dueDate: due2, maxGrade: 20, createdBy: TEACHER_2 },
    { courseId: geography.id, title: "رسم خريطة: دول القارة الأفريقية", description: "ارسم خريطة للقارة الأفريقية مع تسمية أكبر 10 دول وعواصمها.", dueDate: due3, maxGrade: 15, createdBy: TEACHER_3 },
  ]).returning();

  const [mathAss1, , arabicAss1, sciAss1, engAss1] = assignments;

  console.log("  Creating submissions...");
  await db.insert(schema.submissionsTable).values([
    { assignmentId: mathAss1.id, studentId: STUDENT_1, content: "حللت جميع التمارين المطلوبة. الحل موجود بالتفصيل.", status: "graded", grade: 18, feedback: "عمل ممتاز! الحلول صحيحة ومنظمة. احرص على كتابة الخطوات بوضوح أكبر." },
    { assignmentId: mathAss1.id, studentId: STUDENT_2, content: "تم حل التمارين مع توضيح كل خطوة.", status: "graded", grade: 16, feedback: "جيد جداً. بعض الأخطاء في المسألة 12 و15، راجعها." },
    { assignmentId: arabicAss1.id, studentId: STUDENT_1, content: "يوم التخرج من المرحلة الابتدائية كان من أجمل أيام حياتي...", status: "submitted" },
    { assignmentId: arabicAss1.id, studentId: STUDENT_3, content: "في يوم عيد ميلادي جاءت المفاجأة الكبيرة...", status: "graded", grade: 22, feedback: "أسلوب رائع وأفكار مترابطة. زد من استخدام الأساليب البلاغية." },
    { assignmentId: engAss1.id, studentId: STUDENT_1, content: "My favourite hobby is reading books. I spend at least one hour every day reading...", status: "submitted" },
    { assignmentId: sciAss1.id, studentId: STUDENT_2, content: "مصادر الطاقة المتجددة تشمل الطاقة الشمسية وطاقة الرياح والطاقة الكهرومائية...", status: "graded", grade: 27, feedback: "تقرير شامل ومنظم. أضف المراجع في المرة القادمة." },
  ]);

  console.log("  Creating schedule entries...");
  await db.insert(schema.scheduleEntriesTable).values([
    { title: "رياضيات", type: "lesson", courseId: math.id, dayOfWeek: "sunday", startTime: "08:00", endTime: "09:00", location: "قاعة 101", createdBy: SYSTEM },
    { title: "لغة عربية", type: "lesson", courseId: arabic.id, dayOfWeek: "sunday", startTime: "09:15", endTime: "10:15", location: "قاعة 102", createdBy: SYSTEM },
    { title: "علوم", type: "lesson", courseId: science.id, dayOfWeek: "sunday", startTime: "10:30", endTime: "11:30", location: "معمل العلوم", createdBy: SYSTEM },
    { title: "رياضيات", type: "lesson", courseId: math.id, dayOfWeek: "monday", startTime: "08:00", endTime: "09:00", location: "قاعة 101", createdBy: SYSTEM },
    { title: "لغة إنجليزية", type: "lesson", courseId: english.id, dayOfWeek: "monday", startTime: "09:15", endTime: "10:15", location: "قاعة 103", createdBy: SYSTEM },
    { title: "تاريخ", type: "lesson", courseId: history.id, dayOfWeek: "monday", startTime: "10:30", endTime: "11:30", location: "قاعة 104", createdBy: SYSTEM },
    { title: "جغرافيا", type: "lesson", courseId: geography.id, dayOfWeek: "tuesday", startTime: "08:00", endTime: "09:00", location: "قاعة 105", createdBy: SYSTEM },
    { title: "علوم", type: "lesson", courseId: science.id, dayOfWeek: "tuesday", startTime: "09:15", endTime: "10:15", location: "معمل العلوم", createdBy: SYSTEM },
    { title: "لغة عربية", type: "lesson", courseId: arabic.id, dayOfWeek: "tuesday", startTime: "10:30", endTime: "11:30", location: "قاعة 102", createdBy: SYSTEM },
    { title: "اختبار الرياضيات الشهري", type: "exam", courseId: math.id, dayOfWeek: "wednesday", startTime: "08:00", endTime: "10:00", location: "قاعة الامتحانات", createdBy: SYSTEM },
    { title: "لغة إنجليزية", type: "lesson", courseId: english.id, dayOfWeek: "wednesday", startTime: "10:30", endTime: "11:30", location: "قاعة 103", createdBy: SYSTEM },
    { title: "رياضيات", type: "lesson", courseId: math.id, dayOfWeek: "thursday", startTime: "08:00", endTime: "09:00", location: "قاعة 101", createdBy: SYSTEM },
    { title: "تاريخ", type: "lesson", courseId: history.id, dayOfWeek: "thursday", startTime: "09:15", endTime: "10:15", location: "قاعة 104", createdBy: SYSTEM },
    { title: "يوم النشاط المدرسي", type: "event", dayOfWeek: "friday", startTime: "09:00", endTime: "12:00", location: "الملعب الكبير", notes: "يوم رياضي وترفيهي لجميع الطلاب.", createdBy: SYSTEM },
  ]);

  console.log("  Linking parents...");
  await db.insert(schema.parentStudentLinksTable).values([
    { parentId: PARENT_1, studentId: STUDENT_1 },
  ]).onConflictDoNothing();

  console.log("✅ Seed complete!");
  await pool.end();
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  pool.end().finally(() => process.exit(1));
});
