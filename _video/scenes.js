/* Scenes for the "Keep what you earn" videos. Each scene sets R(t) (t = seconds into the scene). */

/* ---------------- shared bits ---------------- */
function pie(x, y, size) {
  const whole = el('<div class="pie"></div>', { left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px', background: '#22263B', borderRadius: '50%' });
  const label = el('<div class="h" style="color:#fff;text-align:center"></div>', { left: x + 'px', top: (y + size / 2 - 40) + 'px', width: size + 'px', fontSize: (size * 0.2) + 'px' });
  label.firstChild.innerHTML = '$';
  const wedge = el('<div class="pie"></div>', { left: x + 'px', top: y + 'px', width: size + 'px', height: size + 'px', background: 'conic-gradient(#C8402A 0 108deg, transparent 108deg 360deg)', borderRadius: '50%' });
  const wlab = el('<div class="h" style="color:#fff;font-size:' + (size * 0.11) + 'px">30%</div>', { left: (x + size * 0.62) + 'px', top: (y + size * 0.2) + 'px' });
  return { whole, wedge, wlab, label, size,
    out(k) { const d = k * size * 0.12, a = 54 * Math.PI / 180; const tr = 'translate(' + (Math.sin(a) * d) + 'px,' + (-Math.cos(a) * d) + 'px)'; wedge.style.transform = tr; wlab.style.transform = tr; },
    fill(k) { whole.style.background = k > 0 ? 'conic-gradient(#137A6F 0 ' + (k * 360) + 'deg, #22263B ' + (k * 360) + 'deg 360deg)' : '#22263B'; }
  };
}
function words(d, t, s, per) { [...d.querySelectorAll('i')].forEach((w, i) => { const k = ap(t, s + i * per, .35); w.style.opacity = k; w.style.display = 'inline-block'; w.style.transform = 'translateY(' + ((1 - k) * 18) + 'px)'; }); }
function wrapWords(txt) { return txt.split(/(<br>| )/).map(p => p === '<br>' ? '<br>' : p === ' ' ? ' ' : '<i style="font-style:normal">' + p + '</i>').join(''); }

/* ---------------- MAIN PROMO ---------------- */
SC.A = function () {
  wordmark(V ? 60 : 64, V ? 70 : 40);
  const head = el('<div class="h">' + wrapWords('Every app wants a piece of your sales.') + '</div>', V ? { left: '60px', top: '190px', width: '600px', fontSize: '72px' } : { left: '64px', top: '150px', width: '700px', fontSize: '76px' });
  const P = V ? pie(195, 560, 330) : pie(860, 150, 330);
  const card = el('<div class="card" style="padding:22px 26px;font-size:' + (V ? 30 : 28) + 'px;font-weight:600;line-height:1.3">Some booking apps take <b style="color:#C8402A">30%</b> of a new client\'s first visit.</div>', V ? { left: '60px', top: '980px', width: '600px' } : { left: '64px', top: '440px', width: '640px' });
  const src = el('<div class="src">When their marketplace sends you the client. As listed on the apps\' own sites, Nov 2026.</div>', V ? { left: '60px', top: '1190px', width: '600px' } : { left: '64px', top: '660px', width: '900px' });
  R = t => {
    words(head, t, .25, .16);
    const k = ap(t, 0, .6); [P.whole, P.wedge, P.label].forEach(e => { e.style.opacity = k; });
    P.out(ease((t - 2.4) / .8)); P.wlab.style.opacity = ap(t, 2.8, .4);
    show(card, ap(t, 2.9, .6)); src.style.opacity = ap(t, 3.6, .6);
  };
};
SC.B = function () {
  wordmark(V ? 60 : 64, V ? 70 : 40);
  const h1 = el('<div class="h" style="color:#C8402A">Erea doesn\'t.</div>', V ? { left: '60px', top: '190px', fontSize: '96px' } : { left: '64px', top: '160px', fontSize: '96px' });
  const l1 = el('<div class="h">One flat price.</div>', V ? { left: '60px', top: '330px', fontSize: '60px' } : { left: '64px', top: '300px', fontSize: '58px' });
  const l2 = el('<div class="h">Your money stays yours.</div>', V ? { left: '60px', top: '410px', fontSize: '60px' } : { left: '64px', top: '375px', fontSize: '58px' });
  const P = V ? pie(195, 620, 330) : pie(860, 150, 330);
  const yours = el('<div class="h" style="text-align:center;font-size:30px;color:#137A6F">100% yours</div>', V ? { left: '195px', top: '980px', width: '330px' } : { left: '860px', top: '505px', width: '330px' });
  R = t => {
    show(h1, ap(t, .1, .5)); show(l1, ap(t, 1.3, .5)); show(l2, ap(t, 2.3, .5));
    P.out(1 - easeIO((t - .5) / .9)); P.wlab.style.opacity = 1 - ap(t, .5, .5);
    const f = easeIO((t - 1.5) / 1.4); P.wedge.style.opacity = 1 - ap(t, 1.4, .3); P.fill(f);
    show(yours, ap(t, 2.9, .5), 12);
  };
};
SC.C = function () {
  wordmark(V ? 60 : 64, V ? 60 : 40);
  const txt = el('<span class="sample">Sample business</span><div class="h" style="font-size:' + (V ? 54 : 46) + 'px;margin-top:14px">Crown Line Barber Co.</div><p style="font-size:' + (V ? 26 : 22) + 'px;line-height:1.35;margin-top:12px;color:#3A3A55">Their own website.<br>Their name on it.</p><div class="chip" style="margin-top:18px">Crown look · made for barbers</div>',
    V ? { left: '60px', top: '150px', width: '600px' } : { left: '64px', top: '170px', width: '330px' });
  let lv;
  if (V) {
    const ph = el('<div class="phone"><div class="view" style="width:400px;height:720px"></div></div>', { left: '148px', top: '470px' });
    ph.remove();
    const fr = el('', { left: '148px', top: '470px', width: '424px', height: '744px', background: '#14162B', borderRadius: '44px', boxShadow: '0 30px 70px rgba(34,38,59,.25)' });
    lv = liveView('/sites/crownline/', 430, 6000, { x: 160, y: 482, w: 400, h: 720 });
    lv.wrap.style.borderRadius = '34px'; lv.wrap.style.overflow = 'hidden';
  } else {
    const win = el('<div class="win"><div class="bar"><i></i><i></i><i></i><b>crownline.ereaai.com</b></div></div>', { left: '440px', top: '60px', width: '780px', height: '600px' });
    lv = liveView('/sites/crownline/', 1280, 7000, { x: 441, y: 95, w: 778, h: 564 });
    lv.wrap.style.borderRadius = '0 0 16px 16px';
  }
  let stops = null;
  R = t => {
    show(txt, ap(t, .1, .6));
    const d = lv.f.contentDocument;
    if (!stops && d && d.querySelector('#services')) {
      // show the real live booking page (from the browser) where the Google booking box would load
      const box = d.querySelector('.bookbox'); if (box) box.innerHTML = '<img src="/_video/live-booking.jpg" style="width:100%;display:block">';
      const y = s => d.querySelector(s).getBoundingClientRect().top + (lv.cam ? lv.cam.y : 0);
      stops = [0, y('#services') - 20, y('#book') - 10];
    }
    if (!stops) return;
    const s = lv.box.w / (V ? 430 : 1280);
    let yy = stops[0];
    if (t > 1.2) yy = lerp(stops[0], stops[1], easeIO((t - 1.2) / 1.6));
    if (t > 3.4) yy = lerp(stops[1], stops[2], easeIO((t - 3.4) / 1.8));
    setCam(lv, 0, yy, s);
  };
};
SC.D = function () {   // the live practice demo: booking, then a cancelled spot refilled, then the Front Desk
  wordmark(V ? 60 : 64, V ? 60 : 40);
  const beats = [
    ['1 · Booking', 'Clients pick a barber and a time.', 'The confirmation text goes out on its own.'],
    ['2 · Someone cancels', 'The first YES takes the chair.', 'Erea texts the waitlist. Nobody makes a call.'],
    ['3 · Front Desk', 'Your whole shop on one screen.', 'Every booking, every text, as it happens.']
  ];
  const caps = beats.map(b => el('<span class="tag">' + b[0] + '</span><div class="h" style="font-size:' + (V ? 50 : 40) + 'px;margin-top:10px">' + b[1] + '</div><p style="font-size:' + (V ? 24 : 20) + 'px;line-height:1.35;margin-top:12px;color:#3A3A55">' + b[2] + '</p>',
    V ? { left: '60px', top: '140px', width: '600px' } : { left: '64px', top: '190px', width: '330px' }));
  const smp = el('<span class="sample">Practice demo · sample shop</span>', V ? { left: '60px', top: '1220px' } : { left: '64px', top: '640px' });
  const box = V ? { x: 30, y: 400, w: 660, h: 800 } : { x: 420, y: 36, w: 820, h: 650 };
  const card = el('', { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px', background: '#FFF8EF', borderRadius: '24px' });
  const lv = liveView('/demo-barber.html', 1280, 2600, box); lv.wrap.style.borderRadius = '24px';
  window.LV = lv;
  let inited = false;
  R = t => {
    const d = lv.f.contentDocument;
    if (!inited && d && d.querySelector('#client .bcard')) { inited = true; const fx = d.createElement('style'); fx.textContent = '.tb:not(:last-child),.act:not(:first-child){animation:none!important}'; d.head.appendChild(fx); }
    if (!inited) return;
    const cl = rectIn(lv, '#client'), ow = rectIn(lv, '#owner');
    const phone = { x: cl.x, y: cl.y, w: cl.w, h: Math.min(cl.h, 820) };
    const both = { x: cl.x, y: cl.y, w: ow.x + ow.w - cl.x, h: 820 };
    const desk = { x: ow.x, y: ow.y, w: ow.w, h: 560 };
    const c1 = fitCam(lv, V ? { x: cl.x, y: cl.y, w: cl.w, h: Math.min(cl.h, 980) } : phone, 10),
      c2 = V ? c1 : fitCam(lv, both, 10), c3 = fitCam(lv, V ? { x: ow.x, y: ow.y, w: ow.w, h: 780 } : desk, 10);
    let c = c1;
    if (t > 6.0) c = mixCam(c1, c2, easeIO((t - 6.0) / 1.0));
    if (t > 14.0) c = mixCam(c2, c3, easeIO((t - 14.0) / 1.0));
    setCam(lv, c.x, c.y, c.s);
    caps.forEach((e, i) => { const s = [0, 6.2, 14.2][i], en = [6.2, 14.2, 99][i]; show(e, Math.min(ap(t, s + .1, .5), 1 - ap(t, en - .25, .25))); });
  };
};
SC.G = function () {
  wordmark(V ? 60 : 64, V ? 60 : 40);
  const ph = V ? el('<div class="phone"><div class="view" style="width:300px;height:628px"><img class="shot" src="/_video/live-booking.jpg" style="width:300px"></div></div>', { left: '198px', top: '130px' })
    : el('<div class="phone" style="padding:10px;border-radius:38px"><div class="view" style="width:262px;height:548px;border-radius:30px"><img class="shot" src="/_video/live-booking.jpg" style="width:262px"></div></div>', { left: '140px', top: '100px' });
  const cap = el('<span class="sample">Crown Line\'s real booking page · sample shop</span>', V ? { left: '160px', top: '810px' } : { left: '96px', top: '680px' });
  const head = el('<span class="tag">Keep what you earn</span><div class="h" style="font-size:' + (V ? 60 : 54) + 'px;margin-top:8px">It\'s yours. Not ours.</div>', V ? { left: '60px', top: '850px' } : { left: '540px', top: '70px' });
  const items = ['A booking page that shows only you', 'Your name and your logo', 'Payments into your own Stripe or Square<small style="display:block;font-weight:500;font-size:15px;color:#6B6070;margin-top:2px">With the online payments add-on</small>', 'Your web address stays yours', 'No contract'];
  const times = [.2, 2.4, 4.0, 7.6, 9.4];
  const lis = items.map((s, i) => el('<div class="li" style="font-size:' + (V ? 27 : 26) + 'px"><span class="ck">✓</span><span>' + s + '</span></div>', V ? { left: '60px', top: (1000 + i * 52) + 'px', width: '620px' } : { left: '540px', top: (196 + i * 92) + 'px', width: '700px' }));
  if (V) lis.forEach((e, i) => { e.style.top = (970 + i * 60 + (i > 2 ? 22 : 0)) + 'px'; e.style.fontSize = '25px'; });
  R = t => {
    show(ph, ap(t, 0, .6)); cap.style.opacity = ap(t, .6, .5); show(head, ap(t, .1, .5));
    lis.forEach((e, i) => show(e, ap(t, times[i], .45), 16));
    
  };
};
SC.H = function () {
  wordmark(V ? 60 : 64, V ? 60 : 40);
  const head = el('<div class="h" style="font-size:' + (V ? 56 : 50) + 'px">One flat price. That\'s it.</div>', V ? { left: '60px', top: '160px', width: '600px' } : { left: '64px', top: '96px' });
  const cw = V ? 600 : 520, ch = V ? 360 : 330;
  const c1 = el('<div class="card" style="padding:30px;height:' + ch + 'px"><span class="tag">For a real website, solo or a team</span><div class="h" style="font-size:40px;margin-top:10px">Erea</div><div class="h" style="font-size:78px;margin-top:6px">$79<span style="font-size:28px">/mo</span></div><div style="font-weight:700;font-size:21px;margin-top:8px">First 15 businesses, locked in for life</div><div style="color:#6B6070;font-size:18px;margin-top:4px">Then $99/mo</div></div>',
    V ? { left: '60px', top: '330px', width: cw + 'px' } : { left: '64px', top: '200px', width: cw + 'px' });
  const c2 = el('<div class="card" style="padding:30px;height:' + ch + 'px"><span class="tag" style="color:#137A6F">For solo operators on the go</span><div class="h" style="font-size:40px;margin-top:10px">Erea Solo</div><div class="h" style="font-size:78px;margin-top:6px">$39<span style="font-size:28px">/mo</span></div><div style="font-weight:700;font-size:21px;margin-top:8px">Your booking link, texts and waitlist</div></div>',
    V ? { left: '60px', top: '720px', width: cw + 'px' } : { left: '620px', top: '200px', width: cw + 'px' });
  const foot = el('<div style="font-weight:700;font-size:' + (V ? 26 : 24) + 'px">No cut of your sales · No fees on your clients · No contract</div>', V ? { left: '60px', top: '1120px', width: '600px', textAlign: 'center' } : { left: '64px', top: '585px', width: '1076px', textAlign: 'center' });
  R = t => { show(head, ap(t, .05, .5)); show(c1, ap(t, .4, .6), 30); show(c2, ap(t, 4.6, .6), 30); show(foot, ap(t, 5.8, .5)); };
};
SC.I = function () {
  const big = el('<div class="h" style="font-size:' + (V ? 104 : 112) + 'px;text-align:center">Keep what<br>you earn.</div>', { left: '0', top: (V ? 430 : 150) + 'px', width: W + 'px' });
  const wm = el('<div class="wm" style="font-size:40px;justify-content:center"><img src="/icon-192.png" alt="" style="width:46px;height:46px;border-radius:12px"><b>erea<span>.</span>ai</b></div>', { left: '0', top: (V ? 760 : 430) + 'px', width: W + 'px' });
  const url = el('<div style="text-align:center;font-weight:700;font-size:28px">ereaai.com <span style="color:#6B6070;font-weight:500">· We set it all up for you.</span></div>', { left: '0', top: (V ? 840 : 505) + 'px', width: W + 'px' });
  R = t => { show(big, ap(t, .1, .7), 30); show(wm, ap(t, .8, .5)); show(url, ap(t, 1.1, .5)); };
};

/* ---------------- ERA SOLO PROMO ---------------- */
function soloMark(x, y) { const w = wordmark(x, y); w.firstChild.insertAdjacentHTML('beforeend', '<span style="color:#137A6F;margin-left:6px">Solo</span>'); return w; }
SC.S1 = function () {
  soloMark(V ? 60 : 64, V ? 70 : 40);
  const a = el('<div class="h">' + wrapWords('Working for yourself?') + '</div>', V ? { left: '60px', top: '430px', width: '600px', fontSize: '84px' } : { left: '64px', top: '190px', width: '1100px', fontSize: '92px' });
  const b = el('<div class="h" style="color:#137A6F">Keep all of it.</div>', V ? { left: '60px', top: '720px', fontSize: '84px' } : { left: '64px', top: '330px', fontSize: '92px' });
  R = t => { words(a, t, .2, .14); show(b, ap(t, 1.5, .5)); };
};
SC.SD = function () {
  soloMark(V ? 60 : 64, V ? 60 : 40);
  const beats = [
    ['Your booking link', 'Your link, in your own style.', 'Clients book in seconds. Erea texts them for you.'],
    ['Someone cancels', 'The spot fills itself.', 'Your waitlist gets the text. The first YES gets it.'],
    ['Your phone', 'Everything in one place.', 'Bookings, clients and who\'s paid.']
  ];
  const caps = beats.map(b => el('<span class="tag" style="color:#137A6F">' + b[0] + '</span><div class="h" style="font-size:' + (V ? 50 : 40) + 'px;margin-top:10px">' + b[1] + '</div><p style="font-size:' + (V ? 24 : 20) + 'px;line-height:1.35;margin-top:12px;color:#3A3A55">' + b[2] + '</p>',
    V ? { left: '60px', top: '140px', width: '600px' } : { left: '64px', top: '190px', width: '330px' }));
  el('<span class="sample">Practice demo · sample business · Soft Clay style</span>', V ? { left: '60px', top: '1220px' } : { left: '64px', top: '640px' });
  const box = V ? { x: 30, y: 400, w: 660, h: 800 } : { x: 420, y: 36, w: 820, h: 650 };
  el('', { left: box.x + 'px', top: box.y + 'px', width: box.w + 'px', height: box.h + 'px', background: '#FFF8EF', borderRadius: '24px' });
  const lv = liveView('/solo/demo.html?style=clay', 1280, 2600, box); lv.wrap.style.borderRadius = '24px';
  window.LV = lv;
  let inited = false;
  R = t => {
    const d = lv.f.contentDocument;
    if (!inited && d && d.querySelector('#client .cls') && d.getElementById('bizname')) {
      inited = true; const fx = d.createElement('style'); fx.textContent = '.tb:not(:last-child),.act:not(:first-child){animation:none!important}'; d.head.appendChild(fx); const n = d.getElementById('bizname'); n.value = 'Pilates with Nia'; n.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (!inited) return;
    const cl = rectIn(lv, '#client'), ow = rectIn(lv, '#owner');
    const c1 = fitCam(lv, V ? { x: cl.x, y: cl.y, w: cl.w, h: Math.min(cl.h, 980) } : { x: cl.x, y: cl.y, w: cl.w, h: Math.min(cl.h, 820) }, 10),
      c2 = V ? c1 : fitCam(lv, { x: cl.x, y: cl.y, w: ow.x + ow.w - cl.x, h: 820 }, 10),
      c3 = fitCam(lv, V ? { x: ow.x, y: ow.y, w: ow.w, h: 780 } : { x: ow.x, y: ow.y, w: ow.w, h: 560 }, 10);
    let c = c1;
    if (t > 7.0) c = mixCam(c1, c2, easeIO((t - 7.0) / 1.0));
    if (t > 11.9) c = mixCam(c2, c3, easeIO((t - 11.9) / 1.0));
    setCam(lv, c.x, c.y, c.s);
    caps.forEach((e, i) => { const s = [0, 7.2, 12.0][i], en = [7.2, 12.0, 99][i]; show(e, Math.min(ap(t, s + .1, .5), 1 - ap(t, en - .25, .25))); });
  };
};
SC.S3 = function () {
  soloMark(V ? 60 : 64, V ? 70 : 40);
  const ls = ['No cut of your sales.', 'No fees on your clients.', 'No contract.'].map((s, i) => el('<div class="li h" style="font-size:' + (V ? 50 : 54) + 'px"><span class="ck" style="width:48px;height:48px;font-size:26px">✓</span>' + s + '</div>', V ? { left: '60px', top: (300 + i * 110) + 'px' } : { left: '64px', top: (120 + i * 92) + 'px' }));
  const pr = el('<div class="card" style="padding:28px 34px;display:inline-block"><span class="tag" style="color:#137A6F">Erea Solo</span><div class="h" style="font-size:96px;margin-top:6px">$39<span style="font-size:34px">/mo</span></div><div style="font-weight:700;font-size:22px;margin-top:6px">Your link, texts, waitlist, clients and payments</div></div>', V ? { left: '60px', top: '700px', width: '600px' } : { left: '64px', top: '410px', width: '720px' });
  R = t => { ls.forEach((e, i) => show(e, ap(t, [.2, 1.5, 2.9][i], .45))); show(pr, ap(t, 3.9, .6), 30); };
};
SC.S4 = function () {
  const big = el('<div class="h" style="font-size:' + (V ? 104 : 112) + 'px;text-align:center">Keep what<br>you earn.</div>', { left: '0', top: (V ? 430 : 150) + 'px', width: W + 'px' });
  const wm = el('<div class="wm" style="font-size:40px;justify-content:center"><img src="/icon-192.png" alt="" style="width:46px;height:46px;border-radius:12px"><b>erea<span>.</span>ai</b><b style="color:#137A6F;margin-left:6px">Solo</b></div>', { left: '0', top: (V ? 760 : 430) + 'px', width: W + 'px' });
  const url = el('<div style="text-align:center;font-weight:700;font-size:30px">ereaai.com/solo</div>', { left: '0', top: (V ? 840 : 505) + 'px', width: W + 'px' });
  R = t => { show(big, ap(t, .1, .7), 30); show(wm, ap(t, .8, .5)); show(url, ap(t, 1.1, .5)); };
};
