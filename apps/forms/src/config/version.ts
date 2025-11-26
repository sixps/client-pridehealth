declare global {
  var __PRIDE_APP_VERSION__: string | undefined;
  var __PRIDE_BUILD_TIMESTAMP__: string | undefined;
}

const FALLBACK_VERSION = typeof process !== 'undefined'
  ? process.env.NEXT_PUBLIC_APP_VERSION
    || process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.DIGITALOCEAN_APP_REVISION
    || process.env.APP_VERSION
    || ''
  : '';

type StableRuntimeKey = '__PRIDE_APP_VERSION__' | '__PRIDE_BUILD_TIMESTAMP__';

const getStableRuntimeValue = (key: StableRuntimeKey, factory: () => string) => {
  if (typeof globalThis === 'undefined') {
    return factory();
  }

  const globalRef = globalThis as typeof globalThis & Record<StableRuntimeKey, string | undefined>;

  if (!globalRef[key]) {
    globalRef[key] = factory();
  }

  return globalRef[key] as string;
};

export const APP_VERSION = FALLBACK_VERSION
  || (process.env.NODE_ENV === 'development'
    ? 'dev-local'
    : getStableRuntimeValue('__PRIDE_APP_VERSION__', () => `build-${new Date().toISOString()}`));

export const BUILD_TIMESTAMP = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
  || process.env.BUILD_TIMESTAMP
  || getStableRuntimeValue('__PRIDE_BUILD_TIMESTAMP__', () => new Date().toISOString());


