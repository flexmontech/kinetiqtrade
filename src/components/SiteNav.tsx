import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";

const TABS = [
  { to: "/", label: "Home", tone: "home" },
  { to: "/leads", label: "Sales Pipeline", tone: "leads" },
  { to: "/audits", label: "Web Readiness", tone: "audits" },
  { to: "/scanner", label: "Find Prospects", tone: "scanner" },
] as const;

const tab = "tab-link whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition";

export function SiteNav() {
  return (
    <nav aria-label="Main" className="workspace-nav border-b bg-card">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="raise-logo shrink-0 font-display text-xl font-extrabold">
          <span className="kinetiq-word">Kinetiq</span><span className="text-crimson">.</span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: true }}
              className={tab}
              style={{ "--tab-c": `var(--tab-${t.tone})`, "--tab-ink": `var(--tab-${t.tone}-ink)` } as CSSProperties}>
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
