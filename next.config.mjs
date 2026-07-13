/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint errors during build — lint is run separately in CI
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (JS-only project)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
