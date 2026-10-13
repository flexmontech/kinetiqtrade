import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CITIES, slugify, TRADES } from "@/lib/leads";

export function AddLeadDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [trade, setTrade] = useState<string>("HVAC");
  const [city, setCity] = useState<string>("Aurora");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const business_name = String(f.get("business_name")).trim();
    if (!business_name) return;
    setBusy(true);
    const slug = `${slugify(business_name)}-${Math.random().toString(36).slice(2, 6)}`;
    const quote = String(f.get("review") || "").trim();
    const { error } = await supabase.from("leads").insert({
      slug, business_name, trade, city,
      owner_name: String(f.get("owner_name") || "") || null,
      phone: String(f.get("phone") || "") || null,
      rating: Math.min(5, Math.max(0, Number(f.get("rating")) || 0)),
      review_count: Math.max(0, Math.floor(Number(f.get("review_count")) || 0)),
      reviews: quote ? [{ author: "Google reviewer", text: quote, rating: 5 }] : [],
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${business_name} added`);
    setOpen(false);
    onAdded();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="h-4 w-4" />Add lead</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Add a new prospect</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-1.5"><Label>Business name</Label><Input name="business_name" required maxLength={100} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Owner name</Label><Input name="owner_name" maxLength={80} /></div>
            <div className="grid gap-1.5"><Label>Phone</Label><Input name="phone" maxLength={20} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Trade</Label>
              <Select value={trade} onValueChange={setTrade}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TRADES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="grid gap-1.5"><Label>Suburb</Label>
              <Select value={city} onValueChange={setCity}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CITIES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Google rating</Label><Input name="rating" type="number" step="0.1" min="0" max="5" defaultValue="4.7" /></div>
            <div className="grid gap-1.5"><Label>Review count</Label><Input name="review_count" type="number" min="0" defaultValue="20" /></div>
          </div>
          <div className="grid gap-1.5"><Label>Favorite Google review (optional)</Label><Input name="review" maxLength={300} /></div>
          <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Add lead"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
