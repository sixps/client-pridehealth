'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { FormWizard } from '@/components/ui/FormWizard';
import { sampleForm } from '@/data/sample-form';
import { FormSubmissionData } from '@/types/form';
import { APP_VERSION } from '@/config/version';

const VERSION_POLL_INTERVAL = 60_000;

export default function Home() {
  const [isDevBannerVisible, setIsDevBannerVisible] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState(APP_VERSION);
  const [versionPollError, setVersionPollError] = useState<string | null>(null);

  const shortVersion = useMemo(() => {
    if (!APP_VERSION) return 'dev';
    if (APP_VERSION.startsWith('dev')) return 'dev';
    return APP_VERSION.substring(0, 8);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const pollVersion = async () => {
      try {
        const response = await fetch(`/api/version?ts=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!response.ok || !isSubscribed) {
          return;
        }
        const data = await response.json();
        if (data?.version && data.version !== APP_VERSION) {
          setLatestVersion(data.version);
          setIsUpdateAvailable(true);
        }
        setVersionPollError(null);
      } catch (error) {
        console.error('Version poll failed', error);
        if (isSubscribed) {
          setVersionPollError('Unable to check for updates');
        }
      }
    };

    pollVersion();
    const interval = setInterval(pollVersion, VERSION_POLL_INTERVAL);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const handleFormSubmit = async (data: FormSubmissionData) => {
    console.log('Form submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert('Form submitted successfully! Check the console for submitted data.');
  };

  return (
    <div className="min-h-screen bg-white">
      {isDevBannerVisible && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm">
          <div className="max-w-5xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="flex items-center gap-2 leading-snug">
              <span role="img" aria-label="warning">
                🚧
              </span>
              Development preview build. Data can reset and features may change.
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-amber-800">build: {APP_VERSION}</span>
              <button
                type="button"
                onClick={() => setIsDevBannerVisible(false)}
                className="text-amber-800 hover:text-amber-600 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white border-b border-gray-100 sticky top-0 z-40"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.img
                src="/pride-health-logo.jpeg"
                alt="Pride Health"
                className="h-12 w-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              />
              <div className="text-xs uppercase tracking-widest text-gray-500">
                Development Mode
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-2 text-xs font-medium rounded-full bg-gray-50 px-3 py-1 text-gray-600"
            >
              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure preview
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <FormWizard form={sampleForm} onSubmit={handleFormSubmit} />
        </div>
      </main>

      {isUpdateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">
              New build available
            </p>
            <p className="text-xs text-gray-600">
              You are running <span className="font-mono">{shortVersion}</span>. Refresh to switch to{' '}
              <span className="font-mono">{latestVersion?.substring(0, 8)}</span>.
            </p>
            <div className="flex items-center gap-3">
              <button
                className="flex-1 rounded-full bg-gray-900 text-white text-xs py-2"
                onClick={() => window.location.reload()}
              >
                Refresh now
              </button>
              <button
                className="text-xs text-gray-500"
                onClick={() => setIsUpdateAvailable(false)}
              >
                Later
              </button>
            </div>
            {versionPollError && (
              <p className="text-xs text-red-500">{versionPollError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
