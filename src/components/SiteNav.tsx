import { Link } from "@tanstack/react-router";

const TABS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/leads", label: "Leads" },
] as const;

export function SiteNav() {
  return (
    <nav aria-label="Main" className="border-b bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-6 py-3">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
          <span className="kinetiq-word">Kinetiq</span><span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: true }}
              activeProps={{ className: "ring-2 ring-crimson ring-offset-2 ring-offset-card" }}
              className="rounded-md bg-crimson px-4 py-1.5 text-crimson-foreground shadow-md transition hover:brightness-110">
              {t.label}
            </Link>
          ))}
        </div>
        <Link to="/join" activeProps={{ className: "ring-2 ring-crimson ring-offset-2 ring-offset-card" }}
          className="ml-auto rounded-md bg-crimson px-4 py-1.5 text-sm font-semibold text-crimson-foreground shadow-md transition hover:brightness-110">
          Join
        </Link>
      </div>
    </nav>
  );
}
