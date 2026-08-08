import type { Metadata } from "next";
import { NewProviderForm } from "@/components/services/new-provider-form";

export const metadata: Metadata = { title: "List a service" };

export default function NewProviderPage() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">Local Services</p>
        <h1 className="font-display text-2xl font-semibold">List a service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free while we&apos;re growing the directory — commissions only apply to in-app bookings later.
        </p>
      </div>
      <NewProviderForm />
    </div>
  );
}
