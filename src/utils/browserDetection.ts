/**
 * Browser Detection Utility
 * Detects if the app is running in an embedded browser (WebView)
 * like those used by social media apps (Snapchat, Instagram, Facebook, etc.)
 */

/**
 * Checks if the current browser is an embedded user-agent (WebView)
 * that may block OAuth providers like Google
 */
export function isEmbeddedBrowser(): boolean {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Check for common embedded browser patterns
  const embeddedBrowserPatterns = [
    // Social Media In-App Browsers
    /\bSnapchat\b/i, // Snapchat
    /\bInstagram\b/i, // Instagram
    /\bFBAV\b/i, // Facebook App
    /\bFBAN\b/i, // Facebook Analytics (Facebook App)
    /\bFB_IAB\b/i, // Facebook In-App Browser
    /\bFBIOS\b/i, // Facebook iOS
    /\bTwitter\b/i, // Twitter
    /\bLine\b/i, // Line messenger
    /\bWhatsApp\b/i, // WhatsApp
    /\bTikTok\b/i, // TikTok
    /\bWeChat\b/i, // WeChat

    // Generic WebView patterns
    /\bwv\b/i, // WebView
    /\bWebView\b/i,

    // LinkedIn In-App Browser
    /\bLinkedInApp\b/i,
  ];

  // Check if any pattern matches
  return embeddedBrowserPatterns.some((pattern) => pattern.test(userAgent));
}

/**
 * Gets the name of the detected embedded browser
 */
export function getEmbeddedBrowserName(): string {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/Snapchat/i.test(userAgent)) return "Snapchat";
  if (/Instagram/i.test(userAgent)) return "Instagram";
  if (/FBAV|FBAN|FB_IAB|FBIOS/i.test(userAgent)) return "Facebook";
  if (/Twitter/i.test(userAgent)) return "Twitter";
  if (/Line/i.test(userAgent)) return "Line";
  if (/WhatsApp/i.test(userAgent)) return "WhatsApp";
  if (/TikTok/i.test(userAgent)) return "TikTok";
  if (/WeChat/i.test(userAgent)) return "WeChat";
  if (/LinkedInApp/i.test(userAgent)) return "LinkedIn";

  return "this app";
}

/**
 * Opens the current URL in the device's default browser
 */
export function openInDefaultBrowser(): void {
  const currentUrl = window.location.href;

  // Try to open in default browser
  // This works on most mobile devices
  window.open(currentUrl, "_blank");

  // Also set location as fallback
  window.location.href = currentUrl;
}

/**
 * Gets the user's device type
 */
export function getDeviceType(): "ios" | "android" | "desktop" {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  return "desktop";
}

/**
 * Gets instructions for opening in default browser based on device
 */
export function getOpenInBrowserInstructions(): string {
  const deviceType = getDeviceType();
  const browserName = getEmbeddedBrowserName();

  if (deviceType === "ios") {
    return `Tap the Share button (↗) in ${browserName} and select "Open in Safari"`;
  } else if (deviceType === "android") {
    return `Tap the menu (⋮) in ${browserName} and select "Open in Browser" or "Open in Chrome"`;
  }

  return `Please open this link in your default browser (Chrome, Safari, Edge, etc.)`;
}
