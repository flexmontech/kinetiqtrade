import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MonitorSmartphone, Radar, Handshake, Star, MapPinned, Zap, MessageCircle, Reply, Bot, Check, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { REGION_NAMES } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import studioPhoto from "@/assets/kinetiq-studio.jpg";
import partnershipPhoto from "@/assets/kinetiq-partnership.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kinetiq — Websites, Leads & New Clients for Local Businesses" },
      { name: "description", content: "Kinetiq builds web apps for home service businesses, finds high-trust local leads across Chicagoland, and turns them into clients." },
      { property: "og:title", content: "Kinetiq — Websites, Leads & New Clients for Local Businesses" },
      { property: "og:description", content: "Web app creation, lead generation and sales pipelines for Chicagoland home service businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  { Icon: MonitorSmartphone, title: "Web app creation", text: "Fast, beautiful websites built for contractors — tap-to-call, estimate forms and real reviews front and center." },
  { Icon: Radar, title: "Lead generation", text: "We scan every corner of Chicagoland for top-rated businesses whose online presence doesn't match their reputation." },
  { Icon: Handshake, title: "Sales & new clientele", text: "Each prospect gets a live demo of their own site before the first call, so the pitch sells itself." },
];

const STEPS = ["Discover high-trust businesses", "Build their demo site instantly", "Pitch by email, text or call", "See the moment they open it", "Win the client"];

const ABOUT_POINTS = [
  { t: "Identify", d: "We identify premier, top-rated local service businesses across Greater Chicagoland whose customer trust outpaces their digital footprint." },
  { t: "Architect", d: "Each business receives an interactive, high-converting web application showcasing their verified credentials, real customer reviews, and automated AI client capture." },
  { t: "Deploy", d: "Business owners test-drive their live custom platform directly on mobile and deploy to production on their own domain." },
];

const AI_TOOLS = [
  { Icon: MessageCircle, title: "AI website chat", text: "Answers customer questions and captures job requests 24/7 — even at 2 a.m. when the furnace dies." },
  { Icon: Reply, title: "AI review replies", text: "Writes warm, on-brand replies to every Google review so the business looks responsive and trusted." },
];

function Landing() {
  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <main>
        <section className="home-hero relative flex items-center overflow-hidden">
          <img src={studioPhoto} alt="A contemporary creative studio with websites displayed across desktop, laptop and mobile screens" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          <div className="home-hero-copy mx-auto w-full max-w-[1200px] px-6 py-16">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary"><span className="h-2 w-2 rounded-full bg-crimson" />Chicagoland businesses. Bigger possibilities.</p>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-extrabold leading-[1.06] md:text-7xl">Kinetiq<span className="text-primary">.</span></h1>
            <p className="mt-5 max-w-lg font-display text-3xl font-bold leading-tight md:text-4xl">Great businesses deserve great websites — and more customers.</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">Beautiful web apps. Smarter lead generation. AI tools that turn interest into your next client.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12"><Link to="/join">Join <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 bg-card"><Link to="/leads">See live leads <ArrowRight /></Link></Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><MapPinned className="h-4 w-4 text-accent" />Now piloting across Greater Chicagoland</p>
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 divide-y divide-border px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-4 py-6 sm:pr-6"><Star className="h-7 w-7 text-primary" /><div><p className="font-display text-2xl font-bold">4.5+ stars</p><p className="text-sm text-muted-foreground">15+ reviews. Reputation first.</p></div></div>
            <div className="flex items-center gap-4 py-6 sm:px-6"><MapPinned className="h-7 w-7 text-accent" /><div><p className="font-display text-2xl font-bold">{REGION_NAMES.length} regions</p><p className="text-sm text-muted-foreground">Across Greater Chicagoland</p></div></div>
            <div className="flex items-center gap-4 py-6 sm:pl-6"><Zap className="h-7 w-7 text-crimson" /><div><p className="font-display text-2xl font-bold">1 click</p><p className="text-sm text-muted-foreground">From prospect to website preview</p></div></div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">THE KINETIQ ADVANTAGE</p><h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">More presence. More possibility.</h2></div><Button asChild variant="link"><Link to="/scanner">Find your next prospect <ArrowRight /></Link></Button></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PILLARS.map(({ Icon, title, text }, i) => (
              <div key={title} className="rounded-lg border bg-card p-7">
                <div className="flex items-center justify-between"><Icon className={`h-8 w-8 ${i === 0 ? "text-primary" : i === 1 ? "text-accent" : "text-crimson"}`} /><span className="font-display text-sm text-muted-foreground">0{i + 1}</span></div>
                <h3 className="mt-6 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y bg-card/40">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
            <div><p className="text-sm font-semibold text-accent">BUILT AROUND YOUR BUSINESS</p><h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Websites that win local trust.</h2><p className="mt-5 leading-relaxed text-muted-foreground">Great local businesses lose calls every day due to no web presence, no visibility and little or no product presence. Kinetiq turns their Google reputation into a site that converts.</p>
              <div className="mt-7 space-y-5">{ABOUT_POINTS.map((p, i) => <div key={p.t} className="flex gap-4 border-t pt-5"><span className="font-display text-xl font-bold text-primary">0{i + 1}</span><div><h3 className="font-display text-xl font-bold">{p.t}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p></div></div>)}</div>
            </div>
            <figure className="home-photo overflow-hidden rounded-lg"><img src={partnershipPhoto} alt="Business owners reviewing their online presence together in a vibrant studio" width={1536} height={1024} loading="lazy" className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]" /><figcaption className="flex items-center gap-2 bg-secondary px-5 py-4 text-sm font-semibold"><Sparkles className="h-4 w-4 text-primary" />A stronger digital presence starts with your business.</figcaption></figure>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div><p className="flex items-center gap-2 text-sm font-semibold text-primary"><Bot className="h-4 w-4" />AI TOOLS FOR YOUR CLIENTS</p><h2 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">After hours.<br />Still open for business.</h2><div className="mt-8 space-y-6">{AI_TOOLS.map(({ Icon, title, text }) => <div key={title} className="flex gap-4"><Icon className="mt-1 h-6 w-6 shrink-0 text-accent" /><div><h3 className="font-display text-xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{text}</p></div></div>)}</div><Button asChild variant="link" className="mt-6 px-0"><Link to="/leads">Explore the business previews <ArrowRight /></Link></Button></div>
          <div className="home-chat overflow-hidden rounded-lg border">
            <div className="flex items-center gap-3 border-b bg-card px-6 py-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground"><MessageCircle className="h-5 w-5" /></span><div><p className="font-semibold">Your business assistant</p><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Always here for your customers</p></div><span className="ml-auto text-xs text-muted-foreground">Sample</span></div>
            <div className="space-y-5 p-6"><p className="text-center text-xs text-muted-foreground">2:04 AM</p><div className="ml-8 rounded-lg bg-secondary p-4 text-sm">Hi, can I request an appointment for tomorrow?</div><div className="mr-8 rounded-lg border bg-card p-4 text-sm leading-relaxed">Of course. What service do you need, and what’s the best number for the team to reach you?</div><div className="ml-8 rounded-lg bg-secondary p-4 text-sm">A consultation for my business. Please call me in the morning.</div><div className="flex items-center gap-3 border-t pt-5 text-sm"><Check className="h-5 w-5 text-accent" /><span>New enquiry ready for your team</span></div></div>
          </div>
        </section>

        <section className="border-y bg-card/50"><div className="mx-auto max-w-[1200px] px-6 py-12"><h2 className="font-display text-3xl font-bold">From prospect to client</h2><ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{STEPS.map((s, i) => <li key={s} className="border-t border-primary/40 pt-4"><span className="font-display text-2xl font-bold text-primary">0{i + 1}</span><p className="mt-3 text-sm font-semibold">{s}</p></li>)}</ol></div></section>
        <section className="mx-auto max-w-[1200px] px-6 py-16 text-center"><p className="text-sm font-semibold text-accent">YOUR NEXT CHAPTER</p><h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">Ready to grow your client list?</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Web presence. Customer conversations. New opportunities. All with Kinetiq.</p><Button asChild size="lg" className="mt-7 h-12"><Link to="/join">Join <ArrowRight /></Link></Button></section>
      </main>
      <SiteFooter />
    </div>
  );
}
