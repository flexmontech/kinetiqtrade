import { Link } from "@tanstack/react-router";

const TABS = [
  { to: "/", label: "Home" },
  { to: "/leads", label: "Leads" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  return (
    <nav aria-label="Main" className="border-b bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 px-6 py-3">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
          <span className="kinetiq-word">Kinetiq</span><span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-1 text-sm font-semibold">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: true }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
              className="rounded-md px-3 py-1.5 transition-colors">
              {t.label}
            </Link>
          ))}
        </div>
        <Link to="/join" className="ml-auto rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90">
          Join
        </Link>
      </div>
    </nav>
  );
}
