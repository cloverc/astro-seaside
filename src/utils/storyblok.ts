export function getStoryblokVersion(request: Request): "draft" | "published" {
  const host = request.headers.get("host") ?? "";
  return host.includes("preview--") || host.includes("localhost")
    ? "draft"
    : "published";
}

export async function fetchDatasourceEntries(slug: string): Promise<any[]> {
  const token = import.meta.env.STORYBLOK_TOKEN;
  const url = `https://api.storyblok.com/v2/cdn/datasource_entries?datasource=${slug}&per_page=100&token=${token}&cv=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return data.datasource_entries ?? [];
  } catch {
    return [];
  }
}
