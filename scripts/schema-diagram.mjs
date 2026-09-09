#!/usr/bin/env node
/**
 * Generates a Mermaid ER diagram from the local Storyblok schema files.
 * Run after any `storyblok components pull` or `storyblok datasources pull`.
 *
 * Usage:
 *   node scripts/schema-diagram.mjs
 *   node scripts/schema-diagram.mjs --all   (include non-resource-hub components)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SPACE = "251170";

const components = JSON.parse(
  readFileSync(
    join(root, `.storyblok/components/${SPACE}/components.json`),
    "utf8",
  ),
);
const datasources = JSON.parse(
  readFileSync(
    join(root, `.storyblok/datasources/${SPACE}/datasources.json`),
    "utf8",
  ),
);

const showAll = process.argv.includes("--all");
const showDatasources = showAll || process.argv.includes("--datasources");

// Components relevant to resource hub and news & insights
const CONTENT_TYPES = new Set([
  "resource_item",
  "content_file",
  "content_video",
  "article",
  "quote_block",
  "team-member",
]);

const included = showAll
  ? new Set(components.map((c) => c.name))
  : CONTENT_TYPES;

// --- Validation (warnings to stderr) ---
let warnings = 0;

for (const ds of datasources) {
  for (const entry of ds.entries) {
    if (entry.name !== entry.name.trim()) {
      console.error(
        `⚠  [${ds.name}] entry "${entry.name}" has leading/trailing whitespace`,
      );
      warnings++;
    }
    if (entry.value !== entry.value.trim()) {
      console.error(
        `⚠  [${ds.name}] entry value "${entry.value}" has leading/trailing whitespace`,
      );
      warnings++;
    }
  }

  // Heuristic: if most values look like display labels (contain spaces or capitals)
  // but names look like slugs (lowercase-hyphenated), flag the convention mismatch.
  const valuesLookLikeLabels = ds.entries.filter((e) =>
    /[A-Z\s&]/.test(e.value),
  ).length;
  const namesLookLikeSlugs = ds.entries.filter((e) =>
    /^[a-z][a-z0-9-]*$/.test(e.name.trim()),
  ).length;
  if (
    ds.entries.length > 0 &&
    valuesLookLikeLabels / ds.entries.length > 0.5 &&
    namesLookLikeSlugs / ds.entries.length > 0.5
  ) {
    console.error(
      `⚠  [${ds.name}] name/value convention looks swapped — names appear to be slugs, values appear to be display labels. Storyblok convention: name = display label, value = stored key.`,
    );
    warnings++;
  }
}

if (warnings > 0) {
  console.error("");
}

// --- Diagram generation ---

const ER_TYPE = {
  text: "string",
  textarea: "string",
  richtext: "richtext",
  asset: "asset",
  multilink: "url",
  option: "string",
  options: "string[]",
  datetime: "datetime",
  boolean: "boolean",
  number: "int",
};

function ident(name) {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, "_");
}

function safeAttr(str) {
  // Mermaid ER attribute names: letters, numbers, underscores only
  return str
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/^_+|_+$/g, "");
}

const entityLines = [];
const relationshipLines = [];

for (const comp of components) {
  if (!included.has(comp.name)) continue;
  const entity = ident(comp.name);
  const fields = Object.entries(comp.schema ?? {});

  const attrs = [];
  for (const [key, field] of fields) {
    if (field.type === "bloks") continue;
    const type = ER_TYPE[field.type] ?? field.type;
    const comment = field.required ? ' "required"' : "";
    attrs.push(`    ${type} ${key}${comment}`);
  }

  entityLines.push(`  ${entity} {`);
  entityLines.push(...attrs);
  entityLines.push(`  }`);
  entityLines.push("");

  // bloks → nested block relationships
  for (const [key, field] of fields) {
    if (field.type !== "bloks") continue;
    const whitelist = (field.component_whitelist ?? []).filter((t) =>
      included.has(t),
    );
    const multiChoice = whitelist.length > 1 && field.maximum === 1;
    for (const target of whitelist) {
      const left = (field.minimum ?? 0) >= 1 ? "||" : "o|";
      // Multiple choices with max 1 → each type is individually optional (o|)
      const right = multiChoice ? "o|" : field.maximum === 1 ? "||" : "o{";
      relationshipLines.push(
        `  ${entity} ${left}--${right} ${ident(target)} : "${key}"`,
      );
    }
  }

  // option/options with story source → story reference
  for (const [key, field] of fields) {
    if (field.source !== "internal_stories") continue;
    for (const target of field.filter_content_type ?? []) {
      if (!included.has(target)) continue;
      const right = field.type === "options" ? "o{" : "o|";
      relationshipLines.push(
        `  ${entity} }o--${right} ${ident(target)} : "${key}"`,
      );
    }
  }

  // option/options with datasource source → datasource entity (only with --datasources)
  if (showDatasources) {
    for (const [key, field] of fields) {
      if (field.source !== "internal" || !field.datasource_slug) continue;
      const ds = datasources.find((d) => d.slug === field.datasource_slug);
      if (!ds) continue;
      const right = field.type === "options" ? "o{" : "o|";
      relationshipLines.push(
        `  ${entity} }o--${right} ${ident(ds.name)} : "${key}"`,
      );
    }
  }
}

// Datasource entities — show valid values as enum-style attributes (only with --datasources)
if (showDatasources) {
  const usedDatasources = new Set();
  for (const comp of components) {
    if (!included.has(comp.name)) continue;
    for (const field of Object.values(comp.schema ?? {})) {
      if (field.source === "internal" && field.datasource_slug) {
        const ds = datasources.find((d) => d.slug === field.datasource_slug);
        if (ds) usedDatasources.add(ds.name);
      }
    }
  }

  for (const dsName of usedDatasources) {
    const ds = datasources.find((d) => d.name === dsName);
    if (!ds) continue;
    const entity = ident(ds.name);

    entityLines.push(`  ${entity} {`);
    for (const entry of ds.entries) {
      const attr = safeAttr(entry.value) || safeAttr(entry.name);
      const label = entry.name.trim();
      entityLines.push(`    string ${attr} "${label}"`);
    }
    entityLines.push(`  }`);
    entityLines.push("");
  }
}

const output = [
  "```mermaid",
  "erDiagram",
  "",
  ...entityLines,
  ...relationshipLines,
  "```",
].join("\n");

console.log(output);
