# SaasyCharms 💖

Delicate, handcrafted jewellery storefront — a static, multi-page marketing/e-commerce front-end built with plain HTML, CSS and JavaScript (no build step required).

## Project Structure

```
sassycharmsss/
├── index.html                 Home page
├── shop.html                  Shop / product listing page
├── about.html                 About / brand story page
├── contact.html                Contact page
├── track.html                  Order tracking page
├── assets/
│   ├── css/
│   │   ├── variables.css      Design tokens (colors, fonts, shadows)
│   │   ├── base.css           Global reset & element defaults
│   │   ├── main.css           Imports variables + base + shared components
│   │   ├── components/        Reusable UI pieces (navbar, buttons, footer, forms, product-card, ...)
│   │   └── pages/              Page-specific styles (home, shop, about, contact, track)
│   ├── js/
│   │   ├── modules/            Shared behaviour (navbar, cart, newsletter, scroll-reveal)
│   │   └── pages/               Page-specific scripts (shop filters, contact form, order tracking)
│   └── images/                  Local image assets (product photos currently load from Unsplash URLs)
├── scripts/
│   └── dev-server.js           Zero-dependency Node static file server for local development
├── package.json
├── .editorconfig
└── .gitignore
```

### Why this structure?

- **Separation of concerns** – design tokens, base styles, reusable components and page-specific styles each live in their own file instead of one large stylesheet.
- **No duplication** – markup that repeated across pages (page headers, form fields, buttons) was previously copy-pasted as inline `<style>` blocks; it's now a single shared component file.
- **Predictable JS** – shared behaviour (navbar, cart, newsletter, animations) lives in `assets/js/modules`, while page-only logic (shop filters, contact form, order tracking) lives in `assets/js/pages`. Each page only loads the scripts it actually needs.
- **Zero build tooling required** – since this is a static site, everything runs directly in the browser. `package.json` + `scripts/dev-server.js` just provide a convenient local dev server.

## Getting Started

### Option 1 — Node (recommended, zero dependencies)

```bash
npm run dev
```

Then open [http://localhost:5500](http://localhost:5500) in your browser.

### Option 2 — Python

```bash
python -m http.server 5500
```

### Option 3 — Any static file server / VS Code Live Server extension

Simply serve the project root directory; `index.html` is the entry point.

## Tech Stack

- HTML5
- CSS3 (custom properties / design tokens, CSS Grid & Flexbox)
- Vanilla JavaScript (no frameworks, no bundler)
- [Google Fonts](https://fonts.google.com/) — Cormorant Garamond & Jost
- [Font Awesome](https://fontawesome.com/) icons (via CDN)
