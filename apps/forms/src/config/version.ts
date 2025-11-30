const resolveAppVersion = () => {
  if (typeof process === 'undefined') {
    return 'unknown';
  }

  const envVersion = process.env.NEXT_PUBLIC_APP_VERSION
    || process.env.APP_VERSION
    || process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.DIGITALOCEAN_APP_REVISION;

  if (envVersion) {
    return envVersion;
  }

  return process.env.NODE_ENV === 'development' ? 'dev-local' : 'unknown';
};

const resolveBuildTimestamp = () => {
  if (typeof process === 'undefined') {
    return new Date().toISOString();
  }

  return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP
    || process.env.BUILD_TIMESTAMP
    || new Date().toISOString();
};

export const APP_VERSION = resolveAppVersion();
export const BUILD_TIMESTAMP = resolveBuildTimestamp();


