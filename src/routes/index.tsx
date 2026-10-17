import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MonitorSmartphone, Radar, Handshake, Star, MapPinned, Zap, MessageCircle, Reply, Bot } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { REGION_NAMES } from "@/lib/leads";

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
      <main className="mx-auto max-w-[1200px] px-6">
        <section className="py-20 text-center md:py-28">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1.5 text-sm font-semibold backdrop-blur"><Zap className="h-4 w-4 text-crimson" />Now piloting across Chicagoland</p>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Great businesses deserve <span className="kinetiq-word">great websites</span> — and more customers.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Kinetiq builds web apps for local home service businesses, finds the best-reviewed prospects, and turns them into paying clients.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/join" className="inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 font-bold text-crimson-foreground shadow-lg transition hover:brightness-110">Join <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/leads" className="inline-flex items-center gap-2 rounded-full border-2 border-crimson bg-card/80 px-7 py-3.5 font-bold backdrop-blur transition hover:bg-card">See live leads</Link>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {PILLARS.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card/85 p-7 shadow-xl backdrop-blur-md transition hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-crimson text-crimson-foreground"><Icon className="h-6 w-6" /></span>
              <h2 className="mt-5 font-display text-2xl font-bold">{title}</h2>
              <p className="mt-2 text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section className="py-16">
          <h2 className="text-center font-display text-4xl font-extrabold">Websites that win local trust.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">Great local businesses lose calls every day due to no web presence, no visibility and little or no product presence. Kinetiq turns their Google reputation into a site that converts.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {ABOUT_POINTS.map((p, i) => (
              <div key={p.t} className="rounded-xl border bg-card/85 p-6 backdrop-blur-md">
                <span className="font-display text-sm font-bold text-crimson">0{i + 1}</span>
                <h3 className="mt-1 font-display text-xl font-bold">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-4 rounded-2xl bg-foreground p-8 text-background md:grid-cols-3">
          <div><p className="flex items-center gap-2 font-display text-4xl font-extrabold"><Star className="h-7 w-7 fill-current text-crimson" />4.5+</p><p className="opacity-80">star businesses with 15+ reviews targeted first</p></div>
          <div><p className="flex items-center gap-2 font-display text-4xl font-extrabold"><MapPinned className="h-7 w-7 text-crimson" />{REGION_NAMES.length}</p><p className="opacity-80">Chicagoland regions covered</p></div>
          <div><p className="flex items-center gap-2 font-display text-4xl font-extrabold"><Zap className="h-7 w-7 text-crimson" />1 click</p><p className="opacity-80">from lead to live demo site</p></div>
        </section>

        <section className="py-16">
          <h2 className="text-center font-display text-4xl font-extrabold">From prospect to client in five steps</h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s} className="rounded-xl border bg-card/85 p-5 backdrop-blur-md"><span className="font-display text-3xl font-extrabold text-crimson">{i + 1}</span><p className="mt-2 font-semibold">{s}</p></li>
            ))}
          </ol>
        </section>

        <section className="mb-16 rounded-3xl border bg-card/85 p-8 backdrop-blur-md md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent"><Bot className="h-4 w-4" />AI tools for your clients</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold">Every site comes with AI that works while they sleep</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Try them live on any demo site — open the chat bubble or read the owner replies under each review.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {AI_TOOLS.map(({ Icon, title, text }) => (
              <div key={title} className="rounded-2xl border bg-background p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-3xl bg-crimson p-10 text-center text-crimson-foreground md:p-14">
          <h2 className="font-display text-4xl font-extrabold">Ready to grow your client list?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">Join Kinetiq and get your first demo-ready prospects this week.</p>
          <Link to="/join" className="mt-7 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 font-bold text-foreground transition hover:brightness-95">Get started <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
