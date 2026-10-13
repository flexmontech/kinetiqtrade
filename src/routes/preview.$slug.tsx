import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, ShieldCheck, BadgeCheck, Star, Clock, MapPin, Wind, Home, Droplets, TreePine, Sprout, Paintbrush, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { contentFor, NEARBY, tradeKey, type Review } from "@/lib/leads";
import { toast } from "sonner";

const ICONS: Record<string, typeof Wind> = {
  HVAC: Wind, Roofing: Home, Plumbing: Droplets, "Tree Service": TreePine, Landscaping: Sprout, Painting: Paintbrush,
};

export const Route = createFileRoute("/preview/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({ track: s.track === "0" || s.track === 0 ? 0 : 1 }),
  loader: async ({ params }) => {
    const { data, error } = await supabase.from("leads").select("*").eq("slug", params.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.business_name} — ${loaderData.trade} in ${loaderData.city}` : "Demo site";
    const desc = loaderData
      ? `${loaderData.rating}★ rated ${loaderData.trade.toLowerCase()} serving ${loaderData.city}. Free estimates, licensed & insured.`
      : "Local service demo site.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: PreviewPage,
  errorComponent: ({ error }) => <div className="p-10 text-center">Couldn't load this demo: {error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center font-display text-2xl">This demo site doesn't exist.</div>,
});

function season() {
  const m = new Date().getMonth();
  if (m <= 1 || m === 11) return "Winter";
  if (m <= 4) return "Spring";
  if (m <= 7) return "Summer";
  return "Fall";
}

function PreviewPage() {
  const lead = Route.useLoaderData();
  const { track } = Route.useSearch();
  const c = contentFor(lead.trade);
  const Icon = ICONS[lead.trade] ?? Wind;
  const reviews = (lead.reviews as unknown as Review[]) ?? [];
  const areas = NEARBY[lead.city] ?? [lead.city];
  const tel = `tel:${(lead.phone ?? "").replace(/[^0-9+]/g, "")}`;
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (track === 0) return;
    supabase.rpc("record_lead_view", { _slug: lead.slug });
  }, [lead.slug, track]);

  return (
    <div className={`theme-${tradeKey(lead.trade)} min-h-screen bg-background pb-20 font-sans md:pb-0`}>
      <div className="bg-foreground px-4 py-2 text-center text-sm text-background">
        Demo site created for <strong>{lead.business_name}</strong> — Claim and launch on your domain{" "}
        <a href="mailto:hello@tradelift.app?subject=Claim my demo site" className="ml-2 inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
          Claim it <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-primary-foreground"><Icon className="h-5 w-5" /></span>
            <span className="font-display text-lg font-bold text-brand-ink">{lead.business_name}</span>
          </div>
          <a href={tel} className="hidden items-center gap-2 rounded-md bg-brand px-4 py-2 font-semibold text-primary-foreground md:inline-flex">
            <Phone className="h-4 w-4" /> {lead.phone}
          </a>
        </div>
      </header>

      <section className="bg-brand-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr] md:py-20">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm font-semibold text-brand">
              <Clock className="h-4 w-4" /> {season()} · {c.emergency}
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-brand-ink md:text-6xl">{c.headline}</h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              {lead.city}'s trusted {lead.trade.toLowerCase()} pros. Rated {lead.rating}★ by {lead.review_count} neighbors on Google.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={tel} className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-lg font-semibold text-primary-foreground">
                <Phone className="h-5 w-5" /> Call now
              </a>
              <a href="#estimate" className="inline-flex items-center rounded-md border-2 border-brand px-6 py-3 text-lg font-semibold text-brand">
                Free estimate
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-card p-6 shadow-sm">
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}
            </div>
            <p className="mt-2 font-display text-5xl font-extrabold text-brand-ink">{lead.rating}</p>
            <p className="text-muted-foreground">from {lead.review_count} Google reviews</p>
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 px-4 py-5 text-sm font-semibold text-brand-ink">
          <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand" /> Licensed & Insured</span>
          <span className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-brand" /> Free Estimates</span>
          <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-brand" /> Fast Response</span>
          <span className="flex items-center gap-2"><Star className="h-5 w-5 text-brand" /> {lead.rating}★ on Google</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-brand-ink">What we do</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.services.map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-5">
              <Icon className="h-7 w-7 text-brand" />
              <h3 className="mt-3 font-display text-lg font-bold text-brand-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="bg-brand-soft">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="font-display text-3xl font-bold text-brand-ink">What {lead.city} says</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {reviews.map((r, i) => (
                <figure key={i} className="rounded-xl bg-card p-6">
                  <div className="flex text-accent">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
                  <blockquote className="mt-3 text-foreground">"{r.text}"</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-muted-foreground">— {r.author}, Google review</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-brand-ink">Service area</h2>
          <p className="mt-2 text-muted-foreground">Proudly serving {lead.city} and nearby communities.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {areas.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-sm"><MapPin className="h-3.5 w-3.5 text-brand" />{a}</span>
            ))}
          </div>
        </div>
        <form
          id="estimate"
          className="rounded-xl border bg-card p-6"
          onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Thanks! We'll call you shortly."); }}
        >
          <h2 className="font-display text-2xl font-bold text-brand-ink">Request a free estimate</h2>
          {sent ? (
            <p className="mt-4 text-trust">Request received — expect a call soon.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              <input required placeholder="Your name" className="rounded-md border bg-background px-3 py-2" />
              <input required type="tel" placeholder="Phone" className="rounded-md border bg-background px-3 py-2" />
              <input placeholder="Address or ZIP" className="rounded-md border bg-background px-3 py-2" />
              <textarea placeholder="What do you need help with?" rows={3} className="rounded-md border bg-background px-3 py-2" />
              <button className="rounded-md bg-brand px-4 py-3 font-semibold text-primary-foreground">Get my free estimate</button>
            </div>
          )}
        </form>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} {lead.business_name} · {lead.city}, IL · {lead.phone}</footer>

      <a href={tel} className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 bg-brand py-4 text-lg font-bold text-primary-foreground md:hidden">
        <Phone className="h-5 w-5" /> Tap to call {lead.phone}
      </a>
    </div>
  );
}
