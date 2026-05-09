import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
  site: "https://seasideheritage.org.uk/",
  redirects: {
    "/bucket-spade-list/": "/bucket-spade-list/top-ten-winners-2025/",
  },
  image: {
    domains: ["astro.build"],
  },
  output: "server",
  adapter: netlify({ imageCDN: false }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      bridge: import.meta.env.DEV,
      components: {
        // Content types
        page: "storyblok/Page",
        contact: "storyblok/Contact",
        eventList: "storyblok/EventList",
        event: "storyblok/Event",
        missionValues: "storyblok/MissionValues",
        teamMembersList: "storyblok/TeamMembersList",
        teamMember: "storyblok/TeamMember",
        featuredEvents: "storyblok/FeaturedEvents",
        topTenList: "storyblok/TopTenList",
        topTen: "storyblok/TopTenItem",
        topTenNominationsList: "storyblok/TopTenNominationsList",
        nominee: "storyblok/Nominee",
        voteCallout: "storyblok/VoteCallout",

        // Heroes
        hero: "storyblok/Heroes/Hero",
      },
    }),
    icon({
      include: {
        tabler: [
          "brand-instagram",
          "brand-linkedin",
          "brand-x",
          "brand-youtube",
          "chevron-down",
          "circle-number-1",
          "circle-number-2",
          "circle-number-3",
          "circle-number-4",
          "clock",
          "mail",
          "map-pin",
          "number-1-small",
          "number-2-small",
          "number-3-small",
          "number-4-small",
          "number-5-small",
          "number-6-small",
          "number-7-small",
          "number-8-small",
          "number-9-small",
          "number-10-small",
        ],
      },
    }),
  ],
});
