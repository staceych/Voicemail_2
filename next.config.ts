import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // This comment tells TypeScript to ignore the error on the next line
  // @ts-ignore
  devIndicators: {
    allowedDevOrigins: [
      'https://9005-firebase-voicemail-1759275501863.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;