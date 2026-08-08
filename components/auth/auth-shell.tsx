import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-secondary p-10 text-secondary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)",
          }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-foreground/15 font-display text-base font-bold">
            M
          </span>
          <span className="font-display text-lg font-semibold">Mohalla</span>
        </Link>
        <div className="relative z-10 max-w-sm">
          <p className="font-display text-3xl font-semibold leading-tight text-wrap-balance">
            The 500m–5km around you, finally organised.
          </p>
          <p className="mt-3 text-sm text-secondary-foreground/75">
            One feed, one directory, one marketplace — instead of six overlapping WhatsApp groups.
          </p>
        </div>
        <p className="relative z-10 text-xs text-secondary-foreground/60">
          Geo-verified · Moderated · Built for your street
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center lg:text-left">
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</p>
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>
    </div>
  );
}
