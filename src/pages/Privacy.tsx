import { Shield } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { AppCard } from "@/components/common/AppCard";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">سياسة الخصوصية</h1>
            <p className="text-muted-foreground">
              آخر تحديث: يناير 2026
            </p>
          </div>

          {/* Privacy Content */}
          <AppCard>
            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">مقدمة</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحن في مدرسة نصر الدين نلتزم بحماية خصوصية مستخدمينا. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عند استخدام منصتنا التعليمية.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">المعلومات التي نجمعها</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>معلومات التسجيل: الاسم، البريد الإلكتروني، رقم الهاتف</li>
                  <li>معلومات الملف الشخصي: الصورة الشخصية، المستوى الدراسي</li>
                  <li>بيانات الاستخدام: سجل الدخول، المقررات المسجلة، التقدم الدراسي</li>
                  <li>معلومات تقنية: نوع المتصفح، عنوان IP، نوع الجهاز</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">كيف نستخدم معلوماتك</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>تقديم الخدمات التعليمية وتخصيص تجربة التعلم</li>
                  <li>التواصل معك بشأن حسابك والتحديثات</li>
                  <li>تحسين خدماتنا ومنصتنا التعليمية</li>
                  <li>ضمان أمن الحسابات ومنع الاحتيال</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">حماية البيانات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم إجراءات أمنية متقدمة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء. تشمل هذه الإجراءات التشفير وجدران الحماية وإجراءات التحكم في الوصول.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">مشاركة المعلومات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات فقط مع مقدمي الخدمات الموثوقين الذين يساعدوننا في تشغيل منصتنا، وذلك وفقاً لاتفاقيات سرية صارمة.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">حقوقك</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>الوصول إلى بياناتك الشخصية وتحديثها</li>
                  <li>طلب حذف حسابك وبياناتك</li>
                  <li>الانسحاب من الرسائل التسويقية</li>
                  <li>طلب نسخة من بياناتك</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">ملفات تعريف الارتباط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك على منصتنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">تواصل معنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@nasreldin-school.com
                </p>
              </section>
            </div>
          </AppCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
