/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Admin image uploads (4 MB max, enforced in the action) plus form overhead.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
