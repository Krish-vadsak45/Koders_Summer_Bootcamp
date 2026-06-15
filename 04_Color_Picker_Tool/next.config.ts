import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Koders_Summer_Bootcamp"; 
const projectPath = "01_Simple_Digital_Clock"; // Change this for each folder
const githubPagesBasePath = `/${repoName}/${projectPath}`;

const nextConfig: NextConfig = {
  output: "export", // <--- THIS IS CRITICAL to create the 'out' folder
  trailingSlash: true,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages ? `${githubPagesBasePath}/` : undefined,
};

export default nextConfig;