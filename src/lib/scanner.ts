import {
  CITIES,
  REGIONS,
  REGION_NAMES,
  isHighTrust,
  matchesArea,
  prospectScore,
  slugify,
  type Region,
  type Review,
} from "@/lib/leads";

/**
 * Prospect scanner.
 *
 * This module produces candidate businesses from a deterministic, seeded
 * generator so the pilot workspace is usable before a Google Places key is
 * connected. Every field here is simulated sample data — swap `scanProspects`
 * for a live Places Text Search call and the rest of the app is unchanged.
 */

export type Prospect = {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  trade: string;
  city: string;
  rating: number;
  review_count: number;
  has_website: boolean;
  reviews: Review[];
  score: number;
  high_trust: boolean;
  gaps: string[];
};

export type ScanInput = {
  trade: string;
  /** "all", "region:<Region>", or a city name — same shape as the pipeline filter. */
  area: string;
  minRating: number;
  minReviews: number;
  onlyNoWebsite: boolean;
  limit?: number;
};

type Pool = { prefix: string[]; core: string[] };

const HVAC_POOL: Pool = {
  prefix: ["Northline", "Prairie", "Midway", "Lakeshore", "Cedar Ridge", "Ironwood", "Blue Heron", "Kettle Creek", "Fox Valley", "Grandview", "Blackhawk", "Sunset"],
  core: ["Heating & Air", "HVAC", "Climate Control", "Comfort Systems", "Air Conditioning", "Boiler & Furnace"],
};

const NAME_POOLS: Record<string, Pool> = {
  HVAC: HVAC_POOL,
  Roofing: {
    prefix: ["Summit", "Ironclad", "Stormwatch", "Copper Ridge", "Northstar", "Keystone", "Timberline", "Granite", "Beacon", "Ridgecrest", "Lakeside", "Harbor"],
    core: ["Roofing", "Roofing & Exteriors", "Roof & Gutter", "Roof Works"],
  },
  Plumbing: {
    prefix: ["Copperline", "Flowright", "Great Lakes", "Drainworks", "Wellspring", "Silverline", "Northpoint", "Anchor", "Metro", "Cedar", "Bluepipe", "Ridgeway"],
    core: ["Plumbing", "Plumbing & Drain", "Plumbing Services", "Water Works"],
  },
  "Tree Service": {
    prefix: ["Canopy", "Arborcare", "Bigbranch", "Treeworks", "Greenlimb", "Oakstone", "Timber", "Evergreen", "Branchout", "Northwoods", "Cedarwood", "Hollow"],
    core: ["Tree Service", "Tree Care", "Arborists", "Tree & Stump"],
  },
  Landscaping: {
    prefix: ["Greenacre", "Cedar & Stone", "Lawnworks", "Bloomingdale", "Sod & Stone", "Prairie", "Four Seasons", "Yardcraft", "Bluegrass", "Hearthstone", "Terraza", "Meadow"],
    core: ["Landscaping", "Lawn & Landscape", "Landscape Design", "Outdoor Care"],
  },
  Painting: {
    prefix: ["Freshcoat", "Brush & Bond", "Colorcraft", "Paintworks", "Colonial", "Spectrum", "Brushstroke", "Northside", "Chroma", "Keystone", "Harborview", "Varnish"],
    core: ["Painting", "Painting & Finishes", "Painters", "Coatings"],
  },
};

const SUFFIXES = ["Co.", "LLC", "Services", "Group", "Pros", "& Sons"];

const FIRST = ["Marcus", "Dana", "Luis", "Priya", "Tom", "Alicia", "Ray", "Nina", "Joe", "Kelly", "Omar", "Beth", "Craig", "Sam", "Rosa", "Neil", "Hana", "Vince", "Grace", "Ivan"];
const LAST = ["Delgado", "Whitfield", "Okafor", "Kowalski", "Reyes", "Brennan", "Sato", "Novak", "Ahmed", "Sullivan", "Marchetti", "Alvarez", "Hoffman", "Byrne", "Kaur", "Fischer", "Malone", "Petrov", "Doyle", "Bennett"];

const HVAC_QUOTES = [
  "Technician arrived within two hours and had the heat running again that night.",
  "They replaced our furnace in a single day and left the basement spotless.",
  "Honest quote, no upsell — told us we only needed a capacitor.",
  "Our energy bill dropped the first month after the new system.",
];

const QUOTES: Record<string, string[]> = {
  HVAC: HVAC_QUOTES,
  Roofing: [
    "Came out the same afternoon after the storm and tarped it for free.",
    "New roof in one day, and they handled the insurance paperwork.",
    "Found a leak two other companies missed.",
    "Job site was cleaner than before they showed up.",
  ],
  Plumbing: [
    "Fixed a burst pipe at 11pm and never charged an absurd overtime rate.",
    "Replaced our water heater the same day we called.",
    "Cleared a drain that two other plumbers gave up on.",
    "Showed up on time, quoted up front, no surprises.",
  ],
  "Tree Service": [
    "Took down a dead oak leaning over the garage without touching the roof.",
    "Stump ground, yard raked, nothing left behind.",
    "Crew showed up early and hauled off every branch.",
    "Fair price and the yard looked better than before.",
  ],
  Landscaping: [
    "Our backyard finally looks like the picture they showed us.",
    "Weekly crew is punctual and the edges are always crisp.",
    "They rebuilt our patio in three days and cleaned up daily.",
    "Best judgment on plant placement of anyone we interviewed.",
  ],
  Painting: [
    "Prep work was obsessive — every outlet and window taped.",
    "Exterior still looks perfect after a full winter.",
    "Two coats, on schedule, and the trim lines are razor sharp.",
    "They moved the furniture back exactly where it started.",
  ],
};

const AREA_CODES: Record<string, string> = {
  West: "630",
  Northwest: "847",
  South: "708",
  Southwest: "815",
  East: "219",
};

/** FNV-1a string hash → 32-bit seed. */
function seedOf(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** mulberry32 — small, fast, deterministic. */
function makeRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(list: readonly T[], r: () => number) {
  return list[Math.floor(r() * list.length) % list.length] as T;
}

function regionFor(city: string): Region {
  return REGION_NAMES.find((r) => (REGIONS[r] as readonly string[]).includes(city)) ?? "West";
}

function gapsFor(p: Pick<Prospect, "rating" | "review_count" | "has_website">) {
  const gaps: string[] = [];
  if (!p.has_website) gaps.push("No website found");
  if (p.rating < 4.5) gaps.push("Rating under 4.5");
  if (p.review_count < 15) gaps.push("Under 15 reviews");
  if (gaps.length === 0) gaps.push("Reputation matches presence");
  return gaps;
}

function buildProspect(trade: string, city: string, index: number): Prospect {
  const pools = NAME_POOLS[trade] ?? HVAC_POOL;
  const r = makeRandom(seedOf(`${trade}|${city}|${index}`));

  const business_name = `${pick(pools.prefix, r)} ${pick(pools.core, r)} ${pick(SUFFIXES, r)}`;
  const owner_name = `${pick(FIRST, r)} ${pick(LAST, r)}`;
  const rating = Math.round((3.6 + r() * 1.4) * 10) / 10;
  const review_count = Math.round(4 + Math.pow(r(), 2) * 210);
  const has_website = r() > 0.55;

  const quotePool = QUOTES[trade] ?? HVAC_QUOTES;
  const quote = pick(quotePool, r);
  const author = `${pick(FIRST, r)} ${pick(LAST, r).charAt(0)}.`;

  const slug = slugify(business_name);
  const email = `info@${slug.replace(/[^a-z0-9]/g, "")}.com`;
  const phone = `(${AREA_CODES[regionFor(city)] ?? "630"}) 555-01${String(Math.floor(r() * 90) + 10)}`;

  const base = { rating, review_count, has_website };
  return {
    id: `${slug}-${city.toLowerCase().replace(/\s+/g, "-")}`,
    business_name,
    owner_name,
    phone,
    email,
    trade,
    city,
    rating,
    review_count,
    has_website,
    reviews: [{ author, text: quote, rating: rating >= 4.5 ? 5 : 4 }],
    score: prospectScore(rating, review_count, has_website),
    high_trust: isHighTrust(rating, review_count),
    gaps: gapsFor(base),
  };
}

export function scanProspects(input: ScanInput): Prospect[] {
  const { trade, area, minRating, minReviews, onlyNoWebsite, limit = 12 } = input;

  let cities: readonly string[];
  if (area === "all") cities = CITIES;
  else if (area.startsWith("region:")) cities = REGIONS[area.slice(7) as Region] ?? [];
  else cities = [area];

  const out: Prospect[] = [];
  const seen = new Set<string>();
  for (const city of cities) {
    if (!matchesArea(city, area)) continue;
    for (let i = 0; i < 4; i++) {
      const p = buildProspect(trade, city, i);
      const key = p.business_name.toLowerCase();
      if (seen.has(key)) continue;
      if (p.rating < minRating || p.review_count < minReviews) continue;
      if (onlyNoWebsite && p.has_website) continue;
      seen.add(key);
      out.push(p);
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Map a scanned prospect onto a `leads` insert (stage defaults to Discovered). */
export function prospectToLead(p: Prospect) {
  return {
    slug: `${slugify(p.business_name)}-${Math.random().toString(36).slice(2, 6)}`,
    business_name: p.business_name,
    owner_name: p.owner_name,
    phone: p.phone,
    email: p.email,
    trade: p.trade,
    city: p.city,
    rating: p.rating,
    review_count: p.review_count,
    reviews: p.reviews,
  };
}

export function isKnownProspect(p: Prospect, existingNames: ReadonlySet<string>) {
  return existingNames.has(p.business_name.toLowerCase());
}
