#!/usr/bin/env node
/*
  Erea customer website builder.
  Each customer has a folder sites/<slug>/ with a site.json (their info sheet)
  and any photos/videos. This script turns site.json into sites/<slug>/index.html:
  one self-contained page (styles inside), hosted free on Cloudflare Pages.

  Run:  node sites/_build/build.js <slug>      (one site)
        node sites/_build/build.js --all       (every site)

  Live at:  https://<slug>.ereaai.com   (via the traffic director, sites/_build/worker.js)
  Always also at: https://ereaai.com/sites/<slug>/
  Looks available: "linen" (feminine) and "crown" (masculine). Others from /styles come later.
*/
const fs = require('fs');
const path = require('path');

const SITES = path.join(__dirname, '..');
const BOOK_ENGINE = 'https://script.google.com/macros/s/AKfycbxnhmsae-Wl7sJSyyo6Zg5PSRsYzGLPsq7cWicfp-AxL3M8yOcO9cjweCp2rJEhTICx/exec';

// ---------- looks ----------
const LOOKS = {
  linen: {
    fonts: 'family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500;600',
    vars: { bg: '#F5EFE6', paper: '#FBF8F3', ink: '#2A2420', muted: '#6B6058', accent: '#9A6A4F', soft: '#E4D6C5', line: '#E6DDD1', btn: '#2A2420', btnink: '#FBF8F3', dark: '#2A2420', darkink: '#FBF8F3' },
    head: "'Cormorant Garamond',Georgia,serif", body: "'Jost',system-ui,sans-serif",
    css: `
.brand{letter-spacing:6px;text-transform:uppercase;font-size:22px}
.nav a,.btn,.eyebrow,.k{letter-spacing:2px;text-transform:uppercase}
.btn{border-radius:999px;font-size:13px}
h1{text-transform:uppercase;letter-spacing:1px;font-weight:400}
h2{font-weight:400;text-transform:uppercase;letter-spacing:2px}
.card,.plan,.bookbox,.media,.qa{border-radius:22px}
.media.ph{background:radial-gradient(120% 90% at 30% 20%,#EFE4D6 0,#E4D6C5 45%,#D6C3AE 100%)}
.media.ph:after{content:"";position:absolute;inset:18% 22%;border-radius:999px 999px 24px 24px;border:1px solid rgba(154,106,79,.35)}
.band{background:var(--soft)}
`
  },
  crown: {
    fonts: 'family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Work+Sans:wght@400;500;600',
    vars: { bg: '#F2EADB', paper: '#FFFDF8', ink: '#0F1B2D', muted: '#4F5868', accent: '#B8893B', soft: '#E8DCC2', line: '#D6CBB6', btn: '#B8893B', btnink: '#0F1B2D', dark: '#0F1B2D', darkink: '#F2EADB', red: '#7A2E2A' },
    head: "'Playfair Display',Georgia,serif", body: "'Work Sans',system-ui,sans-serif",
    css: `
body:before{content:"";display:block;height:10px;background:repeating-linear-gradient(135deg,var(--red) 0 14px,#F2EADB 14px 28px,#0F1B2D 28px 42px,#F2EADB 42px 56px)}
.top{background:var(--dark);color:var(--darkink);border-bottom:1px solid #2A3A55}
.top .nav a{color:#D9CFBD}
.brand{font-weight:900;font-size:24px}
.nav a,.btn,.eyebrow,.k{letter-spacing:2px;text-transform:uppercase;font-weight:600}
.btn{border-radius:2px;font-size:13px}
.hero{background:var(--dark);color:var(--darkink)}
.hero h1{color:#F2EADB}.hero h1 i{color:#D2A85A}
.hero p{color:#D9CFBD}.hero .eyebrow{color:#D2A85A}
.hero .ghost{color:#F2EADB;border-color:#55617A}
h1,h2{font-weight:900}
.card,.plan,.bookbox,.qa{border-radius:4px;border:2px solid var(--ink)}
.row{border-bottom:1px dashed #B9AE9A}
.media{border-radius:4px}
.media.ph{background:repeating-linear-gradient(135deg,#1D2C45 0 22px,#16233A 22px 44px)}
.media.ph:after{content:"";position:absolute;right:26px;top:26px;bottom:26px;width:22px;border-radius:12px;background:repeating-linear-gradient(160deg,var(--red) 0 12px,#F2EADB 12px 24px,#2E5AA8 24px 36px,#F2EADB 36px 48px);box-shadow:0 0 0 4px #B8893B}
.band{background:var(--red);color:#F2EADB}.band p{color:#F2EADB}.band .k{color:#E9C98B}
`
  }
};

// ---------- helpers ----------
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// *words* in a headline become italic accent words
const rich = s => esc(s).replace(/\*([^*]+)\*/g, '<i>$1</i>');
const paras = a => (Array.isArray(a) ? a : a ? [a] : []).map(p => `<p>${esc(p)}</p>`).join('');
const has = a => Array.isArray(a) ? a.length > 0 : !!a;

function media(m, alt, cls) {
  if (!m) return `<div class="media ph ${cls || ''}" role="img" aria-label="${esc(alt)}"></div>`;
  if (/\.(mp4|webm)$/i.test(m.video || '')) {
    return `<div class="media ${cls || ''}"><video src="${esc(m.video)}" ${m.poster ? `poster="${esc(m.poster)}"` : ''} autoplay muted loop playsinline preload="none" aria-label="${esc(alt)}"></video></div>`;
  }
  const src = typeof m === 'string' ? m : m.photo;
  return `<div class="media ${cls || ''}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></div>`;
}

function build(slug) {
  const dir = path.join(SITES, slug);
  const s = JSON.parse(fs.readFileSync(path.join(dir, 'site.json'), 'utf8'));
  const look = LOOKS[s.look];
  if (!look) throw new Error(`${slug}: look must be one of ${Object.keys(LOOKS).join(', ')}`);
  if (!/^[a-f0-9]{8,32}$/.test(s.bookingId || '')) throw new Error(`${slug}: bookingId missing or wrong`);

  const v = Object.assign({}, look.vars, s.colors || {});          // custom colors override the look
  const vars = Object.entries(v).map(([k, val]) => `--${k}:${val}`).join(';');
  const bookUrl = `https://ereaai.com/book?b=${s.bookingId}&n=${encodeURIComponent(s.name)}`;
  const embed = `${BOOK_ENGINE}?b=${s.bookingId}`;
  const L = Object.assign({ book: 'Book now', services: 'Services', pricing: 'Pricing', about: 'About', visit: 'Visit' }, s.labels || {});
  const home = s.domain ? `https://${s.domain}/` : `https://${slug}.ereaai.com/`;
  const c = s.contact || {};
  const mapUrl = c.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}` : '';
  const tel = c.phone ? c.phone.replace(/[^\d+]/g, '') : '';

  const nav = [
    has(s.services) && `<a href="#services">${esc(L.services)}</a>`,
    has(s.pricing) && `<a href="#pricing">${esc(L.pricing)}</a>`,
    has(s.about) && `<a href="#about">${esc(L.about)}</a>`,
    `<a href="#visit">${esc(L.visit)}</a>`
  ].filter(Boolean).join('');

  const services = has(s.services) ? `
<section id="services" class="wrap sec">
  <div class="sh"><span class="k">${esc(s.servicesEyebrow || 'What we offer')}</span><h2>${esc(L.services)}</h2></div>
  <div class="list">${s.services.map(x => `
    <div class="row"><div><b>${esc(x.name)}</b>${x.desc ? `<small>${esc(x.desc)}</small>` : ''}</div>
    <div class="meta">${x.length ? `<span>${esc(x.length)}</span>` : ''}${x.price ? `<strong>${esc(x.price)}</strong>` : ''}</div></div>`).join('')}
  </div>
  <a class="btn" href="#book">${esc(L.book)}</a>
</section>` : '';

  const pricing = has(s.pricing) ? `
<section id="pricing" class="wrap sec">
  <div class="sh"><span class="k">${esc(s.pricingEyebrow || 'Pick what fits')}</span><h2>${esc(L.pricing)}</h2></div>
  <div class="plans">${s.pricing.map(p => `
    <div class="plan${p.featured ? ' feat' : ''}"><span class="k">${esc(p.plan)}</span><div class="price">${esc(p.price)}</div>${p.details ? `<p>${esc(p.details)}</p>` : ''}</div>`).join('')}
  </div>
</section>` : '';

  const band = `
<section class="band"><div class="wrap bandin">
  <div><span class="k">${esc((s.waitlist && s.waitlist.eyebrow) || 'Fully booked?')}</span>
  <p class="big">${esc((s.waitlist && s.waitlist.text) || "Join the waitlist. When a spot opens, we'll text you first. Reply YES and it's yours.")}</p></div>
  <a class="btn" href="#book">${esc((s.waitlist && s.waitlist.button) || 'Join the waitlist')}</a>
</div></section>`;

  const about = has(s.about) ? `
<section id="about" class="wrap sec two">
  ${media(s.aboutMedia, s.aboutMediaAlt || `Inside ${s.name}`, 'tall')}
  <div class="copy"><span class="k">${esc(s.aboutEyebrow || 'Our story')}</span><h2>${esc(s.aboutTitle || L.about)}</h2>${paras(s.about)}</div>
</section>` : '';

  const team = has(s.team) ? `
<section class="wrap sec">
  <div class="sh"><span class="k">${esc(s.teamEyebrow || 'Meet the team')}</span><h2>${esc(s.teamTitle || 'The team')}</h2></div>
  <div class="team">${s.team.map(t => `<div class="card person">${media(t.photo, t.name, 'sq')}<b>${esc(t.name)}</b>${t.role ? `<small>${esc(t.role)}</small>` : ''}</div>`).join('')}</div>
</section>` : '';

  const gallery = has(s.gallery) ? `
<section class="wrap sec"><div class="gallery">${s.gallery.map((g, i) => media(g, `${s.name} photo ${i + 1}`, 'sq')).join('')}</div></section>` : '';

  const yt = s.youtube ? `
<section class="wrap sec"><div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${esc(s.youtube)}" title="${esc(s.name)} video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div></section>` : '';

  const book = `
<section id="book" class="wrap sec">
  <div class="sh"><span class="k">${esc(s.bookEyebrow || 'Takes a few seconds')}</span><h2>${esc(s.bookTitle || L.book)}</h2>
  <p class="sub">Pick a time, add your name and phone, done. You'll get a text to confirm. Full? Join the waitlist right here.</p></div>
  <div class="bookbox"><iframe src="${embed}" title="Book with ${esc(s.name)}"></iframe></div>
  <p class="small"><a href="${bookUrl}">Open booking full screen</a></p>
</section>`;

  const faq = has(s.faq) ? `
<section class="wrap sec">
  <div class="sh"><span class="k">Good to know</span><h2>Questions</h2></div>
  <div class="faq">${s.faq.map(q => `<details class="qa"><summary>${esc(q.q)}</summary><p>${esc(q.a)}</p></details>`).join('')}</div>
</section>` : '';

  const hours = has(s.hours) ? `<div><span class="k">Hours</span>${s.hours.map(h => `<p>${esc(h)}</p>`).join('')}</div>` : '';
  const visit = `
<section id="visit" class="wrap sec">
  <div class="sh"><span class="k">${esc(s.visitEyebrow || 'Come see us')}</span><h2>${esc(L.visit)}</h2></div>
  <div class="visit">
    ${c.address ? `<div><span class="k">Where</span><p>${esc(c.address)}</p><p><a href="${mapUrl}" target="_blank" rel="noopener">Open in Maps</a></p></div>` : ''}
    ${hours}
    <div><span class="k">Contact</span>
      ${c.phone ? `<p><a href="tel:${esc(tel)}">${esc(c.phone)}</a></p>` : ''}
      ${c.email ? `<p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>` : ''}
      ${c.instagram ? `<p><a href="https://instagram.com/${esc(c.instagram.replace(/^@/, ''))}" target="_blank" rel="noopener">@${esc(c.instagram.replace(/^@/, ''))}</a></p>` : ''}
    </div>
  </div>
</section>`;

  const logo = s.logo ? `<img src="${esc(s.logo)}" alt="" class="logo">` : '';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(s.name)}${s.seoTagline ? ' · ' + esc(s.seoTagline) : ''}</title>
<meta name="description" content="${esc(s.description || s.intro || '')}">
<link rel="canonical" href="${home}">
<meta property="og:title" content="${esc(s.name)}">
<meta property="og:description" content="${esc(s.description || s.intro || '')}">
${s.ogImage ? `<meta property="og:image" content="${esc(new URL(s.ogImage, home).href)}">` : ''}
${s.favicon ? `<link rel="icon" href="${esc(s.favicon)}">` : ''}
<meta name="theme-color" content="${v.dark || v.ink}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${look.fonts}&display=swap">
<style>
:root{${vars};--head:${look.head};--body:${look.body}}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 var(--body);-webkit-font-smoothing:antialiased}
a{color:inherit}img,video{display:block;width:100%;height:100%;object-fit:cover}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.top{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.topin{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:70px}
.brand{font-family:var(--head);text-decoration:none;display:flex;align-items:center;gap:10px;line-height:1.1}
.logo{width:38px;height:38px;object-fit:contain}
.nav{display:flex;align-items:center;gap:26px;font-size:13px}.nav a{text-decoration:none}
.btn{display:inline-block;background:var(--btn);color:var(--btnink);padding:14px 24px;text-decoration:none;border:1px solid transparent;white-space:nowrap;font-weight:500}
.btn:hover{filter:brightness(1.08)}
.ghost{background:transparent;color:var(--ink);border-color:var(--line)}
.nav .btn{padding:11px 18px}
.hero .wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;padding-top:56px;padding-bottom:64px}
.eyebrow,.k{display:block;font-size:12px;color:var(--accent)}
h1{font-family:var(--head);font-size:clamp(42px,6vw,76px);line-height:1;margin:14px 0 20px}
h2{font-family:var(--head);font-size:clamp(30px,4vw,46px);line-height:1.05;margin:8px 0 0}
.hero p{font-size:18px;color:var(--muted);max-width:520px;margin:0 0 28px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.media{position:relative;overflow:hidden;background:var(--soft);aspect-ratio:4/5}
.media.sq{aspect-ratio:1/1}.media.tall{aspect-ratio:4/5}.hero .media{aspect-ratio:4/5;max-height:620px}
.sec{padding-top:88px;padding-bottom:8px}
.sh{margin-bottom:30px}.sub{color:var(--muted);max-width:560px;margin:12px 0 0}
.list{border-top:1px solid var(--line);margin-bottom:30px}
.row{display:flex;justify-content:space-between;gap:20px;padding:20px 2px;border-bottom:1px solid var(--line);align-items:center}
.row b{font-weight:600;font-size:18px}.row small{display:block;color:var(--muted);font-size:15px;margin-top:2px}
.meta{display:flex;gap:18px;align-items:center;white-space:nowrap;color:var(--muted);font-size:15px}.meta strong{color:var(--ink);font-size:18px}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
.plan{background:var(--paper);border:1px solid var(--line);padding:28px}
.plan.feat{background:var(--dark);color:var(--darkink);border-color:var(--dark)}.plan.feat p{color:inherit;opacity:.8}.plan.feat .k{color:inherit;opacity:.75}
.price{font-family:var(--head);font-size:44px;line-height:1.1;margin:10px 0 6px}
.plan p{margin:0;color:var(--muted);font-size:15px}
.band{margin-top:96px}.bandin{display:flex;align-items:center;justify-content:space-between;gap:28px;padding-top:44px;padding-bottom:44px}
.band .big{font-family:var(--head);font-size:clamp(24px,3vw,34px);line-height:1.2;margin:8px 0 0;max-width:720px}
.two{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:center}
.copy p{color:var(--muted)}
.team{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:18px}
.person{background:var(--paper);border:1px solid var(--line);padding:12px 12px 18px}.person .media{margin-bottom:14px}
.person b{display:block;font-size:18px}.person small{color:var(--muted)}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.yt{position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:12px}.yt iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.bookbox{background:var(--paper);border:1px solid var(--line);overflow:hidden}
.bookbox iframe{display:block;width:100%;height:820px;border:0;background:#fff}
.small{font-size:14px;color:var(--muted)}
.faq{display:grid;gap:12px;max-width:820px}
.qa{background:var(--paper);border:1px solid var(--line);padding:18px 22px}
.qa summary{cursor:pointer;font-weight:600}.qa p{margin:10px 0 0;color:var(--muted)}
.visit{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:28px}
.visit p{margin:6px 0 0}
footer{margin-top:96px;background:var(--dark);color:var(--darkink)}
.footin{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:28px;padding-bottom:28px;font-size:14px;opacity:.9}
.footin a{opacity:.75}
${look.css}
@media(max-width:860px){
  .nav a:not(.btn){display:none}
  .hero .wrap,.two{grid-template-columns:1fr;gap:30px}
  .hero .wrap{padding-top:34px;padding-bottom:44px}
  .hero .media{aspect-ratio:4/3}
  .bandin{flex-direction:column;align-items:flex-start}
  .row{flex-direction:column;align-items:flex-start;gap:6px}
  .sec{padding-top:64px}
  .bookbox iframe{height:760px}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<header class="top"><div class="wrap topin">
  <a class="brand" href="#">${logo}${esc(s.name)}</a>
  <nav class="nav">${nav}<a class="btn" href="#book">${esc(L.book)}</a></nav>
</div></header>
<section class="hero"><div class="wrap">
  <div>
    ${s.eyebrow ? `<span class="eyebrow">${esc(s.eyebrow)}</span>` : ''}
    <h1>${rich(s.headline || s.name)}</h1>
    ${s.intro ? `<p>${esc(s.intro)}</p>` : ''}
    <div class="ctas"><a class="btn" href="#book">${esc(L.book)}</a>${has(s.services) ? `<a class="btn ghost" href="#services">See ${esc(L.services.toLowerCase())}</a>` : ''}</div>
  </div>
  ${media(s.heroMedia, s.heroMediaAlt || s.name)}
</div></section>
${services}${pricing}${band}${about}${team}${gallery}${yt}${book}${faq}${visit}
<footer><div class="wrap footin"><span>© ${new Date().getFullYear()} ${esc(s.name)}</span><a href="https://ereaai.com" target="_blank" rel="noopener">Booking by Erea</a></div></footer>
</body>
</html>
`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`built ${slug} (${s.look}) → sites/${slug}/index.html`);
}

const arg = process.argv[2];
if (!arg) { console.log('usage: node sites/_build/build.js <slug> | --all'); process.exit(1); }
const slugs = arg === '--all'
  ? fs.readdirSync(SITES).filter(d => !d.startsWith('_') && fs.existsSync(path.join(SITES, d, 'site.json')))
  : [arg];
slugs.forEach(build);
