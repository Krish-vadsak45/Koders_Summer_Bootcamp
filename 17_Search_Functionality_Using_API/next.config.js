/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Koders_Summer_Bootcamp";
const projectPath = "17_Search_Functionality_Using_API";
const githubPagesBasePath = `/${repoName}/${projectPath}`;
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages ? `${githubPagesBasePath}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
}
export default nextConfig;