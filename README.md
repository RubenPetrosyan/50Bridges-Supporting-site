# Fifty Bridges — Carrier Lookup & Resources (50bridgesinsuranceservices.com)

A supporting site for Fifty Bridges Insurance Services, Inc. (main site: https://www.50bridges.com/).
Rebuilt 2026-11-24 as a tools-and-resources hub: a free carrier lookup by US DOT number, with
guides to follow in later phases. Quote requests are handled on the main website — this site
does not run its own quote form.

## What's here

- **Carrier DOT lookup** (`/` and `/dot-lookup/`) — enter a US DOT number and see the carrier's
  public FMCSA record: USDOT and authority status, company snapshot, and insurance filing
  history. Data comes from the FMCSA SAFER Company Snapshot and FMCSA open data via the
  serverless function `api/carrier.js` (`/api/carrier?dot=…`). The insurance history covers
  cancelled/replaced filings only (that is what the open dataset publishes); the current
  active filing lives in FMCSA's Motus public snapshot, and every result links to it.
  Nothing is invented: fields the sources leave empty render as —.
- **Privacy policy** (`/privacy-policy/`).
- Static site, no build step. Shared styles in `assets/styles.css`, lookup widget in
  `assets/lookup.js`. Deploy: Vercel project `50bridges-supporting-site`, Framework Preset: Other.

## Content rules

- Verified facts only; FMCSA data presented as published, with its as-of date.
- No claims of services, credits, or portals that do not exist today.
- Agency NAP: Fifty Bridges Insurance Services, Inc., 4695 MacArthur Ct, Suite 1100,
  Newport Beach, CA 92660 — (949) 685-7772 — quotes@50bridges.com.
- Licensed in 17 states: AZ, CA, CO, GA, IL, IN, NC, NJ, NV, OH, OR, PA, SC, TX, UT, VA, WA.
