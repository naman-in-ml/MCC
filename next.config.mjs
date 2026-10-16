/** @type {import('next').NextConfig} */
process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
