import { useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[src*="recaptcha"]')) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isLoaded || !siteKey) {
      console.warn('reCAPTCHA not loaded or site key missing');
      return null;
    }

    try {
      return await new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            resolve(token);
          } catch (error) {
            console.error('reCAPTCHA execution error:', error);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    }
  };

  return {
    isLoaded,
    executeRecaptcha,
  };
}
