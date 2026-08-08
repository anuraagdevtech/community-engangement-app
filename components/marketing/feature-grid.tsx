import { Home, Wrench, Users, ShoppingBag } from "lucide-react";

const FEATURES = [
  {
    icon: Home,
    title: "Neighbourhood Feed",
    description: "Typed channels — Safety, Buy & Sell, Lost & Found, Events — instead of one noisy chat thread.",
    color: "#2c6e63",
  },
  {
    icon: Wrench,
    title: "Local Services",
    description: "Verified plumbers, doctors, tutors, and temples — booked or lead-gen, reviewed by real neighbours.",
    color: "#c65a24",
  },
  {
    icon: Users,
    title: "Interest Circles",
    description: "Sports, hobbies, and support groups matched by radius, with quorum-based meetup scheduling.",
    color: "#5b6bc0",
  },
  {
    icon: ShoppingBag,
    title: "Micro-Marketplace",
    description: "Buy, sell, and find flatmates nearby, with Safe Pay escrow for anything above ₹2,000.",
    color: "#b98a1f",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-lg">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-primary">Four modules, one trust graph</p>
        <h2 className="font-display text-3xl font-semibold">Everything your street already needed</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${f.color}1a`, color: f.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
