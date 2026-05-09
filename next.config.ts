/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export', // Required for static export
  basePath: isProd ? '/zerobg' : '', // Sets the subpath for production
  assetPrefix: isProd ? '/zerobg/' : '', // Ensures assets load from the correct path
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js default Image Optimization
  },
  allowedDevOrigins: ["192.168.1.5:3000"], 
};

export default nextConfig;
