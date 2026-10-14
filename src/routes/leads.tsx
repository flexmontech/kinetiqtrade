import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Star, ShieldCheck, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { Badge } from "@/components/ui/badge";
import { isHighTrust, opportunityScore } from "@/lib/leads";

const leadsQuery = queryOptions({
  queryKey: ["leads"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
});

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Kinetiq" },
      { name: "description", content: "All discovered home service trade leads, ranked by opportunity score." },
      { property: "og:title", content: "Leads — Kinetiq" },
      { property: "og:description", content: "Trade leads ranked by opportunity score." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leadsQuery),
  component: Leads,
  errorComponent: ({ error }) => <div className="p-10">Couldn't load leads: {error instanceof Error ? error.message : "Please try again."}</div>,
});

function Leads() {
  const { data } = useSuspenseQuery(leadsQuery);
  const leads = [...data].sort((a, b) => opportunityScore(b.rating, b.review_count) - opportunityScore(a.rating, a.review_count));
  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[1500px] px-6 py-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">{leads.length} businesses, best opportunities first</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((l) => {
            const trust = isHighTrust(l.rating, l.review_count);
            return (
              <div key={l.id} className="rounded-xl border bg-card/85 p-4 backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-bold leading-tight">{l.business_name}</p>
                  <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-bold ${trust ? "bg-trust text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {trust && <ShieldCheck className="h-3 w-3" />}{opportunityScore(l.rating, l.review_count)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{l.trade}</Badge><span>{l.city}</span><span>· {l.stage}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{l.rating} · {l.review_count} reviews</span>
                  <a href={`/preview/${l.slug}?track=0`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-primary hover:underline">Demo site <ExternalLink className="h-3 w-3" /></a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
