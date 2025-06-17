import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⭐ QUAN TRỌNG: Enable standalone cho Docker
  output: 'standalone',
  
  // Tối ưu images cho production
  images: {
    domains: [
      'images.unsplash.com',
      'assets.aceternity.com',
      'img.clerk.com', // Clerk avatars
    ],
    // Giữ optimized cho production
    unoptimized: false,
  },

  // Enable compression
  compress: true,

  // Tối ưu cho production
  experimental: {
    // Optimized package imports
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs'
    ],
  },

  // Webpack config tùy chỉnh cho Docker
  webpack: (config, { isServer }) => {
    // Tối ưu bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },

  // Headers bảo mật cho production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;