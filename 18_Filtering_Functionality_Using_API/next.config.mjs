/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  ...(process.env.GITHUB_PAGES ? {
    basePath: '/Koders_Summer_Bootcamp/18_Filtering_Functionality_Using_API',
    assetPrefix: '/Koders_Summer_Bootcamp/18_Filtering_Functionality_Using_API',
  } : {}),
}

export default nextConfig
