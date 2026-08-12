# SaasyCharms 💖

A jewellery storefront built with **Next.js 16** (App Router + TypeScript) and **Sanity CMS**, so the
store owner can add/edit/remove products themselves — no coding needed, and **zero monthly cost**
using free tiers.

The site works immediately with sample placeholder products, and automatically switches to real
products the moment a Sanity project is connected. Nothing breaks in between.

## Tech Stack

| Layer          | Choice                                   | Why |
|----------------|-------------------------------------------|-----|
| Framework      | Next.js 16 (App Router, TypeScript)       | Fast, SEO-friendly, free hosting on Vercel |
| Content (CMS)  | Sanity.io (free tier)                     | Client can manage products without touching code |
| Styling        | Plain CSS (design tokens + components)    | Ported 1:1 from the original design, no extra cost/complexity |
| Hosting        | Vercel (free tier)                        | Zero-cost hosting, auto-deploys from Git |
| Package manager| Yarn                                      | |

## Project Structure

```
app/
  layout.tsx              → root HTML shell + global fonts/CSS
  (site)/                 → all public storefront pages (share Navbar/Footer)
    page.tsx              → Home
    shop/page.tsx          → Shop (with category filter)
    about/page.tsx
    contact/page.tsx
    track/page.tsx
    layout.tsx             → wraps pages with Navbar/AnnouncementBar/Cart
  studio/[[...tool]]/page.tsx → embedded Sanity Studio admin panel (/studio)
components/                → shared React components (Navbar, Footer, ProductCard, ...)
lib/
  products.ts              → fetches products from Sanity (falls back to sample data)
  fallback-products.ts     → sample product data used before Sanity is connected
  sanity.ts / image.ts     → Sanity client + image URL helpers
sanity/
  schemaTypes/product.ts   → the "Product" content model shown in the Studio
sanity.config.ts           → Sanity Studio configuration
styles/                    → design tokens, base styles, components, per-page styles
legacy-static-site/        → the original static HTML/CSS/JS site, kept as a backup/reference
```

## Getting Started (local development)

```bash
yarn install
yarn dev
```

Visit `http://localhost:3000`. The site will show sample sample products until Sanity is connected
(see below).

## Connecting Sanity (so the client can manage products)

This step takes about 10 minutes and is **completely free**.

1. Go to [sanity.io](https://www.sanity.io/) and sign up for a free account.
2. Run this in the project folder and follow the prompts (choose "Create new project", any dataset
   name like `production`, and select **empty project** — our schema is already in the code):
   ```bash
   yarn dlx sanity init
   ```
   Or manually create a project at [sanity.io/manage](https://www.sanity.io/manage) and note down
   the **Project ID**.
3. Copy `.env.local.example` to `.env.local` and fill in your project ID:
   ```bash
   cp .env.local.example .env.local
   ```
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```
4. Also add your local dev URL as a CORS origin so the Studio can talk to Sanity:
   ```bash
   yarn dlx sanity cors add http://localhost:3000 --credentials
   ```
5. Restart `yarn dev`, then open `http://localhost:3000/studio` — log in with your Sanity account,
   and start adding products. They'll appear on the live site immediately (no redeploy needed).

Once real products are added, the "Show on Homepage" checkbox controls which ones appear as
Bestsellers on the home page.

## Deploying (Vercel — free)

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign up with GitHub, and click **New Project** → import
   this repo.
3. Add the same three environment variables from `.env.local` in Vercel's project settings
   (**Settings → Environment Variables**).
4. Also allow your live domain in Sanity's CORS settings:
   ```bash
   yarn dlx sanity cors add https://your-site.vercel.app --credentials
   ```
5. Click Deploy. You'll get a free `*.vercel.app` URL immediately.

## Adding a Custom Domain

Once the client buys a domain (e.g. from Namecheap/GoDaddy):

1. In Vercel, go to **Settings → Domains** and add the domain.
2. Vercel will show 1–2 DNS records (usually an `A` record and/or `CNAME`) to add at the domain
   registrar. Add those records there.
3. Wait for DNS to propagate (a few minutes to a few hours) — Vercel issues a free SSL certificate
   automatically.
4. Add the final domain (e.g. `https://saasycharms.pk`) as a Sanity CORS origin too:
   ```bash
   yarn dlx sanity cors add https://saasycharms.pk --credentials
   ```

## Notes

- The `legacy-static-site/` folder is the original static HTML/CSS/JS version of the site, kept
  purely as a reference/backup. It is not used by the Next.js app and can be deleted once you're
  confident everything has migrated over correctly.
- The cart in the navbar is a simple in-memory demo counter (no real checkout yet) — wire it up to
  a real payment/checkout flow (e.g. Stripe, JazzCash, EasyPaisa) when ready to accept real orders.
