import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Koders_Summer_Bootcamp";
const projectPath = "04_Color_Picker_Tool";
const githubPagesBasePath = `/${repoName}/${projectPath}`;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages ? `${githubPagesBasePath}/` : undefined,
};

export default nextConfig;
