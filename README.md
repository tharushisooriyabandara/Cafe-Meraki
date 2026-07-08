# Cafe Meraki Sri Lanka — Website

A modern, responsive restaurant website for **Cafe Meraki Sri Lanka**, inspired by [Wildish Restaurant](https://wildish.lk/).

## Quick Start

Open `index.html` in your browser, or run a local server:

```bash
# Python
python -m http.server 8080

# Node.js (if npx available)
npx serve .
```

Then visit `http://localhost:8080`

## Structure

```
Cafe Meraki/
├── index.html      # Main page (all sections)
├── css/
│   └── styles.css  # Styles
├── js/
│   └── main.js     # Interactivity
└── assets/         # Place logo & photos here
```

## Sections

- **Hero** — Full-screen intro with tagline & CTAs
- **Highlights** — Key features (coffee, cuisine, location, reviews)
- **Our Story** — Brand narrative around "meraki"
- **Menu** — Tabbed categories with dishes & prices
- **Gallery** — Visual experience grid
- **Reviews** — Guest testimonials carousel
- **FAQ** — Common questions
- **Contact** — Visit info + reservation form

## Customization

1. **Photos** — Replace Unsplash placeholder images in `index.html` with your own (save to `assets/`)
2. **Menu** — Update dishes and prices in the Menu section
3. **Reviews** — Add real Facebook/Google reviews
4. **Hours** — Adjust if different from Mon–Sat 11:00 AM – 11:00 PM
5. **Social links** — Facebook, Instagram & TikTok are linked site-wide

## Contact Info (current)

- **Address:** No. 7, Gemunu Mawatha, Moratuwa
- **Phone:** +94 77 785 0750
- **Email:** cafemerakisrilanka@gmail.com
- **Facebook:** [Cafe Meraki Sri Lanka](https://www.facebook.com/profile.php?id=61561861116745)
- **Instagram:** [@cafemeraki.srilanka](https://www.instagram.com/cafemeraki.srilanka/)
- **TikTok:** [@cafemeraki](https://www.tiktok.com/@cafemeraki)

## Deployment

Upload all files to any static hosting (Netlify, Vercel, GitHub Pages, or your web host). No build step required.

### Deploy on Vercel (recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New → Project**.
3. Import **tharushisooriyabandara/Cafe-Meraki**.
4. Leave settings as defaults (no build command, output directory is the project root).
5. Click **Deploy**.

Your site will be live at a `*.vercel.app` URL. You can add a custom domain under **Project → Settings → Domains**.

**CLI (optional):**

```bash
npx vercel
npx vercel --prod
```
