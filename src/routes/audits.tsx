import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, ExternalLink, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { auditFor, auditScore, opportunityScore } from "@/lib/leads";

const leadsQuery = queryOptions({
  queryKey: ["leads"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
});

export const Route = createFileRoute("/audits")({
  head: () => ({
    meta: [
      { title: "Web Readiness — Kinetiq" },
      { name: "description", content: "Readiness checks and pitch angles for every prospect in the Kinetiq workspace." },
      { property: "og:title", content: "Web Readiness — Kinetiq" },
      { property: "og:description", content: "Web readiness checks and pitch angles for local business prospects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leadsQuery),
  component: Audits,
  errorComponent: ({ error }) => <div className="p-10">Couldn't load audits: {error instanceof Error ? error.message : "Please try again."}</div>,
});

function Audits() {
  const { data: leads } = useSuspenseQuery(leadsQuery);
  const [q, setQ] = useState("");
  const rows = useMemo(() => leads
    .filter((l) => !q || l.business_name.toLowerCase().includes(q.toLowerCase()))
    .map((l) => ({ lead: l, checks: auditFor(l) }))
    .sort((a, b) => opportunityScore(b.lead.rating, b.lead.review_count) - opportunityScore(a.lead.rating, a.lead.review_count)), [leads, q]);

  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Web Readiness</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Readiness checks and pitch angles for each business. Live checks of their current website (speed, mobile, booking) arrive once business scanning is connected.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search business" className="pl-8" />
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-[1500px] gap-4 px-4 py-6 sm:px-6 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ lead, checks }) => {
          const score = auditScore(checks);
          const gaps = checks.filter((c) => !c.ok);
          return (
            <article key={lead.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold leading-tight">{lead.business_name}</h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge variant="secondary">{lead.trade}</Badge><span>{lead.city}</span><span>· {lead.rating}★ ({lead.review_count})</span>
                  </div>
                </div>
                <span className="rounded-lg bg-accent px-2.5 py-1 font-display text-lg font-extrabold text-accent-foreground">{score}</span>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    {c.ok ? <CheckCircle2 className="h-4 w-4 text-accent" /> : <CircleAlert className="h-4 w-4 text-hot" />}
                    <span className={c.ok ? "" : "font-semibold"}>{c.label}</span>
                  </li>
                ))}
              </ul>
              {gaps[0] && (
                <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                  <p className="font-semibold">Pitch angle</p>
                  <p className="mt-1 text-muted-foreground">{gaps[0]?.angle}</p>
                </div>
              )}
              <Link to="/preview/$slug" params={{ slug: lead.slug }} search={{ track: 0 }} target="_blank"
                className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-crimson hover:underline">
                Open demo site <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </article>
          );
        })}
      </main>
      <SiteFooter />
    </div>
  );
}
