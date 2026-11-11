// Erea "traffic director" — a free Cloudflare Worker named erea-sites.
// It sends willow.ereaai.com (or a customer's own domain) to the right
// customer site, which lives in this repo at ereaai.com/sites/<slug>/.
// Paste this whole file into the Worker's code editor in Cloudflare and Deploy.
// Routes on the Worker: *.ereaai.com/*  (+ one route per customer-owned domain).

// Customer-owned domains → their site folder. Add one line per Own Domain customer.
const DOMAINS = {
  // 'willowstudio.com': 'willow',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    let slug = DOMAINS[host];
    if (!slug && host.endsWith('.ereaai.com')) slug = host.slice(0, -'.ereaai.com'.length);

    // Unknown address, or something odd → send to the Erea homepage.
    if (!slug || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(slug)) {
      return Response.redirect('https://ereaai.com/', 302);
    }
    if (url.pathname.includes('..')) return new Response('Not found', { status: 404 });

    const res = await fetch(`https://ereaai.com/sites/${slug}${url.pathname}${url.search}`, {
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    // No site with that name → Erea homepage (only for the page itself, not for a missing photo).
    if (res.status === 404 && (url.pathname === '/' || url.pathname === '')) {
      return Response.redirect('https://ereaai.com/', 302);
    }
    return res;
  },
};
