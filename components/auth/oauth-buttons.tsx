"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon, FacebookIcon } from "@/components/auth/brand-icons";
import { createClient } from "@/lib/supabase/client";
import type { Provider } from "@supabase/supabase-js";

export function OAuthButtons() {
  const searchParams = useSearchParams();
  const [pending, setPending] = React.useState<Provider | null>(null);

  async function handleOAuth(provider: Provider) {
    setPending(provider);
    const supabase = createClient();
    const next = searchParams.get("next") ?? "/feed";
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // On success the browser navigates away to the provider; only errors return here.
    if (error) setPending(null);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleOAuth("google")}
        disabled={pending !== null}
      >
        {pending === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleOAuth("facebook")}
        disabled={pending !== null}
      >
        {pending === "facebook" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FacebookIcon className="h-4 w-4" />}
        Continue with Facebook
      </Button>
    </div>
  );
}
