import "server-only";
import { prisma } from "@/lib/prisma";

export interface AboutSettingsData {
  id: string;
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export const defaultAboutSettings: AboutSettingsData = {
  id: "default",
  badge: "About",
  title: "About Payana",
  paragraph1:
    "Payana (ಪಯಣ) plans a small collection of journeys and plans each one completely: flights, rooms, guides, and the small decisions in between. Every itinerary in our collection is built and re-walked by our own team before it is offered to travelers.",
  paragraph2:
    "We keep the collection deliberately small — four destinations at a time — so every detail can be held to the same standard, from the first confirmation email to the transfer home.",
  ctaTitle: "Have a trip in mind?",
  ctaDescription:
    "Our team curates custom plans around what matters to you, not just fixed packages.",
  ctaButtonText: "Request a Custom Plan",
  ctaButtonLink: "/concierge",
};

export async function getAboutSettings(): Promise<AboutSettingsData> {
  if (!prisma) return defaultAboutSettings;
  try {
    const row = await prisma.aboutSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) {
      return defaultAboutSettings;
    }
    return row;
  } catch (err) {
    console.error("getAboutSettings error:", err);
    return defaultAboutSettings;
  }
}
