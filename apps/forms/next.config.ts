import type { NextConfig } from "next";

const resolveBuildVersion = () => {
  const existingVersion = process.env.NEXT_PUBLIC_APP_VERSION
    || process.env.APP_VERSION
    || process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.DIGITALOCEAN_APP_REVISION;

  return existingVersion || `build-${new Date().toISOString()}`;
};

const buildVersion = resolveBuildVersion();
const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString();

process.env.NEXT_PUBLIC_APP_VERSION = buildVersion;
process.env.APP_VERSION = buildVersion;
process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = buildTimestamp;
process.env.BUILD_TIMESTAMP = buildTimestamp;

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_APP_VERSION: buildVersion,
    APP_VERSION: buildVersion,
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    BUILD_TIMESTAMP: buildTimestamp,
  },
  
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
