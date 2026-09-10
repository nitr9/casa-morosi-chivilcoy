# Casa Morosi · Chivilcoy

Landing page and product catalogue for a hardware store that has been open for
more than 100 years in Chivilcoy, Buenos Aires. The owner loads products from a
browser panel; the site updates itself.

**[casamorosichivilcoy.netlify.app](https://casamorosichivilcoy.netlify.app/)**

![The site's home page](img/_readme/portada.webp)

---

## What it does

- **Catalogue** — 14 categories, product pages with photos, specs and price.
- **Search** — client-side, over the whole catalogue.
- **Weekly deals** — a product marked as an offer surfaces on the home page.
- **WhatsApp first** — every product links to a pre-written message. In a town
  of 70,000 people, nobody fills in a contact form; they write on WhatsApp.
- **Admin panel** (`admin.html`) — the owner adds, edits and deletes products
  from any browser, phone included. No CMS, no build step, no deploy needed to
  publish a product.

## Stack

**Plain HTML, CSS and JavaScript. No framework, no bundler, no `package.json`.**

That is a decision, not a shortcut. The site has to outlive whoever maintains
it: in three years there is no dependency to update, no build that breaks, no
toolchain to reinstall. Anyone who knows HTML can open a file and fix a typo.

| | |
|---|---|
| Front end | HTML + CSS + ES modules, no dependencies |
| Data | Cloud Firestore |
| Auth | Firebase Authentication (email + password, one account) |
| Hosting | Netlify (static) |
| Images | WebP, `srcset` at three widths (800 / 1200 / 1449) |

### Two decisions worth explaining

**Product photos live inside the Firestore document, not in Storage.** Firebase
requires a paid plan to create a Storage bucket. The project belongs to the shop
owner, not to me, and a project with no billing attached is trivial to hand
over. So the panel resizes every photo to 1000 px and under 700 KB before
saving — comfortably below Firestore's 1 MB per-document limit. No credit card,
and for the owner it works exactly the same.

**Writes are locked to specific user IDs.** Firestore rules allow public reads
and restrict every write to two named UIDs, rather than to "any signed-in user".
Firebase leaves public sign-up enabled by default, which means `auth != null`
is one HTTP request away from being anyone at all. Public sign-up is off, and
the rules do not depend on that checkbox staying off.

## Running it locally

Node is the only requirement, and only to serve the files.

```bash
node servidor.mjs        # http://localhost:8123
```

The admin panel is at `/admin.html`. **It will not work if you open the HTML
file directly** — it uses ES modules, which need to be served over HTTP.

Add `?demo=1` to any URL to browse the site with sample products, without
touching Firebase.

To connect a Firebase project of your own, fill in `js/firebase-config.js` and
follow `FIREBASE.md` — it carries the Firestore rules and, more usefully, the
reasoning behind them. Those keys are public by design; the security lives in
the rules.

## Deploying

```bash
node publicar.mjs https://your-site.netlify.app
```

Builds a `publicar/` folder ready to drop into Netlify. The argument is not
optional: Open Graph tags need absolute URLs, and the domain is not known until
Netlify assigns one, so the script writes it into the HTML, `sitemap.xml` and
`robots.txt`. Connecting the repository to Netlify instead works too — see
`DESPLIEGUE.md`.

## Repository layout

```
index.html · rubro.html · producto.html · admin.html · 404.html
css/estilos.css        one stylesheet, heavily commented
js/                    one module per concern (catalogue, search, panel, cards)
img/                   27 photos of the shop, 10 brand logos, 14 categories
servidor.mjs           local server
publicar.mjs           builds the folder to deploy
hornear-rubros.mjs     regenerates category images
cinemagraph.js         build-time only: assembles the hero video
```

The last three are tools, not part of the site: they run on my machine and
never reach the browser.

## About the documentation

`PENDIENTES.md` is the main document, and it is long on purpose. Almost every
entry records the number that was measured and the reason behind the decision —
contrast ratios, horizontal overflow at each width, why an approach was tried
and dropped. It is written in Spanish, like the code comments and the commit
messages.

The point is that six months later the reason is still there. Several entries
exist only to stop someone —me included— from redoing something that was
already tried and measured.

---

Built for Casa Morosi. The code is here to be read; the photographs and the
brand are the shop's.
