import {
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  getEmbeddedBrowserName,
  openInDefaultBrowser,
  getOpenInBrowserInstructions,
} from "@/utils/browserDetection";
import { Button } from "@/components/ui/button";

interface EmbeddedBrowserWarningProps {
  className?: string;
}

export function EmbeddedBrowserWarning({
  className = "",
}: EmbeddedBrowserWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const browserName = getEmbeddedBrowserName();
  const instructions = getOpenInBrowserInstructions();

  if (isDismissed) return null;

  return (
    <div
      className={`relative bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-3 ${className}`}
    >
      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200 transition-colors z-10"
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Compact view */}
      <div className="pr-6">
        <div className="flex items-start gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              Google Sign-In Not Available in {browserName}
            </p>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
              Use <strong>email & password</strong> or open in your browser.
            </p>
          </div>
        </div>

        {/* Action buttons - always visible */}
        <div className="flex gap-2 mb-2">
          <Button
            onClick={openInDefaultBrowser}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white text-xs h-8"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open in Browser
          </Button>

          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            size="sm"
            variant="outline"
            className="border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 text-xs h-8"
          >
            📋 Copy
          </Button>
        </div>

        {/* Expandable details */}
        {isExpanded && (
          <div className="space-y-2 mt-3 pt-3 border-t border-yellow-300 dark:border-yellow-700">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">
                📱 How to open in your browser:
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded p-2">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  {instructions}
                </p>
              </div>
            </div>

            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              💡 <strong>Quick tip:</strong> Email & password login works
              perfectly in {browserName}!
            </p>
          </div>
        )}

        {/* Show more/less button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 transition-colors mt-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Show instructions
            </>
          )}
        </button>
      </div>
    </div>
  );
}
