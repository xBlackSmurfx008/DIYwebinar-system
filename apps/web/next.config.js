const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../.."),
  },
  transpilePackages: ["@platform/db"],
};

module.exports = nextConfig;
