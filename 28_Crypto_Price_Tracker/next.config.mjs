const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Koders_Summer_Bootcamp";
const projectPath = "28_Crypto_Price_Tracker";
const githubPagesBasePath = `/${repoName}/${projectPath}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // <--- THIS IS CRITICAL to create the 'out' folder
  trailingSlash: true,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages ? `${githubPagesBasePath}/` : undefined,
};

export default nextConfig;
