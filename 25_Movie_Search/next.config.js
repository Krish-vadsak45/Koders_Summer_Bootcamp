/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Koders_Summer_Bootcamp/17_Search_Functionality_Using_API',
  assetPrefix: '/Koders_Summer_Bootcamp/17_Search_Functionality_Using_API',
  trailingSlash: true,
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