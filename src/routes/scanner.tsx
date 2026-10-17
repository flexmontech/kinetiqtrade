import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, GlobeOff, Radar, Search, ShieldCheck, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { REGIONS, REGION_NAMES, TRADES } from "@/lib/leads";
import { isKnownProspect, prospectToLead, scanProspects, type Prospect, type ScanInput } from "@/lib/scanner";

const namesQuery = queryOptions({
  queryKey: ["lead-names"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leads").select("business_name");
    if (error) throw new Error(error.message);
    return data.map((d) => d.business_name.toLowerCase());
  },
});

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Find Prospects — Kinetiq" },
      { name: "description", content: "Search Chicagoland for top-rated local businesses with no website — the highest-converting prospects for a Kinetiq demo site." },
      { property: "og:title", content: "Find Prospects — Kinetiq" },
      { property: "og:description", content: "Prospect Chicagoland businesses whose reputation outpaces their web presence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(namesQuery),
  component: Scanner,
  errorComponent: ({ error }) => <div className="p-10">Couldn't load prospects: {error instanceof Error ? error.message : "Please try again."}</div>,
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

const DEFAULTS: ScanInput = { trade: "HVAC", area: "all", minRating: 4.5, minReviews: 15, onlyNoWebsite: true, limit: 12 };

function Scanner() {
  const { data: names } = useSuspenseQuery(namesQuery);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<ScanInput>(DEFAULTS);
  const [applied, setApplied] = useState<ScanInput>(DEFAULTS);
  const [added, setAdded] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const known = useMemo(() => new Set([...names, ...added]), [names, added]);
  const results = useMemo(() => scanProspects(applied), [applied]);

  async function add(p: Prospect) {
    setBusyId(p.id);
    const { error } = await supabase.from("leads").insert(prospectToLead(p));
    setBusyId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${p.business_name} added to the pipeline`);
    setAdded((prev) => [...prev, p.business_name.toLowerCase()]);
    qc.invalidateQueries({ queryKey: ["leads"] });
  }

  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <header className="border-b bg-card/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Find Prospects</h1>
            <p className="text-sm text-muted-foreground">Search Chicagoland for high-trust businesses whose web presence doesn't match their reputation.</p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <GlobeOff className="h-3.5 w-3.5" />Sample listings — connect Google Places for live data
          </p>
        </div>

        <div className="mx-auto flex max-w-[1500px] flex-wrap items-end gap-3 px-6 pb-5">
          <div className="grid gap-1.5">
            <Label className="text-xs">Business type</Label>
            <Select value={draft.trade} onValueChange={(v) => setDraft({ ...draft, trade: v })}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>{TRADES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Area</Label>
            <Select value={draft.area} onValueChange={(v) => setDraft({ ...draft, area: v })}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chicagoland</SelectItem>
                {REGION_NAMES.map((r) => (
                  <SelectGroup key={r}>
                    <SelectLabel>{r}</SelectLabel>
                    <SelectItem value={`region:${r}`}>All {r}</SelectItem>
                    {REGIONS[r].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs" htmlFor="min-rating">Min rating</Label>
            <Input id="min-rating" type="number" step="0.1" min="0" max="5" value={draft.minRating}
              onChange={(e) => setDraft({ ...draft, minRating: Number(e.target.value) || 0 })} className="w-24" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs" htmlFor="min-reviews">Min reviews</Label>
            <Input id="min-reviews" type="number" min="0" value={draft.minReviews}
              onChange={(e) => setDraft({ ...draft, minReviews: Math.max(0, Math.floor(Number(e.target.value) || 0)) })} className="w-28" />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm font-semibold">
            <Switch checked={draft.onlyNoWebsite} onCheckedChange={(v) => setDraft({ ...draft, onlyNoWebsite: v })} />
            No website only
          </label>
          <Button className="mb-px" onClick={() => setApplied(draft)}>
            <Radar className="h-4 w-4" />Scan
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {results.length} prospect{results.length === 1 ? "" : "s"} · sorted by opportunity score
            {applied.onlyNoWebsite && " · no website only"}
          </p>
          <Link to="/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-crimson hover:underline">
            Open sales pipeline <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl border bg-card/80 p-10 text-center">
            <Search className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-3 font-semibold">Nothing matches those filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Lower the minimum rating or reviews, widen the area, or turn off "No website only".</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => {
              const isKnown = isKnownProspect(p, known);
              return (
                <article key={p.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg font-bold leading-tight">{p.business_name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{p.city} · {p.trade}</p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-bold ${p.high_trust ? "bg-trust text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {p.high_trust && <ShieldCheck className="h-3.5 w-3.5" />}{p.score}
                    </span>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold">{p.rating}</span>
                    <span className="text-muted-foreground">across {p.review_count} Google reviews</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.gaps.map((g) => (
                      <Badge key={g} variant={g === "No website found" ? "default" : "secondary"} className="text-[11px]">{g}</Badge>
                    ))}
                  </div>

                  <p className="mt-3 line-clamp-2 rounded-lg bg-muted/60 p-3 text-sm italic text-muted-foreground">“{p.reviews[0]?.text}”</p>

                  <dl className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                    <div><dt className="inline font-semibold text-foreground">Owner: </dt><dd className="inline">{p.owner_name}</dd></div>
                    <div><dt className="inline font-semibold text-foreground">Phone: </dt><dd className="inline">{p.phone}</dd></div>
                    <div className="truncate"><dt className="inline font-semibold text-foreground">Email: </dt><dd className="inline">{p.email}</dd></div>
                  </dl>

                  <div className="mt-4 pt-1">
                    {isKnown ? (
                      <Button variant="secondary" className="w-full" disabled><Check className="h-4 w-4" />Already in pipeline</Button>
                    ) : (
                      <Button className="w-full" disabled={busyId === p.id} onClick={() => add(p)}>
                        {busyId === p.id ? "Adding…" : "Add to pipeline"}
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
