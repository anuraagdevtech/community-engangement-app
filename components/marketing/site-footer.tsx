export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Mohalla. Built for one pincode at a time.</p>
        <p className="font-mono">500m – 5km</p>
      </div>
    </footer>
  );
}
