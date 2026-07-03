"use client";

import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};

type GoogleButtonText = "continue_with" | "signin_with" | "signup_with";

type GoogleLoginButtonProps = {
  onCredential: (credential: string) => void | Promise<void>;
  text?: GoogleButtonText;
  locale?: "en" | "vi";
  disabled?: boolean;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: GoogleButtonText;
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: number;
              locale?: string;
            },
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

let googleScriptPromise: Promise<void> | null = null;

const loadGoogleScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google login can only run in the browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Could not load Google login.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google login."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

export default function GoogleLoginButton({
  onCredential,
  text = "continue_with",
  locale = "vi",
  disabled = false,
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(320);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  // Handle dynamic width updates on mount and resize
  useEffect(() => {
    if (!buttonRef.current) return;

    const updateWidth = () => {
      if (buttonRef.current) {
        // Use parent width to fill the column correctly
        const parentWidth = buttonRef.current.parentElement?.parentElement?.offsetWidth;
        const currentWidth = parentWidth || buttonRef.current.offsetWidth || 320;
        // Google button width constraints are 200px - 400px
        setContainerWidth(Math.min(Math.max(currentWidth, 200), 400));
      }
    };

    updateWidth();

    // Call after a short timeout for layout animations to finish
    const timer = setTimeout(updateWidth, 150);

    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderGoogleButton() {
      if (disabled) return;

      if (!GOOGLE_CLIENT_ID) {
        setError("Google Client ID is not configured.");
        return;
      }

      try {
        await loadGoogleScript();

        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response.credential) {
              setError("Google did not return a credential.");
              return;
            }

            setError(null);
            setIsLoading(true);
            try {
              await onCredentialRef.current(response.credential);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Google login failed.");
            } finally {
              setIsLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "pill",
          logo_alignment: "left",
          width: containerWidth,
          locale,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Google login failed.");
        }
      }
    }

    renderGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [disabled, locale, text, containerWidth]);

  return (
    <div className="space-y-2 w-full flex flex-col items-center justify-center">
      <div className="relative min-h-[44px] w-full flex items-center justify-center">
        <div 
          ref={buttonRef} 
          className={`w-full flex justify-center ${disabled ? "pointer-events-none opacity-50" : ""}`} 
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full border border-stone-200 bg-white/80 backdrop-blur-sm">
            <span className="h-4 w-4 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-center font-sans text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
