/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
        protocol: "https",
      },
      {
        hostname: "fal.media",
        protocol: "https",
      },
      {
        hostname: "v3.fal.media",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
