import { Shield } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/contexts/LanguageContext";
import { PRIVACY_POLICY } from "@/data";
import { AppCard } from "@/components/common/AppCard";

const Privacy = () => {
  const { lang } = useLang();
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
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "ar"
                ? `آخر تحديث: ${PRIVACY_POLICY.lastUpdatedAr}`
                : `Last updated: ${PRIVACY_POLICY.lastUpdated}`}
            </p>
          </div>

          {/* Privacy Content */}
          <AppCard>
            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.intro.titleAr : PRIVACY_POLICY.intro.titleEn}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "ar" ? PRIVACY_POLICY.intro.descAr : PRIVACY_POLICY.intro.descEn}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.dataCollection.titleAr : PRIVACY_POLICY.dataCollection.titleEn}
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  {(lang === "ar" ? PRIVACY_POLICY.dataCollection.itemsAr : PRIVACY_POLICY.dataCollection.itemsEn).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.dataUsage.titleAr : PRIVACY_POLICY.dataUsage.titleEn}
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  {(lang === "ar" ? PRIVACY_POLICY.dataUsage.itemsAr : PRIVACY_POLICY.dataUsage.itemsEn).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.dataProtection.titleAr : PRIVACY_POLICY.dataProtection.titleEn}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "ar" ? PRIVACY_POLICY.dataProtection.descAr : PRIVACY_POLICY.dataProtection.descEn}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.dataSharingShare.titleAr : PRIVACY_POLICY.dataSharingShare.titleEn}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "ar" ? PRIVACY_POLICY.dataSharingShare.descAr : PRIVACY_POLICY.dataSharingShare.descEn}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.userRights.titleAr : PRIVACY_POLICY.userRights.titleEn}
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  {(lang === "ar" ? PRIVACY_POLICY.userRights.itemsAr : PRIVACY_POLICY.userRights.itemsEn).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.cookies.titleAr : PRIVACY_POLICY.cookies.titleEn}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "ar" ? PRIVACY_POLICY.cookies.descAr : PRIVACY_POLICY.cookies.descEn}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {lang === "ar" ? PRIVACY_POLICY.contact.titleAr : PRIVACY_POLICY.contact.titleEn}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "ar" ? PRIVACY_POLICY.contact.descAr : PRIVACY_POLICY.contact.descEn}
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
