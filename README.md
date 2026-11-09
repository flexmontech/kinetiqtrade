# KINETIQ

Build Phase 1 of the local business lead generation and demo website sales platform (focused on home service trades like HVAC, roofing, plumbing, tree service, and landscaping in the Chicago suburbs including Aurora, Joliet, Naperville, Bolingbrook, and Wheaton):

Key Features & Architecture:

1. Pipeline CRM Dashboard:
   - Visual lead pipeline with view switcher (Kanban board and data table view).
   - Pipeline stages: 'Discovered', 'Demo Ready', 'Pitched', 'Viewed', 'Won'.
   - Lead cards display business name, trade category badge, city, Google star rating, review count, and a calculated 'Opportunity Score' highlighting high-trust businesses (4.5+ stars, 15+ reviews).
   - Quick search and filters by trade category (HVAC, Roofing, Plumbing, Tree Service, Landscaping, Painting) and suburb location.
   - Pre-loaded with realistic sample trade leads across the Chicago western suburbs so it is immediately testable and interactive.
   - 'Add Lead' modal allowing easy manual entry of new prospects.

2. Dynamic Demo Site Engine (Public Route `/preview/:slug`):
   - A single dynamic, responsive landing page renderer that populates from the lead's data.
   - Category-specific theme accents and iconography tailored to the trade (e.g., cool blue for HVAC, slate/terracotta for roofing, clean navy for plumbing, forest green for landscaping).
   - Sections include: Sticky tap-to-call mobile bar, seasonal hero with emergency headline, trust badge strip (Licensed & Insured, Free Estimates), service offerings grid, real testimonial cards quoting their Google reviews, service area tags, and a free estimate request form.
   - Top banner: 'Demo site created for [Business Name] — Claim and launch on your domain' with contact/checkout CTA.
   - In-dashboard preview drawer featuring a Mobile / Desktop frame toggle so the user can inspect the demo before sending.

3. Live View Tracking:
   - When `/preview/:slug` is visited, increment the lead's view count and update last viewed timestamp.
   - In the dashboard, visually highlight leads who recently opened their link ('🔥 Viewed just now').

4. Multi-Channel Pitch Generator:
   - In each lead's detail panel, a tabbed pitch generator with:
     - Short Cold Email (under 75 words, focusing on missed calls and linking their demo)
     - SMS / Text Message (brief message asking if they want to see their demo on their phone)
     - Cold Call Quick Script (talking points for when calling the Google Maps listed number)
   - Dynamic injection of owner name, business name, rating, suburb, and live demo link with 1-click copy buttons.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kinetiqtrade.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1801e2f8-1e81-4196-adf7-725fc6ea4187).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
