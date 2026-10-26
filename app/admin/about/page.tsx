import { getAboutSettings } from "@/lib/about";
import AboutSettingsForm from "@/components/admin/AboutSettingsForm";

export const metadata = {
  title: "About Page Content | Payana Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAboutSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-rust text-xs uppercase tracking-widest font-semibold">Content Management</span>
          <span className="bg-navy/5 text-navy text-[10px] font-mono px-2 py-0.5 rounded-pill border border-navy/10">
            Public Page: /about
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy">About Page Story & Narrative</h1>
        <p className="text-sm text-muted mt-1">
          Customize the brand narrative, core philosophy paragraphs, and custom planning invitation shown on the public About page.
        </p>
      </div>

      <AboutSettingsForm initial={about} />
    </div>
  );
}
