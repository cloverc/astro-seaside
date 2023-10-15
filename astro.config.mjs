import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";
import storyblok from "@storyblok/astro";
import { loadEnv } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
  // output: "server",
  // adapter: netlify(),
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      // apiOptions: {
      //   cache: { clear: "auto", type: "memory" },
      // },
      components: {
        // Content types
        page: "storyblok/Page",
        feature: "storyblok/Feature",
        eventList: "storyblok/EventList",
        event: "storyblok/Event",
        teamMembersList: "storyblok/TeamMembersList",
        teamMember: "storyblok/TeamMember",
        featuredEvents: "storyblok/FeaturedEvents",

        // Heroes
        hero: "storyblok/Heroes/Hero",

        //components
        button: "storyblok/Button",
      },
      apiOptions: {
        region: "",
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
