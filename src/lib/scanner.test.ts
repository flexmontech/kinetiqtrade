import { describe, expect, it } from "vitest";
import { prospectScore } from "@/lib/leads";
import { isKnownProspect, prospectToLead, scanProspects, type ScanInput } from "@/lib/scanner";

const base: ScanInput = { trade: "HVAC", area: "Aurora", minRating: 0, minReviews: 0, onlyNoWebsite: false };

function firstProspect(input: ScanInput) {
  const [p] = scanProspects(input);
  if (!p) throw new Error(`no prospects returned for ${JSON.stringify(input)}`);
  return p;
}

describe("scanProspects", () => {
  it("returns only the requested business type and suburb", () => {
    const rows = scanProspects({ ...base, trade: "Roofing", area: "Joliet" });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((p) => p.trade === "Roofing" && p.city === "Joliet")).toBe(true);
  });

  it("is deterministic — the same search returns the same businesses", () => {
    expect(scanProspects(base).map((p) => p.business_name)).toEqual(scanProspects(base).map((p) => p.business_name));
  });

  it("applies the rating, review and no-website filters", () => {
    const strict = scanProspects({ ...base, area: "all", minRating: 4.5, minReviews: 15, onlyNoWebsite: true });
    expect(strict.length).toBeGreaterThan(0);
    expect(strict.every((p) => p.rating >= 4.5 && p.review_count >= 15 && !p.has_website)).toBe(true);
  });

  it("orders results by opportunity score, highest first", () => {
    const rows = scanProspects({ ...base, area: "all", limit: 12 });
    expect(rows.length).toBeGreaterThan(1);
    const scores = rows.map((p) => p.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("never returns the same business twice in one search", () => {
    const names = scanProspects({ ...base, area: "all", limit: 40 }).map((p) => p.business_name.toLowerCase());
    expect(names.length).toBeGreaterThan(1);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("prospectScore", () => {
  it("boosts a business with no website over an identical one with a site", () => {
    expect(prospectScore(4.8, 60, false)).toBeGreaterThan(prospectScore(4.8, 60, true));
  });

  it("caps at 100", () => {
    expect(prospectScore(5, 500, false)).toBe(100);
  });
});

describe("prospectToLead", () => {
  it("maps a prospect onto a pipeline row with a unique slug", () => {
    const prospect = firstProspect(base);
    const row = prospectToLead(prospect);
    expect(row.business_name).toBe(prospect.business_name);
    expect(row.city).toBe(prospect.city);
    expect(row.rating).toBe(prospect.rating);
    expect(row.slug).toMatch(/^[a-z0-9-]+$/);
    expect(prospectToLead(prospect).slug).not.toBe(row.slug);
  });

  it("flags businesses already in the pipeline", () => {
    const prospect = firstProspect(base);
    const known = new Set([prospect.business_name.toLowerCase()]);
    expect(isKnownProspect(prospect, known)).toBe(true);
    expect(isKnownProspect(prospect, new Set<string>())).toBe(false);
  });
});
