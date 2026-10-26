import { getHeroSettings } from "@/lib/packages";
import HeroSettingsForm from "@/components/admin/HeroSettingsForm";

export const metadata = {
  title: "Hero & Video Settings | Payana Admin",
};

export default async function AdminHeroPage() {
  const hero = await getHeroSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy">Home Hero & Video Settings</h1>
        <p className="text-sm text-muted mt-1">Configure the main video background loop, headings, and fallback image for your home page.</p>
      </div>

      <HeroSettingsForm initial={hero} />
    </div>
  );
}
