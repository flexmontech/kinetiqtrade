import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { REGION_NAMES } from "@/lib/leads";

const SOCIAL = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="h-1 bg-crimson" />
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-extrabold"><span className="kinetiq-word">Kinetiq</span><span className="text-crimson">.</span></p>
          <p className="mt-3 text-sm opacity-80">Our mission: help the best-reviewed local businesses win the customers they already deserve, with websites that turn five-star reputations into booked jobs.</p>
          <div className="mt-5 flex gap-2">
            {SOCIAL.map(({ label, Icon }) => (
              <a key={label} href="#" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-crimson text-crimson-foreground transition hover:brightness-110">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display font-bold text-crimson">Sitemap</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/leads" className="hover:underline">Sales Pipeline</Link></li>
            <li><Link to="/audits" className="hover:underline">Website Audits</Link></li>
            <li><Link to="/scanner" className="hover:underline">Find Prospects</Link></li>
            <li><Link to="/join" className="hover:underline">Join</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-bold text-crimson">Areas we cover</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            {REGION_NAMES.map((r) => <li key={r}>{r} Chicagoland</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-display font-bold text-crimson">Contact</h3>
          <ul className="mt-3 space-y-3 text-sm opacity-90">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />546 Main Street, Chicago, IL</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /><a href="tel:+16305550100" className="hover:underline">(630) 555-0100</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /><a href="mailto:info@kinetiq.tech" className="hover:underline">info@kinetiq.tech</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/15">
        <div className="mx-auto max-w-[1500px] space-y-2 px-6 py-5 text-xs opacity-70">
          <p>Disclaimer: Demo websites are samples created for prospective clients and are not affiliated with or endorsed by the businesses shown until claimed. Ratings and reviews are sourced from public listings. Pilot program — features may change.</p>
          <p>© {new Date().getFullYear()} Kinetiq. All rights reserved. · Privacy · Terms</p>
        </div>
      </div>
    </footer>
  );
}
