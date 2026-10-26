import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function buildFutureDates(count: number = 16): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  // Generate departures for every upcoming Friday, Saturday, and Sunday over next 60 days
  for (let i = 1; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 5 || day === 6 || day === 0) {
      dates.push(d);
      if (dates.length >= count) break;
    }
  }
  return dates;
}

const karnatakaPackages = [
  {
    slug: "coorg-coffee-trail-and-falls",
    title: "Coorg Coffee Trail & Highland Waterfalls",
    location: "Coorg (Kodagu), Karnataka",
    category: "Mountain",
    description:
      "Immerse in the Scotland of India. Breathe in aromatic coffee blossoms, trek to misty highland waterfalls, experience authentic Kodava hospitality, and savor warm plantation cuisine by the evening campfire.",
    basePrice: 499900, // ₹4,999
    durationDays: 3,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fog-over-the-forest-4357-large.mp4",
    itinerary: [
      {
        day: 1,
        title: "Madikeri Arrival, Abbey Falls & Campfire",
        description:
          "Arrive in picturesque Madikeri. Visit the cascading Abbey Falls amidst spice plantations, catch the sunset at Raja's Seat, followed by an authentic Kodava dinner & bonfire under the stars.",
      },
      {
        day: 2,
        title: "Dubare Elephant Camp & Coffee Plantation Walk",
        description:
          "Morning visit to Dubare Elephant Camp along the Cauvery River. In the afternoon, enjoy a private guided coffee & black pepper plantation walk with fresh bean-to-cup brewing.",
      },
      {
        day: 3,
        title: "Talacauvery Pilgrimage & Scenic Return",
        description:
          "Drive to Brahmagiri Hills to visit Talacauvery (origin of the sacred Cauvery River) and the confluence at Bhagamandala before scenic return drive.",
      },
    ],
    roomOptions: [
      { name: "Standard Estate Room", description: "Comfortable homestay room with estate views", priceUpgrade: 0 },
      { name: "Private Coffee Cottage", description: "Standalone cottage nestled in plantation trees", priceUpgrade: 150000 },
      { name: "Luxury Heritage Suite", description: "Spacious heritage suite with fireplace and balcony", priceUpgrade: 300000 },
    ],
  },
  {
    slug: "gokarna-murudeshwar-beach-trek",
    title: "Gokarna & Murudeshwar Coastal Trek",
    location: "Gokarna, Karnataka",
    category: "Beach",
    description:
      "Climb coastal cliffs overlooking the Arabian Sea, trek across pristine secluded golden sands from Om Beach to Paradise Beach, and visit the historic Murudeshwar temple with its towering Shiva statue.",
    basePrice: 449900, // ₹4,499
    durationDays: 2,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-view-of-a-beach-resort-1662-large.mp4",
    itinerary: [
      {
        day: 1,
        title: "5-Beach Cliff Trek & Paradise Beach Sunset",
        description:
          "Trek along scenic cliffs connecting Kudle Beach, Om Beach, Half Moon Beach, and Paradise Beach. Sunset swim, acoustic beachside dinner, and overnight camping.",
      },
      {
        day: 2,
        title: "Mahabaleshwar Temple, Mirjan Fort & Murudeshwar",
        description:
          "Seek blessings at the sacred Mahabaleshwar Temple, explore the laterite stone architecture of Mirjan Fort, and marvel at the 123-ft Shiva statue in Murudeshwar.",
      },
    ],
    roomOptions: [
      { name: "Beachside Alpine Tent", description: "Camping right by the shore with ocean breeze", priceUpgrade: 0 },
      { name: "Coastal Homestay Room", description: "Clean AC room close to Gokarna main town", priceUpgrade: 100000 },
      { name: "Cliff-view Eco Cottage", description: "Stunning Arabian Sea panorama from private porch", priceUpgrade: 250000 },
    ],
  },
  {
    slug: "hampi-heritage-and-boulders",
    title: "Hampi Heritage & Bouldering Odyssey",
    location: "Hampi, Vijayanagara, Karnataka",
    category: "Culture",
    description:
      "Step into an open-air UNESCO World Heritage museum. Explore grand 14th-century boulder-strewn ruins, marvel at stone carvings of the Vijayanagara Empire, glide on a traditional coracle across the Tungabhadra River, and catch breathtaking sunrises.",
    basePrice: 649900, // ₹6,499
    durationDays: 3,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600100397608-f010f443b740?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: null,
    itinerary: [
      {
        day: 1,
        title: "Virupaksha Temple & Tungabhadra Coracle Ride",
        description:
          "Explore the living 7th-century Virupaksha Temple, take a circular coracle (Teppa) ride on Tungabhadra River, and watch the sun dip behind boulders at Hemakuta Hill.",
      },
      {
        day: 2,
        title: "Vijaya Vittala, Stone Chariot & Royal Enclosure",
        description:
          "Visit the world-famous Stone Chariot and musical pillars at Vittala Temple, followed by Queen's Bath, Lotus Mahal, Elephant Stables, and Hazara Rama Temple.",
      },
      {
        day: 3,
        title: "Anjanadri Hill Sunrise & Sanapur Lake",
        description:
          "Hike up Anjanadri Hill (birthplace of Lord Hanuman) for 360° panoramic sunrise views, followed by cliff jumping and relaxation by the scenic Sanapur Lake.",
      },
    ],
    roomOptions: [
      { name: "Heritage Guest Room", description: "Cozy local guesthouse with traditional architecture", priceUpgrade: 0 },
      { name: "Boutique Stone Villa", description: "Air-conditioned stone cottage with garden view", priceUpgrade: 180000 },
      { name: "Royal Vijayanagara Suite", description: "Luxury heritage resort suite with swimming pool access", priceUpgrade: 350000 },
    ],
  },
  {
    slug: "dandeli-river-rafting-and-jungle",
    title: "Dandeli Kali River Rafting & Jungle Safari",
    location: "Dandeli, Uttara Kannada, Karnataka",
    category: "Adventure",
    description:
      "The ultimate adrenaline rush in Karnataka's dense Western Ghats rainforests. Conquer 9 km of grade 3 white water rapids on Kali River, kayak calm jungle waters, take a natural jacuzzi bath, and venture into the wildlife sanctuary.",
    basePrice: 499900, // ₹4,999
    durationDays: 2,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: null,
    itinerary: [
      {
        day: 1,
        title: "Grade 3 White Water Rafting & Night Campfire",
        description:
          "Gear up for 9 km white water rafting on River Kali with experienced safety kayakers. Enjoy natural jacuzzi baths, river zipline, and barbecue campfire dinner.",
      },
      {
        day: 2,
        title: "Wildlife Safari & Syntheri Rocks Canyon",
        description:
          "Early morning Dandeli Wildlife Sanctuary open-jeep safari spotting hornbills, deer, and black panthers, followed by a visit to the monolithic Syntheri Rocks canyon.",
      },
    ],
    roomOptions: [
      { name: "Jungle River Tent", description: "Waterproof campsite tent on the riverbank", priceUpgrade: 0 },
      { name: "Deluxe Wooden Cottage", description: "Spacious wooden cottage with attached bath & AC", priceUpgrade: 120000 },
      { name: "Canopy Treehouse Suite", description: "Elevated treehouse offering canopy views and luxury comfort", priceUpgrade: 280000 },
    ],
  },
  {
    slug: "kudremukh-emerald-peak-trek",
    title: "Kudremukh Peak Shola Forest Trek",
    location: "Chikkamagaluru, Karnataka",
    category: "Mountain",
    description:
      "Conquer Karnataka's second-highest peak (1,894m) shaped like a horse's face. Walk through lush rolling emerald meadows, mist-covered Shola grasslands, and pristine crystal-clear hill streams in the Kudremukh National Park.",
    basePrice: 389900, // ₹3,899
    durationDays: 2,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    ],
    videoUrl: null,
    itinerary: [
      {
        day: 1,
        title: "Kalasa Basecamp Arrival & Somawathi Falls",
        description:
          "Arrive at the lush Kalasa basecamp. Freshen up with a cool dip in Somawathi River waterfalls, followed by a briefing session and traditional piping-hot Malnad dinner.",
      },
      {
        day: 2,
        title: "22 km Kudremukh Horse-Face Summit Trek",
        description:
          "Start at dawn through national park forest checkpoints. Trek across 12 rolling hills and misty shola forest ridges to reach the horse-face peak summit before descending.",
      },
    ],
    roomOptions: [
      { name: "Basecamp Dormitory / Tent", description: "Clean dormitory or shared alpine tent", priceUpgrade: 0 },
      { name: "Malnad Plantation Homestay Room", description: "Private room with warm local family hospitality", priceUpgrade: 80000 },
      { name: "Private Mountain View Cottage", description: "Cottage with private sit-out overlooking Western Ghats", priceUpgrade: 180000 },
    ],
  },
];

async function seed() {
  console.log("Seeding curated Karnataka packages...");

  const departureDates = buildFutureDates(18);

  for (const pkg of karnatakaPackages) {
    console.log(`Upserting: ${pkg.title}`);

    // Clean up older availability/rooms if updating
    const existing = await prisma.package.findUnique({ where: { slug: pkg.slug } });
    if (existing) {
      await prisma.availabilityDate.deleteMany({ where: { packageId: existing.id } });
      await prisma.roomOption.deleteMany({ where: { packageId: existing.id } });
    }

    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        title: pkg.title,
        location: pkg.location,
        category: pkg.category,
        description: pkg.description,
        basePrice: pkg.basePrice,
        durationDays: pkg.durationDays,
        featured: pkg.featured,
        images: pkg.images,
        videoUrl: pkg.videoUrl,
        itinerary: pkg.itinerary,
        roomOptions: {
          create: pkg.roomOptions.map((r) => ({
            name: r.name,
            description: r.description,
            priceUpgrade: r.priceUpgrade,
          })),
        },
        availability: {
          create: departureDates.map((d, idx) => ({
            date: d,
            capacity: 15,
            booked: idx === 0 ? 11 : idx === 1 ? 8 : Math.floor(Math.random() * 4),
            fastFilling: idx <= 1,
          })),
        },
      },
      create: {
        slug: pkg.slug,
        title: pkg.title,
        location: pkg.location,
        category: pkg.category,
        description: pkg.description,
        basePrice: pkg.basePrice,
        durationDays: pkg.durationDays,
        featured: pkg.featured,
        images: pkg.images,
        videoUrl: pkg.videoUrl,
        itinerary: pkg.itinerary,
        roomOptions: {
          create: pkg.roomOptions.map((r) => ({
            name: r.name,
            description: r.description,
            priceUpgrade: r.priceUpgrade,
          })),
        },
        availability: {
          create: departureDates.map((d, idx) => ({
            date: d,
            capacity: 15,
            booked: idx === 0 ? 11 : idx === 1 ? 8 : Math.floor(Math.random() * 4),
            fastFilling: idx <= 1,
          })),
        },
      },
    });
  }

  // Also ensure Deviramma Hill Trek has future availability dates
  const deviramma = await prisma.package.findUnique({ where: { slug: "deviramma-hill-trek" } });
  if (deviramma) {
    const existingDates = await prisma.availabilityDate.count({ where: { packageId: deviramma.id } });
    if (existingDates === 0) {
      await prisma.availabilityDate.createMany({
        data: departureDates.map((d, idx) => ({
          packageId: deviramma.id,
          date: d,
          capacity: 12,
          booked: idx === 0 ? 9 : 2,
          fastFilling: idx === 0,
        })),
      });
    }
  }

  console.log("Successfully seeded all Karnataka packages!");
}

seed()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
