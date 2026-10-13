import { useState } from "react";
import { Copy, ExternalLink, Monitor, Smartphone, Star, Eye } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pitches, STAGES, type Lead } from "@/lib/leads";

export function LeadDetail({ lead, onClose, onStage }: { lead: Lead | null; onClose: () => void; onStage: (id: string, s: string) => void }) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  if (!lead) return null;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/preview/${lead.slug}`;
  const p = pitches(lead, link);
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">{lead.business_name}</SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-3">
            <span>{lead.owner_name} · {lead.trade} · {lead.city}</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{lead.rating} ({lead.review_count})</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{lead.view_count} views</span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-wrap items-center gap-2 px-4">
          <Select value={lead.stage} onValueChange={(v) => onStage(lead.id, v)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => copy(link)}><Copy className="h-4 w-4" />Copy demo link</Button>
          <Button variant="outline" size="sm" asChild><a href={`/preview/${lead.slug}?track=0`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />Open</a></Button>
        </div>

        <section className="mt-6 px-4">
          <h3 className="mb-2 font-display text-lg font-bold">Pitch generator</h3>
          <Tabs defaultValue="email">
            <TabsList><TabsTrigger value="email">Cold email</TabsTrigger><TabsTrigger value="sms">SMS</TabsTrigger><TabsTrigger value="call">Call script</TabsTrigger></TabsList>
            {(["email", "sms", "call"] as const).map((k) => (
              <TabsContent key={k} value={k}>
                <div className="relative rounded-lg border bg-muted/50 p-4">
                  <Button size="sm" className="absolute right-2 top-2" onClick={() => copy(p[k])}><Copy className="h-4 w-4" />Copy</Button>
                  <pre className="whitespace-pre-wrap pr-20 font-sans text-sm leading-relaxed">{p[k]}</pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className="mt-6 px-4 pb-8">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Demo preview</h3>
            <div className="flex rounded-md border p-0.5">
              <Button size="sm" variant={device === "mobile" ? "default" : "ghost"} onClick={() => setDevice("mobile")}><Smartphone className="h-4 w-4" />Mobile</Button>
              <Button size="sm" variant={device === "desktop" ? "default" : "ghost"} onClick={() => setDevice("desktop")}><Monitor className="h-4 w-4" />Desktop</Button>
            </div>
          </div>
          <div className="flex min-w-0 justify-center rounded-lg bg-muted p-2 sm:p-4">
            {device === "mobile" ? (
              <div className="w-full max-w-[380px] overflow-hidden rounded-[2.2rem] border-[8px] border-foreground bg-foreground shadow-xl">
                <iframe title="Mobile preview" src={`/preview/${lead.slug}?track=0`} className="h-[640px] w-full rounded-[1.5rem] bg-background" />
              </div>
            ) : (
              <div className="w-full overflow-hidden rounded-lg border bg-card shadow-xl">
                <div className="flex gap-1.5 border-b bg-muted px-3 py-2"><span className="h-2.5 w-2.5 rounded-full bg-hot" /><span className="h-2.5 w-2.5 rounded-full bg-accent" /><span className="h-2.5 w-2.5 rounded-full bg-trust" /></div>
                <div className="h-[560px] overflow-hidden">
                  <iframe title="Desktop preview" src={`/preview/${lead.slug}?track=0`} className="h-[1120px] w-[200%] origin-top-left scale-50" />
                </div>
              </div>
            )}
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
