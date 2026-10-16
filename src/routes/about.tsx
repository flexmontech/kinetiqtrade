import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kinetiq" },
      { name: "description", content: "Kinetiq builds ready-to-launch demo websites for top-rated home service businesses in the Chicago suburbs." },
      { property: "og:title", content: "About — Kinetiq" },
      { property: "og:description", content: "Demo websites for top-rated local businesses in the Chicago suburbs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const POINTS = [
  { t: "Identify", d: "We identify premier, top-rated local service businesses across Greater Chicagoland whose customer trust outpaces their digital footprint." },
  { t: "Architect", d: "Each business receives an interactive, high-converting web application showcasing their verified credentials, real customer reviews, and automated AI client capture." },
  { t: "Deploy", d: "Business owners test-drive their live custom platform directly on mobile and deploy to production on their own domain." },
];

function About() {
  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Websites that win local trust.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Great local businesses lose calls every day due to no web presence, no visibility and little or no product presence. Kinetiq turns their Google reputation into a site that converts.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {POINTS.map((p, i) => (
            <div key={p.t} className="rounded-xl border bg-card/80 p-5 backdrop-blur-md">
              <span className="font-display text-sm font-bold text-accent">0{i + 1}</span>
              <h2 className="mt-1 font-display text-xl font-bold">{p.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
