"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { Loader2 } from "lucide-react";

interface GoogleUserData {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

interface GoogleLoginButtonProps {
  onSuccess?: (credential: string, userData?: GoogleUserData) => void;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
  className?: string;
  disabled?: boolean;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showOneTap?: boolean;
  oneTapAutoPrompt?: boolean;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  onLoading,
  className = "",
  disabled = false,
  buttonText = "ادامه با گوگل",
  buttonVariant = "outline",
  size = "default",
  showOneTap = false,
  oneTapAutoPrompt = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // Tracks whether the GIS script is ready to use. A lazy initializer covers
  // the cached-script case (window.google already present from a previous
  // page visit), so the load effect below only needs to handle fresh loads.
  const [isGoogleReady, setIsGoogleReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.google),
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  // Guards against double-rendering the GIS button into the same container —
  // each renderButton call injects a NEW iframe, so this must run at most once
  // per mount (and the container must be cleared if it ever re-runs).
  const hasRenderedButton = useRef(false);
  const isMounted = useRef(true);

  // Safely parse JWT token containing potential UTF-8 strings
  const parseJwt = useCallback((token: string): GoogleUserData | null => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  }, []);

  // Handle GIS credential callback
  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      if (!response.credential) return;

      setIsLoading(true);
      onLoading?.(true);

      try {
        const userData = parseJwt(response.credential);
        onSuccess?.(response.credential, userData || undefined);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to process login";
        onError?.(errorMessage);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
          onLoading?.(false);
        }
      }
    },
    [onSuccess, onError, onLoading, parseJwt]
  );

  // Prompt One Tap
  const promptOneTap = useCallback(() => {
    if (!window.google || !isMounted.current) return;

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log("One Tap not displayed:", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log("One Tap skipped moment");
        }
      });
    } catch (error) {
      console.error("Failed to prompt One Tap:", error);
    }
  }, []);

  // Initialize Google Sign-In SDK
  const initializeGoogleSignIn = useCallback(() => {
    if (
      !isMounted.current ||
      !window.google ||
      !buttonContainerRef.current
    ) {
      return;
    }

    const clientId = config.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("Google Client ID is not configured");
      onError?.("Google Client ID is not configured");
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: "signin",
        itp_support: true,
        // Required by newer Chrome builds (FedCM) so the One-Tap prompt works.
        use_fedcm_for_prompt: true,
      });

      // Render the real GIS button exactly once per mount.
      if (!hasRenderedButton.current && buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = "";
        // GIS width is numeric px; measure the container so the button fits.
        const containerWidth = buttonContainerRef.current.offsetWidth || 326;
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: containerWidth,
          locale: "fa",
        });
        hasRenderedButton.current = true;
      }

      setIsInitialized(true);

      if (showOneTap && oneTapAutoPrompt) {
        const timer = setTimeout(() => {
          if (isMounted.current && window.google) {
            promptOneTap();
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Failed to initialize Google Sign-In:", error);
      onError?.("Failed to initialize Google Sign-In");
    }
  }, [handleCredentialResponse, onError, showOneTap, oneTapAutoPrompt, promptOneTap]);

  // Load the Google GIS script dynamically with deduplication.
  // NOTE: the cached-script case (window.google already exists) is handled by
  // the isGoogleReady lazy initializer — this effect only manages fresh loads.
  useEffect(() => {
    isMounted.current = true;

    if (typeof window === "undefined" || window.google) {
      return;
    }

    const scriptUrl = "https://accounts.google.com/gsi/client";
    let script = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      if (isMounted.current) setIsGoogleReady(true);
    };

    const handleError = () => {
      if (isMounted.current) onError?.("Failed to load Google authentication service");
    };

    // If the script tag exists and already finished loading (e.g. mounted by
    // another component instance), treat it as ready right away.
    if (script.getAttribute("data-loaded") === "true") {
      // Async microtask keeps this out of the sync-setState-in-effect path.
      const raf = requestAnimationFrame(handleLoad);
      return () => {
        isMounted.current = false;
        cancelAnimationFrame(raf);
      };
    }

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      isMounted.current = false;
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, [onError]);

  // Trigger setup once GIS script is ready
  useEffect(() => {
    if (!isGoogleReady) return;

    const timer = setTimeout(() => {
      if (isMounted.current && window.google) {
        initializeGoogleSignIn();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isGoogleReady, initializeGoogleSignIn]);

  // Fallback trigger handler — used only when the real GIS button has not
  // mounted yet. Once it mounts, the container becomes visible and takes over.
  const handleManualSignIn = useCallback(async () => {
    if (!window.google) {
      onError?.("Google authentication service is not available");
      return;
    }

    if (!isInitialized) {
      initializeGoogleSignIn();
      // Give GIS a moment to mount its iframe before showing the container.
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (isInitialized || hasRenderedButton.current) {
      // The real button has replaced the fallback.
      return;
    }

    if (showOneTap) {
      promptOneTap();
    }
  }, [isInitialized, initializeGoogleSignIn, promptOneTap, showOneTap, onError]);

  return (
    <div className="relative w-full">
      {/* Target element where GIS mounts its button — must stay in layout
          (never display:none) so the iframe measures a real size. */}
      <div
        ref={buttonContainerRef}
        className={`w-full min-h-[44px] ${className}`}
      />

      {/* Fallback overlay while GIS is not ready, or while disabled —
          covers the GIS button instead of stacking below it. */}
      {(!isInitialized || disabled) && (
        <div className="absolute inset-0">
          <Button
            type="button"
            variant={buttonVariant}
            size={size}
            className="h-full w-full"
            onClick={handleManualSignIn}
            disabled={disabled || isLoading}
          >
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال اتصال...
            </>
          ) : (
            <>
              <svg
                className="ml-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {buttonText}
            </>
          )}
          </Button>
        </div>
      )}
    </div>
  );
};

// Global Google API Type Definition
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
            itp_support?: boolean;
            /** Required by newer Chrome builds (FedCM) for the One-Tap prompt. */
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              text?: "signin_with" | "signup_with" | "continue_with" | "continue_as";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
            }
          ) => void;
          prompt: (
            callback: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              getNotDisplayedReason: () => string;
            }) => void
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}