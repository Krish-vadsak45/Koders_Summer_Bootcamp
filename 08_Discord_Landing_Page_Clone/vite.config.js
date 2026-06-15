import { defineConfig } from "vite";

export default defineConfig({
  // This ensures assets are linked correctly when hosted at /Koders_Summer_Bootcamp/08_Discord_Landing_Page_Clone/
  base:
    process.env.GITHUB_PAGES === "true"
      ? "/Koders_Summer_Bootcamp/08_Discord_Landing_Page_Clone/"
      : "/",
  build: {
    outDir: "dist",
  },
});
