import { AvailabilityDate, Package, RoomOption } from "@/types";

// Generates availability rows for the given month so the calendar always
// has current-looking data, regardless of when this is viewed.
function buildAvailability(packageId: string, fastFillingDays: number[]): AvailabilityDate[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: AvailabilityDate[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const capacity = 12;
    const fastFilling = fastFillingDays.includes(day);
    const booked = fastFilling ? 10 : Math.floor(Math.random() * 5);
    const iso = new Date(year, month, day).toISOString().slice(0, 10);
    dates.push({
      id: `${packageId}-avail-${day}`,
      packageId,
      date: iso,
      capacity,
      booked,
      fastFilling,
    });
  }
  return dates;
}

function roomOptionsFor(packageId: string, tiers: [string, string, number][]): RoomOption[] {
  return tiers.map(([name, description, priceUpgrade], i) => ({
    id: `${packageId}-room-${i + 1}`,
    packageId,
    name,
    description,
    priceUpgrade,
  }));
}

export const packages: Package[] = [
  {
    id: "pkg-maldives",
    slug: "maldivian-overwater-escape",
    title: "Maldivian Overwater Escape",
    location: "North Malé Atoll, Maldives",
    category: "Beach",
    description:
      "Seven nights suspended above turquoise water, with private lagoon access, sunrise snorkeling, and a spa built into the reef itself. Days move at the pace of the tide.",
    basePrice: 420000,
    durationDays: 7,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    ],
    itinerary: [
      { day: 1, title: "Arrival & Lagoon Welcome", description: "Seaplane transfer, overwater villa check-in, sunset welcome dinner on the jetty." },
      { day: 2, title: "Reef Snorkeling", description: "Guided snorkel over the house reef, afternoon free at the villa deck." },
      { day: 3, title: "Sandbank Picnic", description: "Private sandbank excursion by dhoni boat, picnic lunch, swimming." },
      { day: 4, title: "Spa & Stillness", description: "Overwater spa treatment, yoga at sunrise, free afternoon." },
      { day: 5, title: "Dolphin Cruise", description: "Sunset dolphin cruise, onboard canapés." },
      { day: 6, title: "Island Exploration", description: "Local island visit, artisan market, free evening." },
      { day: 7, title: "Departure", description: "Late checkout, seaplane transfer to Malé." },
    ],
    roomOptions: roomOptionsFor("pkg-maldives", [
      ["Lagoon Villa", "Overwater villa with direct lagoon steps and glass floor panel.", 0],
      ["Ocean Suite", "Larger villa with a private plunge pool and sun deck.", 85000],
      ["Reef Residence", "Two-bedroom villa, dedicated butler, panoramic reef views.", 210000],
    ]),
    availability: buildAvailability("pkg-maldives", [8, 9, 22]),
  },
  {
    id: "pkg-alpine",
    slug: "alpine-chalet-retreat",
    title: "Alpine Chalet Retreat",
    location: "Zermatt, Switzerland",
    category: "Mountain",
    description:
      "Five nights in a timber chalet below the Matterhorn, with guided glacier hikes, fondue evenings, and a private cable car pass. Built for slow mornings and long views.",
    basePrice: 385000,
    durationDays: 5,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
    ],
    itinerary: [
      { day: 1, title: "Arrival & Chalet Check-in", description: "Private transfer from Zermatt station, welcome fondue dinner." },
      { day: 2, title: "Gornergrat Railway", description: "Scenic rail to Gornergrat for Matterhorn views, afternoon village walk." },
      { day: 3, title: "Glacier Hike", description: "Guided glacier hike with mountain guide, packed alpine lunch." },
      { day: 4, title: "Free Day", description: "Optional skiing, spa, or village exploration at your own pace." },
      { day: 5, title: "Departure", description: "Late breakfast, private transfer to Zermatt station." },
    ],
    roomOptions: roomOptionsFor("pkg-alpine", [
      ["Chalet Double", "Timber-beamed double room with mountain-facing window.", 0],
      ["Deluxe Suite", "Corner suite with wood-burning stove and balcony.", 65000],
      ["Summit Loft", "Top-floor loft with 270° Matterhorn views.", 140000],
    ]),
    availability: buildAvailability("pkg-alpine", [14, 15, 16]),
  },
  {
    id: "pkg-kyoto",
    slug: "kyoto-cultural-immersion",
    title: "Kyoto Cultural Immersion",
    location: "Kyoto, Japan",
    category: "Culture",
    description:
      "Ten days moving between temples, tea houses, and a private ryokan, with a kaiseki dinner, a tea ceremony, and a dawn visit to Fushimi Inari before the crowds arrive.",
    basePrice: 510000,
    durationDays: 10,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Kyoto", description: "Private transfer, ryokan check-in, welcome kaiseki dinner." },
      { day: 2, title: "Fushimi Inari at Dawn", description: "Early gate walk before crowds, afternoon free." },
      { day: 3, title: "Tea Ceremony", description: "Private tea ceremony in Uji, matcha tasting." },
      { day: 4, title: "Arashiyama", description: "Bamboo grove, riverside lunch, Tenryu-ji temple garden." },
      { day: 5, title: "Gion Evening Walk", description: "Guided walk through the geisha district at dusk." },
      { day: 6, title: "Nara Day Trip", description: "Deer park, Todai-ji temple, lantern-lit evening return." },
      { day: 7, title: "Craft Workshop", description: "Hands-on pottery workshop with a local ceramicist." },
      { day: 8, title: "Free Day", description: "Self-guided exploration or optional cooking class." },
      { day: 9, title: "Philosopher's Path", description: "Canal-side walk, Ginkaku-ji temple, farewell dinner." },
      { day: 10, title: "Departure", description: "Late checkout, private transfer to Kansai Airport." },
    ],
    roomOptions: roomOptionsFor("pkg-kyoto", [
      ["Ryokan Room", "Tatami room with futon bedding and garden view.", 0],
      ["Garden Suite", "Larger tatami suite with private engawa and onsen bath.", 95000],
      ["Machiya House", "Restored townhouse, private courtyard, dedicated host.", 260000],
    ]),
    availability: buildAvailability("pkg-kyoto", [3, 4, 27]),
  },
  {
    id: "pkg-serengeti",
    slug: "serengeti-safari",
    title: "Serengeti Safari",
    location: "Serengeti National Park, Tanzania",
    category: "Adventure",
    description:
      "Eight nights tracking the migration by open-top Land Cruiser, from a tented camp on the plains to a final night above the Ngorongoro crater rim.",
    basePrice: 850000,
    durationDays: 8,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1200&q=80",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Arusha", description: "Private transfer, briefing dinner with your guide." },
      { day: 2, title: "Into the Serengeti", description: "Bush flight to camp, afternoon game drive." },
      { day: 3, title: "Migration Tracking", description: "Full-day drive following the herds, sundowner on the plains." },
      { day: 4, title: "Balloon Safari", description: "Dawn hot-air balloon flight, bush breakfast landing." },
      { day: 5, title: "Central Serengeti", description: "Big cat tracking with a resident naturalist." },
      { day: 6, title: "Transfer to Ngorongoro", description: "Scenic drive to the crater rim, evening at leisure." },
      { day: 7, title: "Crater Floor", description: "Full-day descent into the Ngorongoro Crater." },
      { day: 8, title: "Departure", description: "Morning drive, transfer to Kilimanjaro Airport." },
    ],
    roomOptions: roomOptionsFor("pkg-serengeti", [
      ["Tented Camp", "Classic canvas tent with en-suite bathroom, plains view.", 0],
      ["Deluxe Tent", "Larger tent with private deck and plunge pool.", 120000],
      ["Crater Rim Suite", "Final-night suite above the Ngorongoro Crater.", 180000],
    ]),
    availability: buildAvailability("pkg-serengeti", [11, 12, 13]),
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export const categories: Package["category"][] = ["Beach", "Mountain", "Culture", "Adventure"];
