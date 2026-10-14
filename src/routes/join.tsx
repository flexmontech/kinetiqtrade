import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the pilot — Kinetiq" },
      { name: "description", content: "Request access to the Kinetiq pilot for local trade demo websites." },
      { property: "og:title", content: "Join the pilot — Kinetiq" },
      { property: "og:description", content: "Request access to the Kinetiq pilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Join,
});

function Join() {
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent) { e.preventDefault(); setSent(true); }
  return (
    <div className="kinetiq-bg min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-md px-6 py-14">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Join the pilot</h1>
        <p className="mt-3 text-muted-foreground">Kinetiq is in early pilot. Leave your details and we'll be in touch.</p>
        {sent ? (
          <div className="mt-8 rounded-xl border bg-card/80 p-6 font-semibold">Thanks — you're on the list.</div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-3 rounded-xl border bg-card/80 p-6 backdrop-blur-md">
            <Input required placeholder="Your name" />
            <Input required type="email" placeholder="Email" />
            <Input placeholder="Business or company (optional)" />
            <Button type="submit" className="w-full">Request access</Button>
          </form>
        )}
      </main>
    </div>
  );
}
