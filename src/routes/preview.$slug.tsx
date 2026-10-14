import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, ShieldCheck, BadgeCheck, Star, Clock, MapPin, Wind, Home, Droplets, TreePine, Sprout, Paintbrush, ArrowRight, ArrowUpRight, Check, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { contentFor, NEARBY, tradeKey, type Review } from "@/lib/leads";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import homePhoto from "@/assets/demo-home.jpg";
import hvacPhoto from "@/assets/demo-hvac.jpg";
import gardenPhoto from "@/assets/demo-garden.jpg";
import plumbingPhoto from "@/assets/demo-plumbing.jpg";

const PHOTOS: Record<string, string> = {
  HVAC: hvacPhoto, Roofing: homePhoto, Plumbing: plumbingPhoto,
  "Tree Service": gardenPhoto, Landscaping: gardenPhoto, Painting: homePhoto,
};

const ICONS: Record<string, typeof Wind> = {
  HVAC: Wind, Roofing: Home, Plumbing: Droplets, "Tree Service": TreePine, Landscaping: Sprout, Painting: Paintbrush,
};

export const Route = createFileRoute("/preview/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({ track: s["track"] === "0" || s["track"] === 0 ? 0 : 1 }),
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
  errorComponent: ({ error }) => <div className="p-10 text-center">Couldn't load this demo: {error instanceof Error ? error.message : "Please try again."}</div>,
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
  const photo = PHOTOS[lead.trade] ?? homePhoto;

  useEffect(() => {
    if (track === 0) return;
    void supabase.rpc("record_lead_view", { _slug: lead.slug }).then(() => {});
  }, [lead.slug, track]);

  return (
    <div className={`demo-site theme-${tradeKey(lead.trade)} min-h-screen bg-background pb-16 font-sans md:pb-0`}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-demo-dark px-4 py-2 text-center text-xs text-demo-dark-foreground">
        <span>Created by <strong>Kinetiq</strong></span>
        <Button variant="link" size="sm" asChild className="h-auto p-0 text-demo-highlight">
          <a href="mailto:hello@kinetiq.app?subject=Claim my demo site">Claim your site <ArrowUpRight className="h-3 w-3" /></a>
        </Button>
      </div>

      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#home" className="flex min-w-0 items-center gap-3" aria-label={`${lead.business_name} home`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand text-brand-contrast"><Icon className="h-6 w-6" /></span>
            <span className="min-w-0">
              <span className="block max-w-[220px] font-display text-base font-bold leading-tight text-brand-ink sm:max-w-xs sm:text-lg">{lead.business_name}</span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase text-muted-foreground">{lead.city} · {lead.trade}</span>
            </span>
          </a>
          <nav aria-label="Site navigation" className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground lg:flex">
            <a href="#services" className="transition-colors hover:text-brand">Services</a>
            {reviews.length > 0 && <a href="#reviews" className="transition-colors hover:text-brand">Reviews</a>}
            <a href="#service-area" className="transition-colors hover:text-brand">Service area</a>
          </nav>
          <Button variant="brand" asChild className="h-11 shrink-0 px-3 sm:px-5">
            <a href={tel} aria-label={`Call ${lead.phone}`}><Phone className="h-4 w-4" /><span className="hidden md:inline">{lead.phone}</span><span className="md:hidden">Call</span></a>
          </Button>
        </div>
      </header>

      <main>
        <section id="home" className="demo-hero relative isolate flex items-center overflow-hidden bg-photo-shade">
          <img src={photo} alt={lead.trade === "HVAC" ? "Heating and cooling technician at a suburban home" : lead.trade === "Plumbing" ? "Bright bathroom with modern plumbing fixtures" : lead.trade === "Tree Service" || lead.trade === "Landscaping" ? "Lush garden and mature trees around a suburban home" : "Beautifully finished suburban home exterior"} width={1536} height={1024} fetchPriority="high" className="demo-hero-image absolute inset-0 h-full w-full object-cover" />
          <div className="demo-hero-content relative z-10 mx-auto w-full max-w-7xl px-5 py-12 text-photo-foreground lg:px-8 lg:py-16">
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase sm:text-sm"><span className="h-2 w-2 rounded-full bg-demo-highlight" /> Local expertise. Right here in {lead.city}.</div>
            <h1 className="max-w-2xl break-words font-display text-[38px] font-extrabold leading-[1.08] sm:text-5xl lg:text-[64px]">{lead.business_name}</h1>
            <p className="mt-5 max-w-xl font-display text-xl font-semibold leading-snug sm:text-2xl lg:text-3xl">{c.headline}</p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-photo-foreground/85 sm:text-base">{lead.city}'s trusted {lead.trade === "HVAC" ? "HVAC" : lead.trade.toLowerCase()} pros. Rated {lead.rating}★ by {lead.review_count} neighbors on Google.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="brand" size="lg" asChild className="h-12 px-5 text-base"><a href="#estimate">Get a free estimate <ArrowRight /></a></Button>
              <Button variant="heroOutline" size="lg" asChild className="h-12 px-5 text-base"><a href={tel}><Phone /> Call now</a></Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex gap-0.5 text-demo-highlight">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>
              <span><strong>{lead.rating}/5</strong> <span className="text-photo-foreground/75">· {lead.review_count} Google reviews</span></span>
            </div>
          </div>
        </section>

        <section className="border-b bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-6 text-xs font-semibold text-brand-ink sm:text-sm md:grid-cols-4 lg:px-8">
            <span className="flex items-center gap-2.5"><ShieldCheck className="h-5 w-5 shrink-0 text-brand" /> Licensed & Insured</span>
            <span className="flex items-center gap-2.5"><BadgeCheck className="h-5 w-5 shrink-0 text-brand" /> Free Estimates</span>
            <span className="flex items-center gap-2.5"><Clock className="h-5 w-5 shrink-0 text-brand" /> Fast Response</span>
            <span className="flex items-center gap-2.5"><MapPin className="h-5 w-5 shrink-0 text-brand" /> Locally Trusted</span>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="mb-3 text-xs font-bold uppercase text-brand">Expert care for your home</p><h2 className="font-display text-3xl font-bold text-brand-ink sm:text-4xl">Good hands. Great results.</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">From the unexpected repair to your next big project. {lead.trade} services, close to home.</p>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.services.map((s, i) => (
              <a href="#estimate" key={s.title} className="demo-service group flex flex-col rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-md bg-brand-soft text-brand"><Icon className="h-6 w-6" /></span><span className="font-display text-sm text-muted-foreground">0{i + 1}</span></div>
                <h3 className="mt-6 font-display text-xl font-bold text-brand-ink">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand">Free estimate <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-brand-soft">
          <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-14 md:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
            <div className="demo-photo-wrap relative overflow-hidden rounded-lg">
              <img src={photo} alt={`Illustrative ${lead.trade.toLowerCase()} photography`} width={1536} height={1024} loading="lazy" className="demo-photo aspect-[4/3] w-full object-cover" />
              <span className="absolute bottom-3 right-3 rounded bg-demo-dark/75 px-2 py-1 text-[10px] text-demo-dark-foreground">Illustrative demo imagery</span>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase text-brand">Your home. Our neighborhood.</p>
              <h2 className="font-display text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">Local service.<br />Lasting peace of mind.</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{lead.business_name} serves {lead.city} and the surrounding communities. From your first call to the finishing touches, your home comes first.</p>
              <div className="mt-6 space-y-3 text-sm font-semibold text-brand-ink">
                <p className="flex items-center gap-3"><Check className="h-5 w-5 text-brand" /> Licensed & insured professionals</p>
                <p className="flex items-center gap-3"><Check className="h-5 w-5 text-brand" /> Free estimates for your next project</p>
                <p className="flex items-start gap-3"><Clock className="h-5 w-5 shrink-0 text-brand" /> {season()} · {c.emergency}</p>
              </div>
              <Button variant="brand" asChild className="mt-8 h-11"><a href={tel}>Let's talk about your home <ArrowRight /></a></Button>
            </div>
          </div>
        </section>

        {reviews.length > 0 && (
          <section id="reviews" className="scroll-mt-24 bg-demo-dark text-demo-dark-foreground">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div><p className="mb-3 text-xs font-bold uppercase text-demo-highlight">A reputation built next door</p><h2 className="font-display text-3xl font-bold sm:text-4xl">What {lead.city} says.</h2></div>
                <div className="flex items-center gap-3"><span className="font-display text-4xl font-bold">{lead.rating}</span><span className="text-sm"><span className="flex text-demo-highlight">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span><span className="mt-1 block text-demo-dark-foreground/70">{lead.review_count} Google reviews</span></span></div>
              </div>
              <div className="mt-9 grid gap-7 md:grid-cols-3">
                {reviews.map((r, i) => (
                  <figure key={i} className="border-t border-demo-dark-foreground/20 pt-6">
                    <div className="flex items-center justify-between"><div className="flex text-demo-highlight">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div><Quote className="h-6 w-6 text-demo-dark-foreground/30" /></div>
                    <blockquote className="mt-5 text-base leading-relaxed">“{r.text}”</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-demo-dark-foreground/10 text-sm font-bold">{r.author.slice(0, 1)}</span><span className="text-sm font-semibold">{r.author}<span className="block text-xs font-normal text-demo-dark-foreground/60">Google review</span></span></figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="service-area" className="scroll-mt-24 mx-auto grid max-w-7xl items-start gap-12 px-5 py-16 md:grid-cols-2 lg:gap-20 lg:px-8 lg:py-20">
          <div className="md:pt-5">
            <p className="mb-3 text-xs font-bold uppercase text-brand">Around the corner. Ready to help.</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">Proudly serving<br />{lead.city} & beyond.</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">Your local {lead.trade.toLowerCase()} team, serving the places you call home.</p>
            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 text-sm font-medium">{areas.map((a) => <span key={a} className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-brand" />{a}</span>)}</div>
            <div className="mt-9 border-t pt-6"><p className="text-sm text-muted-foreground">Prefer to talk it through?</p><a href={tel} className="mt-2 inline-flex items-center gap-2 font-display text-xl font-bold text-brand"><Phone className="h-5 w-5" />{lead.phone}</a></div>
          </div>
          <form id="estimate" className="scroll-mt-28 rounded-lg border bg-card p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Thanks! We'll call you shortly."); }}>
            <h2 className="font-display text-2xl font-bold text-brand-ink">Let's get it taken care of.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Request your free, no-obligation estimate.</p>
            {sent ? (
              <div className="mt-6 flex items-start gap-3 rounded-md bg-brand-soft p-5 text-trust"><BadgeCheck className="h-6 w-6 shrink-0" /><p>Request received — expect a call soon.</p></div>
            ) : (
              <div className="mt-6 grid gap-4">
                <label className="grid gap-1.5 text-sm font-semibold">Your name<input required name="name" autoComplete="name" placeholder="Full name" className="h-11 w-full rounded-md border bg-background px-3 font-normal" /></label>
                <label className="grid gap-1.5 text-sm font-semibold">Phone number<input required name="phone" type="tel" autoComplete="tel" placeholder="(555) 000-0000" className="h-11 w-full rounded-md border bg-background px-3 font-normal" /></label>
                <label className="grid gap-1.5 text-sm font-semibold">Address or ZIP<input name="address" autoComplete="street-address" placeholder="Where can we help?" className="h-11 w-full rounded-md border bg-background px-3 font-normal" /></label>
                <label className="grid gap-1.5 text-sm font-semibold">Tell us about your project<textarea name="project" placeholder="What do you need help with?" rows={3} className="w-full resize-y rounded-md border bg-background px-3 py-2 font-normal" /></label>
                <Button variant="brand" type="submit" className="mt-1 h-12 w-full text-base font-semibold">Get my free estimate <ArrowRight /></Button>
              </div>
            )}
          </form>
        </section>
      </main>

      <footer className="border-t bg-muted">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-xs text-muted-foreground lg:px-8"><span className="font-display text-base font-bold text-brand-ink">{lead.business_name}</span><span>© {new Date().getFullYear()} · {lead.city}, IL · {lead.phone}</span></div>
      </footer>
      <Button variant="brand" asChild className="fixed inset-x-0 bottom-0 z-40 h-16 rounded-none text-base font-bold md:hidden"><a href={tel}><Phone /> Tap to call {lead.phone}</a></Button>
    </div>
  );
}
