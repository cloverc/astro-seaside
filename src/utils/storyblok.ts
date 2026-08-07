export function getStoryblokVersion(request: Request): "draft" | "published" {
  const host = request.headers.get("host") ?? "";
  return host.includes("preview--") || host.includes("localhost")
    ? "draft"
    : "published";
}
