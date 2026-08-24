# SaasyCharms 💖

A jewellery storefront built with **Next.js 16** (App Router + TypeScript), **MongoDB** (products,
discount codes, orders), and **Cloudinary** (product image hosting) — with a real, password-protected
admin panel for managing everything, no coding needed after setup.

The site works immediately with sample placeholder products, and automatically switches to real
products the moment MongoDB is connected. Nothing breaks in between.

## Tech Stack

| Layer          | Choice                                   | Why |
|----------------|-------------------------------------------|-----|
| Framework      | Next.js 16 (App Router, TypeScript)       | Fast, SEO-friendly, free hosting on Vercel |
| Database       | MongoDB (free tier via Atlas)             | Stores products, discount codes, and orders |
| Images         | Cloudinary (free tier)                    | Product image hosting, uploaded from the admin panel |
| Admin panel    | Custom, at `/admin`                       | Single-password login (no accounts to manage) |
| Checkout       | WhatsApp hand-off, no payment gateway     | Customer fills a short form, order lands pre-filled in WhatsApp for the team to confirm |
| Styling        | Plain CSS (design tokens + components)    | No extra cost/complexity |
| Hosting        | Vercel (free tier)                        | Zero-cost hosting, auto-deploys from Git |
| Package manager| npm                                       | |

## Project Structure

```
app/
  layout.tsx              → root HTML shell + global fonts/CSS
  (site)/                 → all public storefront pages (share Navbar/Footer)
    page.tsx              → Home
    shop/page.tsx          → Shop (with category filter)
    shop/[slug]/page.tsx   → Product detail page
    cart/page.tsx          → Cart
    checkout/page.tsx      → Checkout (redirects to WhatsApp)
    about/page.tsx
    contact/page.tsx
    track/page.tsx         → Order tracking (by order number + phone)
    layout.tsx             → wraps pages with Navbar/AnnouncementBar/Cart
  admin/                  → password-protected admin panel (/admin)
    login/page.tsx
    (protected)/page.tsx        → dashboard
    (protected)/products/       → product CRUD + image upload
    (protected)/coupons/        → discount code CRUD
    (protected)/orders/         → order list + status updates
  api/
    orders/                → place an order, look up an order
    coupons/validate/      → validate a discount code at checkout
    admin/                 → auth + CRUD endpoints backing the admin panel
components/                → shared React components (Navbar, Footer, ProductCard, ...)
components/admin/          → admin panel components (forms, nav, etc.)
lib/
  products.ts              → fetches products from MongoDB (falls back to sample data)
  fallback-products.ts     → sample product data used before MongoDB is connected
  coupons.ts                → discount code lookup + validation
  mongodb.ts                → MongoDB connection
  cloudinary.ts              → Cloudinary image upload
  admin-auth.ts              → admin password check + session cookie
proxy.ts                    → protects /admin and /api/admin routes (Next.js 16's replacement for middleware.ts)
scripts/seed.mjs            → one-time script to load sample products into MongoDB
styles/                     → design tokens, base styles, components, per-page styles
styles/admin.css            → admin panel styling (separate from the storefront's branding)
legacy-static-site/        → the original static HTML/CSS/JS site, kept as a backup/reference
legacy-nextjs-site/         → the pre-redesign Next.js storefront (pages/components/styles), kept as a backup/reference
```

## Getting Started (local development)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The site will show sample products until MongoDB is connected (see
below), and `/admin` will work using the `ADMIN_PASSWORD` in your `.env.local`.

## Connecting MongoDB (so the store has real inventory)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string (Atlas → Connect → Drivers) and add it to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/saasycharms
   ```
3. Run the seed script to load starting inventory and the `SAASY10` discount code:
   ```bash
   npm run seed
   ```
4. Restart `npm run dev`. Products now come from MongoDB, and you can manage them at `/admin`.

## Connecting Cloudinary (for product image uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com/).
2. From the Cloudinary console, copy your **Cloud Name**, **API Key**, and **API Secret** into
   `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
3. Restart `npm run dev`. Product images uploaded through `/admin` now go to Cloudinary.

## Admin Panel

Visit `/admin` and log in with the password in `ADMIN_PASSWORD` (`.env.local`). From there you can:

- Add, edit, and delete products (with image upload)
- Create and manage discount codes
- View orders and update their status (Pending → Confirmed → Packed → Shipped → Delivered)

To change the admin password, just update `ADMIN_PASSWORD` in `.env.local` (or your host's
environment variables) and redeploy — no database migration needed.

## WhatsApp Checkout

Set your business WhatsApp number in `.env.local`:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
```

(Full international number, digits only, no `+` or spaces.) When a customer checks out, their order
is saved and they're redirected to WhatsApp with the order pre-filled, ready for your team to confirm.
No payment gateway is involved — you handle payment/COD however you normally do.

## Deploying (Vercel — free)

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign up with GitHub, and click **New Project** → import
   this repo.
3. Add all the environment variables from `.env.local` in Vercel's project settings
   (**Settings → Environment Variables**): `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
   `NEXT_PUBLIC_SITE_URL` (set this to your real domain once you have one).
4. Click Deploy. You'll get a free `*.vercel.app` URL immediately.

## Adding a Custom Domain

Once the client buys a domain (e.g. from Namecheap/GoDaddy):

1. In Vercel, go to **Settings → Domains** and add the domain.
2. Vercel will show 1–2 DNS records (usually an `A` record and/or `CNAME`) to add at the domain
   registrar. Add those records there.
3. Wait for DNS to propagate (a few minutes to a few hours) — Vercel issues a free SSL certificate
   automatically.
4. Update `NEXT_PUBLIC_SITE_URL` to the final domain (e.g. `https://saasycharms.pk`) in Vercel's
   environment variables and redeploy, so SEO tags and the sitemap use the right URL.

## Notes

- The `legacy-static-site/` folder is the original static HTML/CSS/JS version of the site, kept
  purely as a reference/backup. It is not used by the Next.js app and can be deleted once you're
  confident everything has migrated over correctly.
- The `legacy-nextjs-site/` folder is a snapshot of the storefront's pages, components, and styles
  from before the visual redesign — kept purely as a reference/backup in case you want to compare
  or revert something. It is not used by the live app.
- If MongoDB or Cloudinary aren't configured, the storefront still runs on bundled sample data —
  useful for local development before you've set anything up, and as a safety net if the database
  is briefly unreachable in production.
