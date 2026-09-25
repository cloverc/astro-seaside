// Keyed by the datasource entry's display name (not its slug value), since
// that's the one form available consistently wherever resource type is
// rendered — the resource-hub index page only carries the label through to
// its filter checkboxes and cards, not the raw value.
// Avoids teal and pink — those are already the site's secondary and accent
// colors, so a resource-type dot in one of them would blend into badges/
// links/CTAs that mean something else entirely. Guide uses sky rather than
// the site's primary/navy blues so it doesn't read as a muted version of
// the default badge color. All four are the -700 tier (or, for purple,
// -600 which already clears it) because this color also fills the
// RelatedCard badge background behind small bold white text — anything
// lighter fails WCAG AA (4.5:1) there even though it'd be fine for the
// decorative filter/card dots alone.
const RESOURCE_TYPE_DOT_COLORS: Record<string, string> = {
  Guide: "bg-sky-700",
  "Case Study": "bg-amber-700",
  Research: "bg-purple-600",
  Toolkit: "bg-green-700",
};

export function resourceTypeDotColor(label?: string | null): string {
  return (label && RESOURCE_TYPE_DOT_COLORS[label]) || "bg-gray-400";
}
