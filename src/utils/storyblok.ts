export function getStoryblokVersion(request: Request): "draft" | "published" {
  const host = request.headers.get("host") ?? "";
  const isLocal =
    host.includes("localhost") ||
    host.includes("preview--") ||
    /^192\.168\.\d+\.\d+/.test(host) ||
    /^10\.\d+\.\d+\.\d+/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/.test(host);
  return isLocal ? "draft" : "published";
}

// Storyblok CDN asset URLs encode the original pixel dimensions as a path
// segment (https://a.storyblok.com/f/{space}/{width}x{height}/{hash}/{name})
// — the asset object itself carries no width/height fields, so this is the
// only source for them without a separate API call.
export function getImageDimensions(
  filename: string | null | undefined,
): { width: number; height: number } | null {
  const match = filename?.match(/\/(\d+)x(\d+)\//);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}

export async function fetchDatasourceEntries(slug: string): Promise<any[]> {
  const token = import.meta.env.STORYBLOK_TOKEN;
  const url = `https://api.storyblok.com/v2/cdn/datasource_entries?datasource=${slug}&per_page=100&token=${token}&cv=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.datasource_entries ?? [];
  } catch {
    return [];
  }
}
