const ROWS = [
  { dimension: "Reach", whatsapp: "Whoever's phone number you have", mohalla: "Anyone in a geo-radius, gated or open street" },
  { dimension: "Structure", whatsapp: "One noisy thread, unsearchable", mohalla: "Typed channels — Safety, Buy/Sell, Services, Events" },
  { dimension: "Trust", whatsapp: "None — anyone added by anyone", mohalla: "Tiered: GPS-verified → neighbour-vouched → KYC" },
  { dimension: "Useful action", whatsapp: "None — Google Pay screenshots", mohalla: "Bookings, escrowed sales, verified announcements" },
];

export function Comparison() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-8 max-w-lg">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">Why not just a WhatsApp group?</p>
        <h2 className="font-display text-3xl font-semibold">Because a chat thread isn&apos;t a directory</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Dimension</th>
              <th className="px-5 py-3">WhatsApp groups</th>
              <th className="px-5 py-3 text-primary">Mohalla</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.dimension} className="border-b border-border last:border-none">
                <td className="px-5 py-3.5 font-medium">{row.dimension}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{row.whatsapp}</td>
                <td className="px-5 py-3.5 font-medium text-foreground">{row.mohalla}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
