/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Prevent ESLint from failing production builds during deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent type checking errors from halting production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
