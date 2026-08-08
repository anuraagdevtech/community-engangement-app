"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface EmailAuthFormProps {
  mode: "login" | "signup";
  name?: string;
}

export function EmailAuthForm({ mode, name }: EmailAuthFormProps) {
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const next = searchParams.get("next") ?? "/feed";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        data: mode === "signup" && name ? { display_name: name } : undefined,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <PartyPopper className="h-8 w-8 text-primary" />
        <h2 className="font-display text-xl font-semibold">Check your inbox</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>. Open it on this
          device to continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-soft">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
      <Button type="submit" size="lg" disabled={status === "loading"} className="mt-1">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        {mode === "signup" ? "Send my sign-in link" : "Email me a sign-in link"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No password to remember — we&apos;ll email you a one-tap link.
      </p>
    </form>
  );
}
