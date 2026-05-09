/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Required for Capacitor
  images: {
    unoptimized: true, // Required for Capacitor
  },
  // Move it here, out of experimental
  allowedDevOrigins: ["192.168.1.5:3000"], 
};

export default nextConfig;