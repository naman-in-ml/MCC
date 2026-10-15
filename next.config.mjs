/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  eslint: {
    // Prevent ESLint from failing production builds during deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevent type checking errors from halting production builds
    ignoreBuildErrors: true,
=======
  experimental: {
    cpus: 1,
>>>>>>> d388acd7d9c13d47f4f611ec471fadaa4d324bd5
  },
};

export default nextConfig;
