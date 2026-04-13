/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@platform/db"],
  output: "standalone",
};

module.exports = nextConfig;
