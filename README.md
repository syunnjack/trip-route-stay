# Trip Route Stay

Priority 1 app from the PDF deep-dive: travel route, accommodation and local spot monetization.

## Repository

Recommended repository name: `trip-route-stay`

## Domain candidates

Confirmed domain: `triproutestay.jp`

Other candidates:

- `ensenstay.jp`
- `busstayroute.jp`
- `tabistay.jp`
- `arrivalstay.jp`
- `ensennavi.jp`

## Concept

Trip Route Stay connects high-intent route searches to accommodation and nearby spots. It is aimed at users arriving by highway bus, train, event travel or hobby trips who need hotels, smoking-friendly rooms, bath/toilet filters, late-night food, manga cafes, lockers and rest spots.

## Technical Selection

- Frontend: Vite + React 19
- Styling: Plain CSS component stylesheet for speed and low maintenance
- Initial data: Static route seed data in `src/App.jsx`
- UGC: `localStorage` for MVP feedback, reports and saved leads
- Deployment target: GitHub Pages or static hosting
- Future data layer: Supabase or Cloudflare D1 when route pages and UGC need persistence
- Future APIs: Rakuten Travel, Jalan, bus affiliate feeds, Google Maps Places where permitted, LINE Messaging API
- SEO/AIO/LLMO: structured data in `index.html`, answer block, FAQ, sitemap, robots and `llms.txt`

## Revenue Paths

- Hotel booking affiliate
- Highway bus and travel affiliate
- Local spot listing ads
- Sponsored route pages
- Coupon lead generation
- LINE arrival alerts
- UGC-powered correction and review pages

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
