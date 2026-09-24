export type RelatedContentKind = "news" | "insight" | "resource" | "event";

/**
 * Maps a Storyblok story's content type (and, for articles, its
 * article_type field) to the `kind` RelatedContent/RelatedCard expect.
 */
export function kindFromStory(story: {
  content: { component: string; article_type?: string };
}): RelatedContentKind {
  const { component, article_type } = story.content;
  if (component === "article") {
    return article_type === "news" ? "news" : "insight";
  }
  if (component === "resource_item") return "resource";
  return "event";
}
