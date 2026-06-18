import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'Koders_Summer_Bootcamp';
const projectPath = '11_Image_Slider';
const githubPagesBasePath = `/${repoName}/${projectPath}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isGithubPages ? githubPagesBasePath : undefined,
  assetPrefix: isGithubPages ? `${githubPagesBasePath}/` : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
