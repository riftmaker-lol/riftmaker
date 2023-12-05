// import './env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'http',
        hostname: 'demo.st-marron.info',
      },
    ],
  },
  reactStrictMode: false,
  output: 'standalone',
};

export default nextConfig;
