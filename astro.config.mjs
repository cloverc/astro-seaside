import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import storyblok from "@storyblok/astro";
import { loadEnv } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
  site: "https://seasideheritage.org.uk/",
  redirects: {
    "/bucket-spade-list/": "/bucket-spade-list/top-ten-winners-2023/",
  },
  image: {
    domains: ["astro.build"],
  },
  output: "server",
  adapter: netlify({ imageCDN: false }),
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
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
    tailwind({
      applyBaseStyles: false,
    }),
    icon({
      include: {
        tabler: ["*"],
      },
    }),
  ],
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
});
