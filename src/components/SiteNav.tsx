import { Link } from "@tanstack/react-router";

const TABS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/leads", label: "Sales Pipeline" },
  { to: "/audits", label: "Website Audits" },
] as const;

const tab = "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition";

export function SiteNav() {
  return (
    <nav aria-label="Main" className="border-b bg-card">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0 font-display text-xl font-extrabold tracking-tight">
          <span className="kinetiq-word">Kinetiq</span><span className="text-crimson">.</span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: true }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }}
              className={tab}>
              {t.label}
            </Link>
          ))}
        </div>
        <Link to="/join" className="shrink-0 rounded-md bg-crimson px-4 py-1.5 text-sm font-semibold text-crimson-foreground shadow-sm transition hover:brightness-105">
          Join
        </Link>
      </div>
    </nav>
  );
}
