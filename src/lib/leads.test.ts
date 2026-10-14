import { describe, expect, it } from "vitest";
import { isHighTrust, opportunityScore, pitches, STAGES, viewedRecently, wordCount, type Lead } from "./leads";

const lead = {
  business_name: "Fox Valley Comfort HVAC", owner_name: "Mike Kowalski", rating: 4.8,
  review_count: 63, city: "Aurora", trade: "HVAC", slug: "fox",
} as unknown as Lead;

describe("lead rules", () => {
  it("high-trust needs 4.5+ stars and 15+ reviews", () => {
    expect(isHighTrust(4.5, 15)).toBe(true);
    expect(isHighTrust(4.4, 100)).toBe(false);
    expect(isHighTrust(5, 14)).toBe(false);
  });
  it("high-trust leads outscore low-trust ones", () => {
    expect(opportunityScore(4.5, 15)).toBeGreaterThan(opportunityScore(4.4, 14));
  });
  it("viewed just now means within 15 minutes", () => {
    const now = Date.now();
    expect(viewedRecently(new Date(now - 5 * 60_000).toISOString(), now)).toBe(true);
    expect(viewedRecently(new Date(now - 20 * 60_000).toISOString(), now)).toBe(false);
  });
  it("pipeline has five stages and the second is Active Ready", () => {
    expect(STAGES).toEqual(["Discovered", "Active Ready", "Pitched", "Viewed", "Won"]);
    expect(STAGES).not.toContain("Demo Ready");
  });
  it("cold email body stays under 75 words", () => {
    const body = pitches(lead, "https://x.app/preview/fox").email.split("\n").slice(1).join(" ");
    expect(wordCount(body)).toBeLessThan(75);
  });
});
