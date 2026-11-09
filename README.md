# KinetiqTrade
### Website demos and lead generation for local service businesses

**A FLEXMON LLC product**  
*#Tech + #AI — The Future. | USA | Europe | Africa*

KinetiqTrade helps web-service providers identify promising local businesses, create tailored website demos, and turn those opportunities into organised sales conversations. Built with home-service trades in mind, it brings prospect discovery, demo presentation, lead tracking, and follow-up messaging together in one practical workflow—so a business can see what its website could look like before deciding whether to move forward.

---

## What KinetiqTrade Does

KinetiqTrade is a local-business lead generation and demo website sales platform. Its initial focus is home-service businesses such as HVAC, roofing, plumbing, tree service, landscaping, and painting across Chicago's western suburbs, including Aurora, Joliet, Naperville, Bolingbrook, and Wheaton.

The platform supports a simple sales journey:

1. Identify a prospective business and review its public website and online presence.
2. Assess the opportunity and organise the prospect in a lead pipeline.
3. Prepare a tailored website demo for that business.
4. Share the demo and track whether it has been viewed.
5. Follow up with a relevant email, text message, or call.

## Core Features

### 1. Lead Pipeline CRM

- Kanban board and data-table views.
- Pipeline stages: **Discovered**, **Demo Ready**, **Pitched**, **Viewed**, and **Won**.
- Lead cards show business name, trade category, city, Google star rating, review count, and an Opportunity Score.
- Opportunity Score highlights high-trust businesses (4.5+ stars and 15+ reviews).
- Search and filters by trade category and suburb.
- Sample local trade leads for immediate testing.
- Add Lead modal for manually entering prospects.

### 2. Dynamic Website Demo Engine

Public demo route: `/preview/:slug`

A reusable responsive landing-page renderer populates a demo from each lead's business data.

- Trade-specific visual themes and iconography.
- Mobile sticky tap-to-call bar and seasonal hero section.
- Trust badges, service grids, service-area tags, and estimate-request form.
- Testimonial cards based on review content where available and appropriately verified.
- Demo banner inviting the business to claim and launch its site on its own domain.
- Dashboard preview drawer with Mobile and Desktop views.

### 3. Demo View Tracking

- Visiting a public demo increments its view count.
- The system records the last-viewed timestamp.
- The dashboard highlights recently viewed demos (for example, “Viewed just now”).

### 4. Multi-Channel Pitch Generator

The lead detail panel provides tailored outreach drafts:

- **Cold email:** under 75 words, focused on the business opportunity and demo link.
- **SMS/text:** short message inviting the prospect to view the demo.
- **Cold-call script:** concise talking points for an initial call.

Drafts can dynamically include available business details such as owner name, business name, rating, suburb, and demo link, with one-click copy controls.

## Responsible Use

- Use public business information responsibly and respect applicable website terms.
- Collect only the personal information needed for legitimate business follow-up.
- Do not present unverified reviews, ratings, credentials, licences, insurance, or performance claims as fact.
- Treat generated website content and outreach as drafts requiring human review.
- Obtain appropriate permission before publishing a demo as a live business website or sending outreach.
- Keep prospect data accurate, relevant, and appropriately protected.

## Project Status

**Owner:** FLEXMON LLC  
**Project:** KinetiqTrade  
**Status:** Active development

**Live application:** https://kinetiqtrade.lovable.app

## Technology & Development

Built with [Lovable](https://lovable.dev).

Continue development in the [Lovable editor](https://lovable.dev/projects/1801e2f8-1e81-4196-adf7-725fc6ea4187).

- Changes made in Lovable are synchronised to this GitHub repository.
- Changes pushed to the `main` branch can sync back to Lovable.
- The source code is maintained in this repository.

### Run Locally

Requirements: Node.js and npm. [Install Node.js with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone https://github.com/flexmontech/kinetiqtrade.git
cd kinetiqtrade
npm install
npm run dev
```

---

**FLEXMON LLC**  
AI-powered solutions | Web development | Healthcare logistics  
[flexmon.tech](https://www.flexmon.tech) · info@flexmon.tech
