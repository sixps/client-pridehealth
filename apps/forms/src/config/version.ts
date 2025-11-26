const FALLBACK_VERSION = typeof process !== 'undefined'
  ? process.env.NEXT_PUBLIC_APP_VERSION
    || process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.DIGITALOCEAN_APP_REVISION
    || process.env.APP_VERSION
    || ''
  : '';

export const APP_VERSION = FALLBACK_VERSION
  || (process.env.NODE_ENV === 'development'
    ? 'dev-local'
    : `build-${new Date().toISOString()}`);

export const BUILD_TIMESTAMP = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
  || process.env.BUILD_TIMESTAMP
  || new Date().toISOString();


