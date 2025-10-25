/**
 * URL Validation and Sanitization Utilities
 * Prevents app crashes from invalid URLs
 */

/**
 * Validates if a string is a proper URL
 */
export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== "string") {
    return false;
  }

  try {
    const url = new URL(urlString);

    // Must be http or https
    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    // Must have a valid hostname
    if (!url.hostname || url.hostname.length < 3) {
      return false;
    }

    // Must have at least one dot in hostname (except localhost)
    if (url.hostname !== "localhost" && !url.hostname.includes(".")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL or returns a safe fallback
 */
export function sanitizeUrl(
  urlString: string,
  fallback: string = "https://example.com"
): string {
  if (isValidUrl(urlString)) {
    return urlString;
  }

  // Try to fix common issues
  if (urlString && !urlString.startsWith("http")) {
    const withProtocol = `https://${urlString}`;
    if (isValidUrl(withProtocol)) {
      return withProtocol;
    }
  }

  return fallback;
}

/**
 * Extracts domain from URL safely
 */
export function extractDomain(urlString: string): string | null {
  try {
    if (!isValidUrl(urlString)) {
      return null;
    }
    const url = new URL(urlString);
    return url.hostname;
  } catch {
    return null;
  }
}

/**
 * Gets a safe favicon URL
 */
export function getFaviconUrl(urlString: string): string {
  const domain = extractDomain(urlString);

  if (!domain) {
    // Return data URI fallback instead of external placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3ENo Preview%3C/text%3E%3C/svg%3E';
  }

  // Use Google's favicon service with fallback
  return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(
    `https://${domain}`
  )}&size=128`;
}

/**
 * Validates and cleans task data
 */
export function validateTaskUrl(url: string | undefined | null): string {
  if (!url) {
    return "https://example.com";
  }

  return sanitizeUrl(url);
}
