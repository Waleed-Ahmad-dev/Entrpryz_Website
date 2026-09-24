/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: './', // Forces Next.js to use relative paths for assets
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;