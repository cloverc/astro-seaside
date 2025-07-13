import { describe, it, expect } from "vitest";
import { filterAndSortEvents } from "../utils/filterEvents";

const fixedNow = new Date("2025-01-01T00:00:00Z");

const mockEvents = [
  { content: { date: "2023-01-01" }, full_slug: "past-1" },
  { content: { date: "2025-02-02" }, full_slug: "future-1" },
  { content: { date: "2025-01-11" }, full_slug: "future-2" },
  { content: { date: "2020-05-20" }, full_slug: "past-2" },
  { content: { date: "invalid-date" }, full_slug: "broken-1" },
  { content: {}, full_slug: "missing-date" },
];

describe("filterAndSortEvents", () => {
  it("filters upcoming events in ascending order", () => {
    const result = filterAndSortEvents(mockEvents, fixedNow, true);
    expect(result).toHaveLength(2);
    expect(result[0].full_slug).toBe("future-2");
    expect(result[1].full_slug).toBe("future-1");
  });

  it("filters past events in descending order", () => {
    const result = filterAndSortEvents(mockEvents, fixedNow, false);
    expect(result).toHaveLength(2);
    expect(result[0].full_slug).toBe("past-1");
    expect(result[1].full_slug).toBe("past-2");
  });

  it("excludes events with invalid or missing dates", () => {
    const result = filterAndSortEvents(mockEvents, fixedNow, true);
    const slugs = result.map((e) => e.full_slug);
    expect(slugs).not.toContain("broken-1");
    expect(slugs).not.toContain("missing-date");
  });
});
