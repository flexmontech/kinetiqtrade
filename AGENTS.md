<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Lead rules (scoring, high-trust, pitch templates, trade content) live in src/lib/leads.ts with tests beside it — one source for dashboard and demo sites.
- Demo site views are counted only via the record_lead_view database function, called client-side; dashboard previews pass ?track=0 so the owner's own views don't count.
- Phase 1 has no login: the leads table is open to anyone with the app. Add auth before sharing the dashboard URL.
- Demo photography is bundled locally and selected by trade in the preview route; demo-scoped semantic tokens keep presentation changes isolated from the CRM.
- Prospect scanning lives in src/lib/scanner.ts and returns deterministic generated listings; keep every listing field produced there so the live listings provider can be swapped in behind scanProspects without touching the UI.
