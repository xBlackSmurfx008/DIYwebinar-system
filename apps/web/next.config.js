/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ["@platform/db"],
};

module.exports = nextConfig;
