# Erea customer websites

Every Erea customer gets a website in one of the looks, at a free address like `willow.ereaai.com`.

- `sites/<slug>/site.json` holds the business's info sheet (name, look, booking id, services, prices, about, team, FAQ, hours, contact, photos).
- `node sites/_build/build.js <slug>` turns it into `sites/<slug>/index.html` (one self-contained page). `--all` rebuilds every site.
- Photos and short videos go in the same folder (`sites/<slug>/hero.jpg` etc.) and are named in site.json.
- Push to main, and it's live at `https://ereaai.com/sites/<slug>/` within about a minute, plus `https://<slug>.ereaai.com` once the traffic director (worker.js) is set up.
- The real Erea booking page (with the waitlist) is embedded in the site's "Book" section.

Looks built so far: `linen` (feminine: Pilates, yoga, barre, beauty) and `crown` (masculine: barbers, grooming). Daylight, Evening and Forge from /styles come later.

## site.json fields
Required: `look`, `name`, `bookingId` (from newStudio).
Optional: `eyebrow`, `headline` (wrap words in *stars* for the accent italic), `intro`, `description`, `seoTagline`,
`labels` {book, services, pricing, about, visit}, `services` [{name, desc, length, price}], `pricing` [{plan, price, details, featured}],
`about` [paragraphs], `aboutTitle`, `aboutEyebrow`, `aboutMedia`, `team` [{name, role, photo}], `gallery` [photos],
`youtube` (video id), `waitlist` {eyebrow, text, button}, `faq` [{q, a}], `hours` [lines],
`contact` {address, phone, email, instagram}, `logo`, `favicon`, `ogImage`, `domain` (their own domain, if any),
`colors` {bg, paper, ink, muted, accent, soft, line, btn, btnink, dark, darkink} to swap in the business's own colors.

Photos: `"heroMedia": "hero.jpg"`. Muted looping video: `"heroMedia": {"video": "hero.mp4", "poster": "hero.jpg"}`.
Keep each file well under 25 MB (Cloudflare Pages limit). Compress clips to 10–20 seconds. Longer videos go on the business's YouTube (`youtube`).
No photo yet → a tasteful placeholder in the look's colors.

## A business's own brand (plug and play)
One block, used in TWO places so the website, booking page and Front Desk all match:
```
"brand": { "colors": { "dark": "#1E2A44", "accent": "#C9A227" }, "headFont": "Playfair Display", "bodyFont": "Inter" }
```
1. Put it in their site.json as "brand" → rebuild → push (website).
2. In the Erea script fill BRAND_SET = { studioKey, look: 'linen' or 'crown', colors: {...same...}, headFont, bodyFont } → Run studioBrand (booking page + Front Desk). No redeploy needed.
Colors you leave out keep the look's own. Keys: dark (text + main buttons), accent (highlights), light (header/pills), bg (page), paper (cards), line (borders), muted (small text), onDark (text on dark), stripe (Crown pole/band), btn (Front Desk buttons).
Saved per business: one business's brand never changes another's. NEVER edit the base looks (LOOKS in build.js, BRAND_LOOKS in the script) for one customer; the base looks are shared by everyone on that look. Kwame (Nov 11): the templates themselves won't change, only colors, fonts and photos.

## One-time setup: the traffic director (Kwame's Cloudflare sign-in needs an emailed code)
1. Cloudflare → Workers & Pages → Create → Worker → name it `erea-sites` → Deploy → Edit code → paste `worker.js` → Deploy.
2. The Worker → Settings → Domains & Routes → Add → Route: `*.ereaai.com/*`, zone ereaai.com.
3. ereaai.com zone → DNS → Add record: type `AAAA`, name `*`, address `100::`, Proxied (orange cloud) ON.
4. Test: open https://willow.ereaai.com and https://crownline.ereaai.com.
Free: Workers free plan covers 100,000 visits a day. Email (MX) is not affected by the `*` record.

## Adding a customer
1. Pick a short slug (letters, numbers, dashes): their name, e.g. `willow`.
2. Make `sites/<slug>/site.json` from their info (copy a sample: willow = linen, crownline = crown). Booking id comes from newStudio.
3. `node sites/_build/build.js <slug>`, look at it, push to main.
4. Their address `https://<slug>.ereaai.com` works right away (no Cloudflare clicks).
5. Write the site address into their HQ folder.

## Own domain add-on ($5/mo)
1. Customer adds it at checkout or with the standalone link. Ask which domain if Stripe didn't.
2. Check it's free at Cloudflare → Domain Registration → Register. Tell Kwame the domain + total (~$11/yr for .com). Kwame clicks Buy (his card is saved). Auto-renew ON.
3. Add the domain to the `DOMAINS` list in worker.js (`'theirname.com': '<slug>'`), paste the new code into the Worker, Deploy.
4. Worker → Domains & Routes → add routes `theirname.com/*` and `www.theirname.com/*` (zone = their domain).
5. Their domain's DNS → add `AAAA @ 100::` and `AAAA www 100::`, both Proxied.
6. Set `"domain": "theirname.com"` in their site.json, rebuild, push.
A domain they already own: they point its nameservers to Cloudflare (free plan) or we add it as a zone, then steps 3–6. Free.
