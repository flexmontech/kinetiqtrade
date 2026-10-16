import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LayoutGrid, Search, Star, Table2, Eye, Flame, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddLeadDialog } from "@/components/AddLeadDialog";
import { LeadDetail } from "@/components/LeadDetail";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { REGIONS, REGION_NAMES, matchesArea, isHighTrust, opportunityScore, slugify, STAGES, TRADES, viewedRecently, type Lead } from "@/lib/leads";

const leadsQuery = queryOptions({
  queryKey: ["leads"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },
  refetchInterval: 15_000,
});

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads Pipeline — Kinetiq" },
      { name: "description", content: "Track Chicago-suburb trade leads from discovery to won, with demo sites and pitch scripts." },
      { property: "og:title", content: "Leads Pipeline — Kinetiq" },
      { property: "og:description", content: "Lead pipeline and demo site engine for home service trades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(leadsQuery),
  component: Dashboard,
  errorComponent: ({ error }) => <div className="p-10">Couldn't load leads: {error instanceof Error ? error.message : "Please try again."}</div>,
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

function Dashboard() {
  const { data: leads } = useSuspenseQuery(leadsQuery);
  const qc = useQueryClient();
  const [view, setView] = useState<"board" | "table">("board");
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState("all");
  const [city, setCity] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  const filtered = useMemo(() => leads.filter((l) =>
    (trade === "all" || l.trade === trade) && matchesArea(l.city, city) &&
    (!q || `${l.business_name} ${l.owner_name ?? ""}`.toLowerCase().includes(q.toLowerCase()))), [leads, q, trade, city]);

  const selected = leads.find((l) => l.id === selectedId) ?? null;
  const hot = leads.filter((l) => viewedRecently(l.last_viewed_at)).length;

  async function setStage(id: string, stage: string) {
    qc.setQueryData(leadsQuery.queryKey, (old: Lead[] | undefined) => old?.map((l) => (l.id === id ? { ...l, stage } : l)));
    await supabase.from("leads").update({ stage }).eq("id", id);
    qc.invalidateQueries({ queryKey: leadsQuery.queryKey });
  }

  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <header className="border-b bg-card/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight"><span className="kinetiq-word">Kinetiq</span><span className="text-accent">.</span></h1>
            <p className="text-sm text-muted-foreground">{leads.length} leads · western suburbs · {hot > 0 && <span className="font-semibold text-hot">{hot} viewing now</span>}</p>
          </div>
          <AddLeadDialog onAdded={() => qc.invalidateQueries({ queryKey: leadsQuery.queryKey })} />
        </div>
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-6 pb-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search business or owner" className="pl-8" />
          </div>
          <Select value={trade} onValueChange={setTrade}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All trades</SelectItem>{TRADES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          <Select value={city} onValueChange={setCity}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All areas</SelectItem>{REGION_NAMES.map((r) => (<SelectGroup key={r}><SelectLabel>{r}</SelectLabel><SelectItem value={`region:${r}`}>All {r}</SelectItem>{REGIONS[r].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectGroup>))}</SelectContent></Select>
          <div className="ml-auto flex rounded-md border p-0.5">
            <Button size="sm" variant={view === "board" ? "default" : "ghost"} onClick={() => setView("board")}><LayoutGrid className="h-4 w-4" />Board</Button>
            <Button size="sm" variant={view === "table" ? "default" : "ghost"} onClick={() => setView("table")}><Table2 className="h-4 w-4" />Table</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-6">
        {view === "board" ? (
          <div className="grid gap-4 overflow-x-auto md:grid-cols-5">
            {STAGES.map((stage) => {
              const col = filtered.filter((l) => l.stage === stage);
              return (
                <div key={stage} data-stage={slugify(stage)}
                  className={`stage-col min-w-[240px] rounded-xl border p-3 backdrop-blur-md transition-shadow ${overStage === stage ? "is-over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); if (dragId) setOverStage(stage); }}
                  onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
                  onDrop={() => { setOverStage(null); if (dragId) setStage(dragId, stage); }}>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="stage-title font-display font-bold">{stage}</h2>
                    <span className="stage-count rounded-full px-2 py-0.5 text-xs font-semibold">{col.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.map((l) => <LeadCard key={l.id} lead={l} onOpen={() => setSelectedId(l.id)} onDrag={() => setDragId(l.id)} />)}
                    {col.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">Drop leads here</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Trade</TableHead><TableHead>Suburb</TableHead><TableHead>Rating</TableHead><TableHead>Score</TableHead><TableHead>Stage</TableHead><TableHead>Views</TableHead></TableRow></TableHeader>
              <TableBody>
                {[...filtered].sort((a, b) => opportunityScore(b.rating, b.review_count) - opportunityScore(a.rating, a.review_count)).map((l) => (
                  <TableRow key={l.id} className="cursor-pointer" onClick={() => setSelectedId(l.id)}>
                    <TableCell className="font-semibold">{l.business_name} {viewedRecently(l.last_viewed_at) && <HotBadge />}</TableCell>
                    <TableCell><Badge variant="secondary">{l.trade}</Badge></TableCell>
                    <TableCell>{l.city}</TableCell>
                    <TableCell>{l.rating}★ ({l.review_count})</TableCell>
                    <TableCell><Score lead={l} /></TableCell>
                    <TableCell><StageCell stage={l.stage} /></TableCell>
                    <TableCell>{l.view_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <LeadDetail lead={selected} onClose={() => setSelectedId(null)} onStage={setStage} />
      <SiteFooter />
    </div>
  );
}

function HotBadge() {
  return <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-hot px-2 py-0.5 text-[11px] font-bold text-hot-foreground"><Flame className="h-3 w-3" />Viewed just now</span>;
}

function Score({ lead }: { lead: Lead }) {
  const s = opportunityScore(lead.rating, lead.review_count);
  const trust = isHighTrust(lead.rating, lead.review_count);
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-bold ${trust ? "bg-trust text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
      {trust && <ShieldCheck className="h-3 w-3" />}{s}
    </span>
  );
}

function StageCell({ stage }: { stage: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="stage-dot" data-stage={slugify(stage)} />{stage}
    </span>
  );
}

function LeadCard({ lead, onOpen, onDrag }: { lead: Lead; onOpen: () => void; onDrag: () => void }) {
  const hot = viewedRecently(lead.last_viewed_at);
  return (
    <button draggable onDragStart={onDrag} onClick={onOpen}
      className={`w-full rounded-md border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${hot ? "ring-2 ring-hot" : ""}`}>
      {hot && <div className="mb-1.5"><HotBadge /></div>}
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold leading-tight">{lead.business_name}</p>
        <Score lead={lead} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Badge variant="secondary" className="text-[11px]">{lead.trade}</Badge>
        <span>{lead.city}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{lead.rating} · {lead.review_count} reviews</span>
        {lead.view_count > 0 && <span className="flex items-center gap-1 text-muted-foreground"><Eye className="h-3.5 w-3.5" />{lead.view_count}</span>}
      </div>
    </button>
  );
}
