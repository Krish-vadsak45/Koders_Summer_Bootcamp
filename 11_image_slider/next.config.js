/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/11_image_slider',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
