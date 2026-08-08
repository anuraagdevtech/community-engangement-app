"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface PhoneAuthFormProps {
  mode: "login" | "signup";
  name?: string;
}

export function PhoneAuthForm({ mode, name }: PhoneAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = React.useState("+91 ");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"phone" | "otp">("phone");
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const cleanPhone = phone.replace(/[\s-]/g, "");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone: cleanPhone,
      options: mode === "signup" && name ? { data: { display_name: name } } : undefined,
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    setStatus("idle");
    setStep("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ phone: cleanPhone, token: code, type: "sms" });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    const next = searchParams.get("next") ?? "/feed";
    router.replace(next);
    router.refresh();
  }

  if (step === "otp") {
    return (
      <form onSubmit={verifyOtp} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <div className="flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="h-6 w-6 text-secondary" />
          <p className="text-sm text-muted-foreground">
            Enter the code we texted to <span className="font-medium text-foreground">{cleanPhone}</span>
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="otp">6-digit code</Label>
          <Input
            id="otp"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="123456"
            className="text-center text-lg tracking-[0.5em]"
            maxLength={6}
            autoFocus
            required
          />
        </div>
        {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
        <Button type="submit" size="lg" disabled={status === "loading" || code.length < 6}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Verify &amp; continue
        </Button>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
          }}
          className="text-center text-xs text-muted-foreground hover:underline"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendOtp} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-soft">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          required
        />
        <p className="text-xs text-muted-foreground">Include your country code.</p>
      </div>
      {status === "error" && <p className="text-sm text-destructive">{errorMsg}</p>}
      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
        Send me a code
      </Button>
    </form>
  );
}
