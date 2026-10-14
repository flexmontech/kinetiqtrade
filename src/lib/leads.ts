import type { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;
export type Review = { author: string; text: string; rating: number };

export const STAGES = ["Discovered", "Active Ready", "Pitched", "Viewed", "Won"] as const;
export type Stage = (typeof STAGES)[number];

export const TRADES = ["HVAC", "Roofing", "Plumbing", "Tree Service", "Landscaping", "Painting"] as const;
export type Trade = (typeof TRADES)[number];

export const CITIES = ["Aurora", "Joliet", "Naperville", "Bolingbrook", "Wheaton"] as const;

export function isHighTrust(rating: number, reviews: number) {
  return rating >= 4.5 && reviews >= 15;
}

/** 0–100. Rating drives most of it, review volume adds proof, high-trust gets a bonus. */
export function opportunityScore(rating: number, reviews: number) {
  const ratingPart = Math.max(0, Math.min(1, (rating - 3) / 2)) * 60;
  const reviewPart = Math.min(reviews / 80, 1) * 30;
  const bonus = isHighTrust(rating, reviews) ? 10 : 0;
  return Math.round(ratingPart + reviewPart + bonus);
}

export function viewedRecently(lastViewedAt: string | null, now = Date.now(), windowMin = 15) {
  if (!lastViewedAt) return false;
  return now - new Date(lastViewedAt).getTime() < windowMin * 60_000;
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function tradeKey(trade: string) {
  return slugify(trade);
}

type TradeContent = {
  headline: string;
  emergency: string;
  services: { title: string; desc: string }[];
};

export const TRADE_CONTENT = {
  HVAC: {
    headline: "Furnace out? We'll have you warm tonight.",
    emergency: "24/7 emergency heating & cooling repair",
    services: [
      { title: "Furnace Repair", desc: "Same-day diagnosis and repair on all major brands." },
      { title: "AC Installation", desc: "High-efficiency systems sized right for your home." },
      { title: "Seasonal Tune-Ups", desc: "Catch problems before the first cold snap." },
      { title: "Indoor Air Quality", desc: "Humidifiers, filtration, and duct cleaning." },
    ],
  },
  Roofing: {
    headline: "Storm damage? Get your roof inspected free.",
    emergency: "Emergency tarping & leak repair",
    services: [
      { title: "Roof Replacement", desc: "Architectural shingles installed in as little as a day." },
      { title: "Storm & Hail Repair", desc: "We work directly with your insurance adjuster." },
      { title: "Leak Repair", desc: "Fast fixes before water reaches your ceilings." },
      { title: "Gutters & Siding", desc: "Seamless gutters and matching exterior work." },
    ],
  },
  Plumbing: {
    headline: "Burst pipe or no hot water? We pick up.",
    emergency: "24/7 emergency plumbing",
    services: [
      { title: "Leak & Pipe Repair", desc: "Frozen and burst pipes fixed fast." },
      { title: "Water Heaters", desc: "Tank and tankless installs, often same day." },
      { title: "Drain Cleaning", desc: "Camera inspection and hydro-jetting." },
      { title: "Sump Pumps", desc: "Keep your basement dry through spring storms." },
    ],
  },
  "Tree Service": {
    headline: "Dangerous limb over your roof? We'll handle it.",
    emergency: "Emergency storm cleanup",
    services: [
      { title: "Tree Removal", desc: "Safe removal, even in tight spaces." },
      { title: "Trimming & Pruning", desc: "Healthier trees and clear rooflines." },
      { title: "Stump Grinding", desc: "Stumps gone and the area cleaned up." },
      { title: "Storm Cleanup", desc: "Fallen trees cleared fast after storms." },
    ],
  },
  Landscaping: {
    headline: "Get the yard you actually want to sit in.",
    emergency: "Now booking spring & fall cleanups",
    services: [
      { title: "Lawn Care", desc: "Weekly mowing, edging, and fertilization." },
      { title: "Paver Patios", desc: "Patios, walkways, and retaining walls." },
      { title: "Garden Design", desc: "Planting beds built for Illinois seasons." },
      { title: "Seasonal Cleanup", desc: "Leaves, beds, and gutters handled." },
    ],
  },
  Painting: {
    headline: "A fresh coat, done clean and on schedule.",
    emergency: "Booking exterior projects now",
    services: [
      { title: "Interior Painting", desc: "Walls, trim, and ceilings with careful prep." },
      { title: "Exterior Painting", desc: "Weather-tough finishes for Chicagoland winters." },
      { title: "Cabinet Refinishing", desc: "Factory-smooth kitchens without a remodel." },
      { title: "Deck Staining", desc: "Protect and revive wood decks and fences." },
    ],
  },
} satisfies Record<string, TradeContent>;

export function contentFor(trade: string): TradeContent {
  const content: Record<string, TradeContent> = TRADE_CONTENT;
  return content[trade] ?? TRADE_CONTENT.HVAC;
}

export const NEARBY: Record<string, string[]> = {
  Aurora: ["Aurora", "North Aurora", "Montgomery", "Oswego", "Batavia", "Naperville"],
  Joliet: ["Joliet", "Shorewood", "Plainfield", "Lockport", "Crest Hill", "New Lenox"],
  Naperville: ["Naperville", "Aurora", "Lisle", "Warrenville", "Plainfield", "Bolingbrook"],
  Bolingbrook: ["Bolingbrook", "Romeoville", "Woodridge", "Naperville", "Plainfield", "Lemont"],
  Wheaton: ["Wheaton", "Glen Ellyn", "Winfield", "Carol Stream", "West Chicago", "Lombard"],
};

export function firstName(owner: string | null) {
  return owner?.trim().split(/\s+/)[0] || "there";
}

export function pitches(lead: Lead, link: string) {
  const name = firstName(lead.owner_name);
  const email = `Subject: ${lead.business_name} — missed calls?

Hi ${name},

${lead.rating}★ across ${lead.review_count} Google reviews is rare in ${lead.city}. But homeowners searching at night often can't find a site to call from, so those jobs go elsewhere.

I built you a free demo with tap-to-call and an estimate form:
${link}

Want it live on your domain this week?`;

  const sms = `Hi ${name}, saw ${lead.business_name}'s ${lead.rating}★ reviews in ${lead.city}. I made you a free demo website. Want to see it on your phone? ${link}`;

  const call = `OPENER
"Hi, is this ${name}? This is [Your Name] — I work with home service pros around ${lead.city}. Got 30 seconds?"

HOOK
• "You've got ${lead.rating} stars from ${lead.review_count} reviews on Google — that's top tier for ${lead.trade.toLowerCase()} in ${lead.city}."
• "Problem: people find you on Maps, there's no site to check, and they call the next guy."

VALUE
• "I already built you a demo — tap-to-call, your real reviews, a free estimate form."
• "Can I text you the link? It's ${link}"

OBJECTIONS
• "I'm busy / word of mouth is enough" → "Totally — this just catches the calls you're already missing after hours."
• "How much?" → "One flat setup, and it runs on your own domain. Look first, decide after."

CLOSE
"What's the best cell to text it to?"`;

  return { email, sms, call };
}

export function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
