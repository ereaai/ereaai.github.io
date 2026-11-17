// /start — "Make it yours": pick a plan, a look, your colors, see a live preview, then save the setup
// to the Erea Interest List (sheet + email to Erea) and go on to Stripe checkout (Erea) or the Solo list.
(function () {
  'use strict';
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyrFCLg4X4Qu3QwydWGEG55byu4lUwXY1WxJWRWvFiN0NNra0aqV_6ovV4CvYyQb1CVGg/exec';
  var STUDIO_STRIPE = 'https://buy.stripe.com/aFadR9fiS6UD4weeji3VC03'; // Erea $79 founding link
  var SOLO_STRIPE = ''; // Erea Solo: leave empty until Solo texting is approved (then 'https://buy.stripe.com/dRmdR91s2en5faS3EE3VC02')

  // ---------- the looks (base looks never change; only each business's own colors do) ----------
  var LOOKS = {
    studio: [
      { id: 'linen', name: 'Linen', forWho: 'Pilates, yoga, barre, beauty', head: "'Cormorant Garamond',serif", body: "'Jost',sans-serif",
        roles: [['bg', 'Background', '#FBF8F3'], ['main', 'Text & buttons', '#2A2420'], ['accent', 'Accent', '#9A6A4F'], ['soft', 'Soft color', '#E4D6C5']],
        presets: [['Sage', '#F4F5EF', '#2F3A2F', '#6E8B6A', '#DCE3D3'], ['Rose', '#FBF5F4', '#3A2329', '#B5707D', '#EBD3D3'], ['Ocean', '#F4F7F8', '#1E2D36', '#4F7C8C', '#D3E1E6']] },
      { id: 'daylight', name: 'Daylight', forWho: 'Yoga, cycle, salons, lessons', head: "'Instrument Serif',serif", body: "'Inter Tight',sans-serif",
        roles: [['bg', 'Background', '#F1F4EE'], ['main', 'Text & buttons', '#13221B'], ['accent', 'Highlight', '#DDF19A'], ['soft', 'Photo color', '#C9D8CC']],
        presets: [['Sky', '#EEF4FB', '#12263F', '#BFE0FF', '#C9D9EC'], ['Peach', '#FFF4EE', '#3A1F14', '#FFD3B8', '#F2D2C0'], ['Lilac', '#F4F1FA', '#241A3A', '#E1D5FF', '#D8CDEB']] },
      { id: 'evening', name: 'Evening', forWho: 'Boutique strength, lash & brow', head: "'Bodoni Moda',serif", body: "'Manrope',sans-serif",
        roles: [['bg', 'Background', '#171614'], ['main', 'Text', '#F1EBE1'], ['accent', 'Accent & buttons', '#D4B98C'], ['soft', 'Second color', '#33302B']],
        presets: [['Emerald', '#0F1A16', '#EAF1EC', '#C9A75C', '#22332B'], ['Wine', '#1A1013', '#F3E7EA', '#D9A0A9', '#33222A'], ['Midnight', '#0E1422', '#EEF1F7', '#C0C8D8', '#232B3D']] },
      { id: 'forge', name: 'Forge', forWho: 'Gyms, strength, boxing', head: "'Anton',sans-serif", body: "'Barlow',sans-serif",
        roles: [['bg', 'Background', '#0E0E0E'], ['main', 'Text', '#F4F4F2'], ['accent', 'Accent & buttons', '#FF5A1F'], ['soft', 'Panels', '#2A2A2A']],
        presets: [['Red & gray', '#1C1C1E', '#F2F2F2', '#E02424', '#3A3A3D'], ['Lime', '#0B0B0B', '#F4F4F2', '#C6F432', '#262626'], ['Blue steel', '#0D1117', '#F0F3F6', '#2F81F7', '#262C36']] },
      { id: 'crown', name: 'Crown', forWho: 'Barbers, grooming', head: "'Playfair Display',serif", body: "'Work Sans',sans-serif",
        roles: [['dark', 'Main dark', '#0F1B2D'], ['light', 'Light', '#F2EADB'], ['accent', 'Accent & buttons', '#B8893B'], ['stripe', 'Stripe color', '#7A2E2A']],
        presets: [['Forest', '#14261E', '#F1EDE2', '#B8893B', '#8C2F2A'], ['Black & gold', '#111111', '#F3EEE3', '#C9A227', '#7A2E2A'], ['Royal', '#1B1F4B', '#F2EEE6', '#C0C4CF', '#A3262A']] }
    ],
    solo: [
      { id: 'clay', name: 'Soft Clay', forWho: 'Calm and warm', f: "'Cormorant Garamond',serif", ns: '30px', tr: '3px', tc: 'uppercase', r: '999px', lr: '50%',
        roles: [['bg', 'Background', '#F4EDE4'], ['ink', 'Text', '#3A2E27'], ['bb', 'Buttons', '#3A2E27'], ['pb', 'Highlight', '#EBDDCF']],
        presets: [['Sand & olive', '#F3F0E6', '#2E3324', '#55613B', '#E1E3CC'], ['Rose clay', '#F7ECEA', '#3B2523', '#8E4B43', '#EED6D1'], ['Mocha', '#EFE7E1', '#2B211C', '#6B4A3A', '#E0D2C7']] },
      { id: 'mint', name: 'Fresh Mint', forWho: 'Fresh and energetic', f: "'Archivo',sans-serif", ns: '28px', tr: '0px', tc: 'none', r: '14px', lr: '16px',
        roles: [['bg', 'Background', '#EEF7F2'], ['ink', 'Text', '#0F2A1F'], ['bb', 'Buttons', '#1F7A55'], ['pb', 'Highlight', '#D3EFE0']],
        presets: [['Teal', '#EAF6F6', '#0E2A2A', '#13807A', '#CFEDEC'], ['Lemon', '#FBF8E6', '#2A2A12', '#6A7A12', '#EEF0BF'], ['Grape', '#F3F0FA', '#21183A', '#5B3FA8', '#E2DAF5']] },
      { id: 'noir', name: 'Studio Noir', forWho: 'Bold and sharp', f: "'Oswald',sans-serif", ns: '32px', tr: '2px', tc: 'uppercase', r: '6px', lr: '6px',
        roles: [['bg', 'Background', '#121212'], ['ink', 'Text', '#F5F5F5'], ['bb', 'Buttons', '#F5F5F5'], ['pb', 'Highlight', '#2E2E2E']],
        presets: [['Gold', '#121212', '#F5F5F5', '#D4B05A', '#2E2E2E'], ['Red', '#121212', '#F5F5F5', '#E53935', '#2E2E2E'], ['Ice', '#0F141A', '#EEF3F8', '#9CC8F0', '#232C36']] },
      { id: 'blush', name: 'Blush', forWho: 'Soft and pretty', f: "'DM Serif Display',serif", ns: '28px', tr: '0px', tc: 'none', r: '18px', lr: '50%',
        roles: [['bg', 'Background', '#FBEFEF'], ['ink', 'Text', '#3D1F2A'], ['bb', 'Buttons', '#3D1F2A'], ['pb', 'Highlight', '#F6D9DE']],
        presets: [['Peach', '#FFF1EA', '#3D2218', '#C2603F', '#FADACB'], ['Lavender', '#F6F1FB', '#2E1F3D', '#7A4FA8', '#E6D9F3'], ['Berry', '#FBEFF3', '#3D1225', '#A3245A', '#F4D3E0']] },
      { id: 'sky', name: 'Sky', forWho: 'Clean and friendly', f: "'Nunito',sans-serif", ns: '28px', tr: '0px', tc: 'none', r: '16px', lr: '18px',
        roles: [['bg', 'Background', '#EEF4FB'], ['ink', 'Text', '#12263F'], ['bb', 'Buttons', '#2457A6'], ['pb', 'Highlight', '#DCE8F7']],
        presets: [['Navy', '#EEF2F8', '#0F1D33', '#1C3D73', '#D9E2F0'], ['Coral', '#FFF3EF', '#3A1A12', '#E05A3A', '#FBDCD2'], ['Green', '#EEF7F0', '#10291A', '#24804A', '#D5EEDD']] }
    ]
  };
  var FONTS = [['', "The look's own font"], ['Playfair Display', 'Classic serif'], ['Cormorant Garamond', 'Elegant serif'], ['DM Serif Display', 'Soft serif'],
    ['Bodoni Moda', 'Fashion serif'], ['Archivo', 'Modern bold'], ['Anton', 'Tall and strong'], ['Oswald', 'Sporty'], ['Nunito', 'Friendly round'], ['Jost', 'Clean and simple']];
  var SERIF = { 'Playfair Display': 1, 'Cormorant Garamond': 1, 'DM Serif Display': 1, 'Bodoni Moda': 1 };

  var SAMPLES = {
    classes: {
      linen: [['Reformer Flow', 'Mon', '18:00'], ['Mat Pilates', 'Tue', '09:30'], ['Barre Burn', 'Thu', '19:15']],
      daylight: [['Sunrise Yoga', 'Mon', '06:30'], ['Power Cycle', 'Wed', '18:00'], ['Slow Flow', 'Sat', '10:00']],
      evening: [['Sculpt 45', 'Mon', '19:00'], ['Strength Club', 'Wed', '18:30'], ['Stretch & Restore', 'Fri', '17:30']],
      forge: [['Strength Club', 'Mon', '06:00'], ['Boxing Basics', 'Tue', '18:30'], ['Conditioning', 'Thu', '19:00']],
      crown: [['Barbering Basics', 'Sat', '10:00'], ['Fade Workshop', 'Sat', '13:00'], ['Beard Care Class', 'Sun', '12:00']],
      clay: [['Mat Pilates', 'Mon', '09:00'], ['Reformer Duet', 'Wed', '18:00'], ['Stretch', 'Sat', '10:00']],
      mint: [['Bootcamp', 'Mon', '06:30'], ['HIIT 30', 'Wed', '12:00'], ['Run Club', 'Sat', '08:00']],
      noir: [['Boxing', 'Mon', '18:00'], ['Strength', 'Wed', '19:00'], ['Conditioning', 'Fri', '07:00']],
      blush: [['Barre', 'Tue', '09:30'], ['Dance Cardio', 'Thu', '18:30'], ['Sculpt', 'Sat', '10:00']],
      sky: [['Swim Lesson', 'Mon', '16:00'], ['Group Tutoring', 'Wed', '17:00'], ['Kids Art', 'Sat', '11:00']]
    },
    appointments: {
      linen: [['Lash Fill', 'Mon', '10:00'], ['Brow Shape', 'Mon', '11:30'], ['Facial', 'Mon', '13:00']],
      daylight: [['Private Yoga', 'Mon', '09:00'], ['Massage · 60 min', 'Mon', '11:00'], ['Private Lesson', 'Mon', '15:00']],
      evening: [['Lash Lift', 'Mon', '10:00'], ['Brow Lamination', 'Mon', '12:00'], ['Sculpt 1:1', 'Mon', '17:00']],
      forge: [['Personal Training', 'Mon', '06:00'], ['Boxing 1:1', 'Mon', '17:00'], ['Fitness Assessment', 'Mon', '18:00']],
      crown: [['Haircut', 'Mon', '10:00'], ['Skin Fade', 'Mon', '11:30'], ['Beard Trim', 'Mon', '13:00']],
      clay: [['Private Pilates', 'Mon', '09:00'], ['Private Pilates', 'Mon', '10:30'], ['Intro Session', 'Mon', '12:00']],
      mint: [['Personal Training', 'Mon', '06:30'], ['Personal Training', 'Mon', '08:00'], ['Consultation', 'Mon', '12:00']],
      noir: [['Haircut', 'Mon', '10:00'], ['Cut & Beard', 'Mon', '11:00'], ['Line Up', 'Mon', '12:30']],
      blush: [['Gel Manicure', 'Mon', '10:00'], ['Lash Fill', 'Mon', '12:00'], ['Brow Tint', 'Mon', '14:00']],
      sky: [['Tutoring · 1 hr', 'Mon', '15:00'], ['Music Lesson', 'Mon', '16:30'], ['Driving Lesson', 'Mon', '18:00']]
    }
  };
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // ---------- color helpers ----------
  function rgb(h) { h = String(h || '#000000').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hex(a) { return '#' + a.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join('').toUpperCase(); }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return hex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }
  function lum(h) { return rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function (s, v, i) { return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0); }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function on(bg, pref) { if (pref && contrast(pref, bg) >= 4.5) return pref; return contrast('#FFFFFF', bg) >= contrast('#111111', bg) ? '#FFFFFF' : '#111111'; }
  function nudge(col, bg, need) { // smallest change toward black or white that makes col readable on bg
    var best = null;
    ['#000000', '#FFFFFF'].forEach(function (end) {
      for (var t = 0.05; t <= 1.001; t += 0.05) { var c = mix(col, end, t); if (contrast(c, bg) >= need) { if (!best || t < best.t) best = { t: t, c: c }; break; } }
    });
    return best ? best.c : on(bg);
  }

  // preview colors for each look, from the business's own colors
  function studioVars(id, c) {
    var v;
    if (id === 'linen') v = { page: mix(c.bg, c.soft, .45), site: c.bg, ink: c.main, sub: mix(c.main, c.bg, .35), line: mix(c.main, c.bg, .84), btn: c.main, btnink: on(c.main, c.bg), accent: c.accent,
      photo: c.soft, photoink: mix(c.main, c.soft, .3), card: c.bg, cardink: c.main, cardsub: mix(c.main, c.bg, .35), slot: c.bg, pill: mix(c.soft, c.bg, .45), pillink: c.main, full: c.main, fullink: on(c.main, c.bg) };
    if (id === 'daylight') { var slot = lum(c.bg) < .2 ? mix(c.bg, '#FFFFFF', .08) : '#FFFFFF';
      v = { page: mix(c.bg, '#FFFFFF', .6), site: c.bg, ink: c.main, sub: mix(c.main, c.bg, .35), line: mix(c.main, c.bg, .85), btn: c.main, btnink: on(c.main, c.bg), accent: c.main, accent2: c.accent, accent2ink: on(c.accent, c.main),
      photo: c.soft, photoink: mix(c.main, c.soft, .3), card: c.bg, cardink: c.main, cardsub: mix(c.main, c.bg, .35), slot: slot, pill: c.accent, pillink: on(c.accent, c.main), full: mix('#F26B4A', slot, .82), fullink: '#7A3A12' }; }
    if (id === 'evening') v = { page: c.bg, site: mix(c.bg, c.main, .05), ink: c.main, sub: mix(c.main, c.bg, .3), line: mix(c.main, c.bg, .82), btn: c.accent, btnink: on(c.accent, c.bg), accent: c.accent,
      photo: c.soft, photoink: mix(c.main, c.soft, .25), card: mix(c.bg, c.main, .05), cardink: c.main, cardsub: mix(c.main, c.bg, .3), slot: 'transparent', pill: 'transparent', pillink: c.accent, full: 'transparent', fullink: c.main };
    if (id === 'forge') v = { page: c.bg, site: mix(c.bg, c.main, .04), ink: c.main, sub: mix(c.main, c.bg, .3), line: mix(c.main, c.bg, .82), btn: c.accent, btnink: on(c.accent, c.bg), accent: c.accent,
      photo: c.soft, photoink: mix(c.main, c.soft, .25), card: mix(c.bg, c.main, .04), cardink: c.main, cardsub: mix(c.main, c.bg, .3), slot: mix(c.bg, c.main, .08), pill: c.main, pillink: c.bg, full: c.accent, fullink: on(c.accent, c.bg) };
    if (id === 'crown') v = { page: c.light, site: c.dark, ink: c.light, sub: mix(c.light, c.dark, .22), line: mix(c.light, c.dark, .8), btn: c.accent, btnink: on(c.accent, c.dark), accent: mix(c.accent, c.light, .25),
      photo: mix(c.dark, '#FFFFFF', .08), photoink: mix(c.light, c.dark, .2), card: mix(c.light, '#FFFFFF', .7), cardink: c.dark, cardsub: mix(c.dark, c.light, .35), cline: mix(c.dark, c.light, .6), slot: 'transparent',
      pill: mix(c.accent, c.light, .65), pillink: c.dark, full: c.stripe, fullink: on(c.stripe), stripe: c.stripe, light: c.light, dark: c.dark };
    if (!v.cline) v.cline = v.line;
    return v;
  }
  function soloVars(c) {
    return { bg: c.bg, ink: c.ink, card: lum(c.bg) < .18 ? mix(c.bg, '#FFFFFF', .09) : '#FFFFFF', muted: mix(c.ink, c.bg, .38), bb: c.bb, bt: on(c.bb, c.bg), pb: c.pb, pt: on(c.pb, c.ink) };
  }
  // pairs that must stay readable: [color to fix, its background, how much contrast, plain words]
  function checks(id, c) {
    if (id === 'crown') return [['light', 'dark', 4.5, 'Your light and dark colors are too close, so text will be hard to read.']];
    if (/^(clay|mint|noir|blush|sky)$/.test(id)) return [['ink', 'bg', 4.5, 'Your text color is hard to read on your background.'], ['bb', 'bg', 1.4, 'Your buttons blend into the background.']];
    var out = [['main', 'bg', 4.5, 'Your text color is hard to read on your background.']];
    if (id === 'evening' || id === 'forge' || id === 'linen') out.push(['accent', 'bg', 2.2, 'Your accent color is faint on your background.']);
    return out;
  }

  // ---------- state ----------
  var S = { plan: 'studio', look: { studio: 'linen', solo: 'clay' }, colors: {}, font: '', kind: 'classes', kindSet: false, sched: 'us', rows: [['', 'Mon', '']], logo: '', photo: '' };
  try { var saved = JSON.parse(localStorage.getItem('erea-start') || 'null'); if (saved) { ['plan', 'look', 'colors', 'font', 'kind', 'kindSet', 'sched', 'rows'].forEach(function (k) { if (saved[k] != null) S[k] = saved[k]; }); } } catch (e) {}
  var q = new URLSearchParams(location.search);
  if (q.get('plan') === 'solo' || q.get('plan') === 'studio') S.plan = q.get('plan');
  var ql = (q.get('look') || '').toLowerCase();
  ['studio', 'solo'].forEach(function (p) { LOOKS[p].forEach(function (l) { if (l.id === ql) { S.plan = p; S.look[p] = ql; } }); });
  if (ql && !S.kindSet) S.kind = (ql === 'crown' || ql === 'noir') ? 'appointments' : 'classes';

  function look() { var id = S.look[S.plan]; return LOOKS[S.plan].filter(function (l) { return l.id === id; })[0] || LOOKS[S.plan][0]; }
  function cols(l) { l = l || look(); var c = {}, mine = S.colors[l.id] || {}; l.roles.forEach(function (r) { c[r[0]] = /^#[0-9A-F]{6}$/i.test(mine[r[0]] || '') ? mine[r[0]].toUpperCase() : r[2]; }); return c; }
  function changed(l) { var c = cols(l); return l.roles.some(function (r) { return c[r[0]] !== r[2]; }); }
  function persist() { try { var o = {}; ['plan', 'look', 'colors', 'font', 'kind', 'kindSet', 'sched', 'rows'].forEach(function (k) { o[k] = S[k]; }); localStorage.setItem('erea-start', JSON.stringify(o)); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var form = $('sform');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function t12(t) { var m = /^(\d{1,2}):(\d{2})/.exec(t || ''); if (!m) return t || ''; var h = +m[1], ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + m[2] + ' ' + ap; }
  function val(id) { return ($(id) && $(id).value || '').trim(); }

  // ---------- build the controls ----------
  function drawPlan() {
    [].forEach.call(document.querySelectorAll('.plan-tog button'), function (b) { b.classList.toggle('on', b.dataset.plan === S.plan); });
    $('look-hint').textContent = S.plan === 'solo' ? '5 styles for your booking link and My Schedule.' : '5 looks for your website, booking page and Front Desk. They all match.';
    $('skip').innerHTML = S.plan === 'solo'
      ? 'Erea Solo opens soon. Save your setup and you’ll be first in line. Nothing to pay today.'
      : 'Already know what you want? <a href="' + STUDIO_STRIPE + '">Skip to checkout</a> and we’ll set it up with you after.';
    $('go').innerHTML = S.plan === 'solo' && !SOLO_STRIPE ? 'Save my setup &amp; get first in line →' : 'Save my setup &amp; continue to checkout →';
    $('go-fine').textContent = S.plan === 'solo'
      ? (SOLO_STRIPE ? 'Erea Solo is $39/mo. No contract, cancel anytime. Ready in 1 to 2 weeks.' : 'Erea Solo is $39/mo. Nothing to pay today. We’ll reach out personally within 1 business day.')
      : 'Next is secure checkout with Stripe. We build your website and booking page from this setup. Live in 1 to 2 weeks. No contract, cancel anytime.';
    $('photo-box').hidden = S.plan === 'solo';
  }
  function drawLooks() {
    var cur = look();
    $('looks').innerHTML = LOOKS[S.plan].map(function (l) {
      var c = cols(l);
      return '<button type="button" class="lp' + (l.id === cur.id ? ' on' : '') + '" data-look="' + l.id + '" aria-pressed="' + (l.id === cur.id) + '"><span class="lp-sw">' +
        l.roles.map(function (r) { return '<b style="background:' + c[r[0]] + '"></b>'; }).join('') + '</span><span class="lp-t"><strong>' + esc(l.name) + '</strong><small>' + esc(l.forWho) + '</small></span></button>';
    }).join('');
  }
  function drawColors() {
    var l = look(), c = cols(l);
    $('cols').innerHTML = l.roles.map(function (r) {
      return '<label class="cpick"><input type="color" data-role="' + r[0] + '" value="' + c[r[0]].toLowerCase() + '" aria-label="' + esc(r[1]) + '"><span><b>' + esc(r[1]) + '</b><small>' + c[r[0]] + '</small></span></label>';
    }).join('');
    var pres = [['Original'].concat(l.roles.map(function (r) { return r[2]; }))].concat(l.presets);
    $('presets').innerHTML = '<span>Quick ideas:</span>' + pres.map(function (p, i) {
      return '<button type="button" class="pre" data-pre="' + i + '"><i>' + p.slice(1).map(function (h) { return '<b style="background:' + h + '"></b>'; }).join('') + '</i>' + esc(p[0]) + '</button>';
    }).join('');
    drawCheck();
  }
  function drawCheck() {
    var l = look(), c = cols(l), bad = checks(l.id, c).filter(function (k) { return contrast(c[k[0]], c[k[1]]) < k[2]; });
    $('readcheck').innerHTML = bad.length
      ? '<div class="warn"><span>⚠️ ' + esc(bad[0][3]) + '</span><button type="button" id="fixit">Fix it for me</button></div>'
      : (changed(l) ? '<div class="ok-read">✓ Easy to read. Looking good.</div>' : '');
  }
  function drawFonts() { $('f-font').innerHTML = FONTS.map(function (f) { return '<option value="' + esc(f[0]) + '"' + (f[0] === S.font ? ' selected' : '') + '>' + esc(f[1]) + (f[0] ? ' (' + esc(f[0]) + ')' : '') + '</option>'; }).join(''); }
  function drawKind() { [].forEach.call(document.querySelectorAll('#kind .chip'), function (b) { b.classList.toggle('on', b.dataset.kind === S.kind); }); }
  function drawSched() {
    [].forEach.call(document.querySelectorAll('#sched label'), function (lb) { var i = lb.querySelector('input'); i.checked = i.value === S.sched; lb.classList.toggle('on', i.checked); });
    $('rows-box').hidden = S.sched !== 'me';
    var appt = S.kind === 'appointments';
    $('rows').innerHTML = S.rows.map(function (r, i) {
      return '<div class="crow" data-i="' + i + '"><input name="cname" maxlength="40" placeholder="' + (appt ? 'Service, e.g. Haircut' : 'Class, e.g. Mat Pilates') + '" value="' + esc(r[0]) + '">' +
        '<select name="cday" aria-label="Day">' + DAYS.map(function (d) { return '<option' + (d === r[1] ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select>' +
        '<input name="ctime" type="time" aria-label="Time" value="' + esc(r[2]) + '"><button type="button" aria-label="Remove" data-rm="' + i + '">×</button></div>';
    }).join('');
    $('addrow').hidden = S.rows.length >= 8;
  }

  // ---------- live preview ----------
  function items() {
    var mine = S.sched === 'me' ? S.rows.filter(function (r) { return (r[0] || '').trim(); }) : [];
    return mine.length ? mine.slice(0, 4) : SAMPLES[S.kind][look().id];
  }
  function headFont(l) { return S.font ? "'" + S.font + "'," + (SERIF[S.font] ? 'serif' : 'sans-serif') : (l.head || l.f); }
  function drawPreview() {
    var l = look(), c = cols(l), name = val('f-business') || 'Your Business', tag = val('f-tagline'), town = val('f-town'), appt = S.kind === 'appointments';
    var its = items(), used = {};
    its.forEach(function (r) { used[r[1]] = 1; });
    var activeDay = its[0] ? its[0][1] : 'Mon';
    $('pv-sub').textContent = l.name + (changed(l) ? ' · your colors' : '');
    var html;
    if (S.plan === 'studio') {
      var v = studioVars(l.id, c);
      v.head = headFont(l); v.body = l.body;
      var style = Object.keys(v).map(function (k) { return '--' + k + ':' + v[k]; }).join(';');
      var slots = its.map(function (r, i) {
        var full = i === 1;
        return appt
          ? '<div class="pv-slot' + (full ? ' full' : '') + '"><span><b>' + t12(r[2]) + '</b><small>' + esc(r[0]) + '</small></span><em>' + (full ? 'Taken · Waitlist' : 'Book') + '</em></div>'
          : '<div class="pv-slot' + (full ? ' full' : '') + '"><span><b>' + esc(r[0]) + '</b><small>' + r[1] + ' · ' + t12(r[2]) + '</small></span><em>' + (full ? 'Full · Waitlist' : (i === 0 ? '3 spots left' : '6 spots left')) + '</em></div>';
      }).join('');
      html = '<div class="pv lk-' + l.id + '" style="' + style + '">' + (l.id === 'crown' ? '<div class="pv-stripe"></div>' : '') +
        '<div class="pv-site"><div class="pv-nav"><div class="pv-brand">' + (S.logo ? '<img src="' + S.logo + '" alt="">' : '') + '<span>' + esc(name) + '</span></div>' +
        '<div class="pv-links"><span>' + (appt ? 'Services' : 'Classes') + '</span><span>Pricing</span><span>About</span></div><span class="pv-btn">Book now</span></div>' +
        '<div class="pv-hero"><div class="pv-copy"><div class="pv-eye">' + esc(town || (appt ? 'Book online' : 'Now booking')) + '</div><h2 class="pv-h1">' + esc(tag || name) + '</h2>' +
        '<p>' + (appt ? 'Pick a time that works for you. Can’t make it? Cancel by text and the next person gets your spot.' : 'Small classes, real attention. Book in seconds and get a reminder by text.') + '</p>' +
        '<div><span class="pv-btn">' + (appt ? 'Book an appointment' : 'Book a class') + '</span></div></div>' +
        '<div class="pv-photo"' + (S.photo ? ' style="background-image:url(' + S.photo + ')"' : '') + '><span>' + (S.photo ? '' : 'Your photo here') + '</span></div></div></div>' +
        '<div class="pv-book"><div class="pv-card"><div class="pv-ct">Book</div><div class="pv-cd">' + (appt ? 'Pick a time. Taken? Join the waitlist.' : 'Pick a class. Full? Join the waitlist.') + '</div>' +
        '<div class="pv-days">' + DAYS.slice(0, 6).map(function (d) { return '<span' + (d === activeDay ? ' class="on"' : '') + '>' + d + '</span>'; }).join('') + '</div>' + slots +
        '<span class="pv-btn">Book my spot</span></div></div><div class="pv-foot">Booking by Erea</div></div>';
    } else {
      var sv = soloVars(c);
      sv.f = headFont(l); sv.ns = l.ns; sv.tr = l.tr; sv.tc = l.tc; sv.r = l.r; sv.lr = l.lr;
      var sstyle = Object.keys(sv).map(function (k) { return '--' + k + ':' + sv[k]; }).join(';');
      var sslots = its.map(function (r, i) {
        return '<div class="ph-slot"><span><b>' + (appt ? t12(r[2]) : esc(r[0])) + '</b><span>' + (appt ? esc(r[0]) : r[1] + ' · ' + t12(r[2])) + '</span></span><em>' + (i === 1 ? (appt ? 'Taken · Waitlist' : 'Full · Waitlist') : (appt ? 'Open' : '2 left')) + '</em></div>';
      }).join('');
      html = '<div class="pv-phone-wrap"><div class="ph" style="' + sstyle + '"><div class="ph-top"><div class="ph-logo"' + (S.logo ? ' style="background-image:url(' + S.logo + ');background-color:transparent"' : '') + '>' + (S.logo ? '' : esc(name.charAt(0).toUpperCase())) + '</div>' +
        '<div class="ph-name">' + esc(name) + '</div><div class="ph-tag">' + esc(tag || town || 'Book in seconds') + '</div></div>' +
        '<div class="ph-tabs"><span class="on">Book</span><span>My bookings</span><span>Prices</span></div>' +
        '<div class="ph-days">' + DAYS.slice(0, 6).map(function (d) { return '<span' + (d === activeDay ? ' class="on"' : '') + '>' + d + '</span>'; }).join('') + '</div>' + sslots +
        '<div class="ph-btn">Book</div><div class="ph-by">Booking by Erea Solo</div></div></div>';
    }
    $('pv').innerHTML = html;
  }
  function all() { drawPlan(); drawLooks(); drawColors(); drawFonts(); drawKind(); drawSched(); drawPreview(); }

  // ---------- events ----------
  document.querySelector('.plan-tog').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; S.plan = b.dataset.plan; if (!S.kindSet) S.kind = S.look[S.plan] === 'crown' || S.plan === 'solo' && S.look.solo === 'noir' ? 'appointments' : S.kind; persist(); all();
  });
  $('looks').addEventListener('click', function (e) {
    var b = e.target.closest('.lp'); if (!b) return; S.look[S.plan] = b.dataset.look;
    if (!S.kindSet) S.kind = (b.dataset.look === 'crown' || b.dataset.look === 'noir') ? 'appointments' : 'classes';
    persist(); drawLooks(); drawColors(); drawKind(); drawSched(); drawPreview();
  });
  $('cols').addEventListener('input', function (e) {
    var i = e.target; if (!i.dataset.role) return; var l = look();
    S.colors[l.id] = S.colors[l.id] || {}; S.colors[l.id][i.dataset.role] = i.value.toUpperCase();
    i.parentNode.querySelector('small').textContent = i.value.toUpperCase();
    persist(); drawLooks(); drawCheck(); drawPreview();
  });
  $('presets').addEventListener('click', function (e) {
    var b = e.target.closest('.pre'); if (!b) return; var l = look(), n = +b.dataset.pre;
    if (n === 0) delete S.colors[l.id];
    else { var p = l.presets[n - 1], o = {}; l.roles.forEach(function (r, i) { o[r[0]] = p[i + 1]; }); S.colors[l.id] = o; }
    persist(); drawLooks(); drawColors(); drawPreview();
  });
  $('readcheck').addEventListener('click', function (e) {
    if (e.target.id !== 'fixit') return; var l = look(), c = cols(l);
    S.colors[l.id] = S.colors[l.id] || {};
    checks(l.id, c).forEach(function (k) { if (contrast(c[k[0]], c[k[1]]) < k[2]) { c[k[0]] = nudge(c[k[0]], c[k[1]], k[2] >= 4.5 ? 7 : k[2] + 1); S.colors[l.id][k[0]] = c[k[0]]; } });
    persist(); drawLooks(); drawColors(); drawPreview();
  });
  $('f-font').addEventListener('change', function () { S.font = this.value; persist(); drawPreview(); });
  $('kind').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; S.kind = b.dataset.kind; S.kindSet = true; persist(); drawKind(); drawSched(); drawPreview(); });
  $('sched').addEventListener('change', function (e) { S.sched = e.target.value; persist(); drawSched(); drawPreview(); });
  $('rows').addEventListener('input', function (e) {
    var row = e.target.closest('.crow'); if (!row) return; var i = +row.dataset.i;
    S.rows[i] = [row.querySelector('[name=cname]').value, row.querySelector('[name=cday]').value, row.querySelector('[name=ctime]').value];
    persist(); drawPreview();
  });
  $('rows').addEventListener('change', function (e) { var row = e.target.closest('.crow'); if (!row) return; var i = +row.dataset.i; S.rows[i] = [row.querySelector('[name=cname]').value, row.querySelector('[name=cday]').value, row.querySelector('[name=ctime]').value]; persist(); drawPreview(); });
  $('rows').addEventListener('click', function (e) { var b = e.target.closest('[data-rm]'); if (!b) return; S.rows.splice(+b.dataset.rm, 1); if (!S.rows.length) S.rows = [['', 'Mon', '']]; persist(); drawSched(); drawPreview(); });
  $('addrow').addEventListener('click', function () { var last = S.rows[S.rows.length - 1] || ['', 'Mon', '']; S.rows.push(['', last[1], '']); persist(); drawSched(); var ins = $('rows').querySelectorAll('[name=cname]'); ins[ins.length - 1].focus(); });
  ['f-business', 'f-tagline', 'f-town'].forEach(function (id) { $(id).addEventListener('input', drawPreview); });
  function readImg(input, key, label) {
    input.addEventListener('change', function () {
      var f = input.files && input.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) return;
      var rd = new FileReader();
      rd.onload = function () { // shrink so the preview stays quick
        var img = new Image(); img.onload = function () {
          var max = key === 'logo' ? 300 : 900, k = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement('canvas');
          cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
          S[key] = cv.toDataURL(key === 'logo' ? 'image/png' : 'image/jpeg', .85); $(label).textContent = f.name.slice(0, 30) + ' ✓'; drawPreview();
        }; img.src = rd.result;
      };
      rd.readAsDataURL(f);
    });
  }
  readImg($('f-logo'), 'logo', 'logo-n'); readImg($('f-photo'), 'photo', 'photo-n');
  // schedule file (photo/screenshot/PDF): sent with the setup and saved to Erea's Google Drive
  var schedFile = null;
  $('f-sched').addEventListener('change', function () {
    var f = this.files && this.files[0]; schedFile = null;
    if (!f) return;
    if (!/^image\//.test(f.type) && f.type !== 'application/pdf') { $('sched-n').textContent = 'Please pick a photo, screenshot or PDF'; return; }
    if (f.type === 'application/pdf' && f.size > 10 * 1024 * 1024) { $('sched-n').textContent = 'That PDF is over 10 MB. Try a photo or a link instead.'; return; }
    schedFile = f; $('sched-n').textContent = f.name.slice(0, 40) + ' ✓'; $('sched-clear').hidden = false;
  });
  $('sched-clear').addEventListener('click', function () { schedFile = null; $('f-sched').value = ''; $('sched-n').textContent = 'Up to 10 MB'; this.hidden = true; });
  function fileData(f) { // photos are shrunk (still easy to read); PDFs go as they are
    return new Promise(function (res, rej) {
      if (!f) return res(null);
      var rd = new FileReader(); rd.onerror = function () { rej(new Error('fail')); };
      rd.onload = function () {
        if (f.type === 'application/pdf' || /gif|svg/.test(f.type)) return res({ name: f.name, type: f.type, data: String(rd.result).split(',')[1] });
        var img = new Image();
        img.onerror = function () { res({ name: f.name, type: f.type, data: String(rd.result).split(',')[1] }); };
        img.onload = function () {
          var k = Math.min(1, 2200 / Math.max(img.width, img.height)), cv = document.createElement('canvas');
          cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
          var cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height);
          res({ name: f.name.replace(/\.[^.]+$/, '') + '.jpg', type: 'image/jpeg', data: cv.toDataURL('image/jpeg', .85).split(',')[1] });
        };
        img.src = rd.result;
      };
      rd.readAsDataURL(f);
    });
  }
  $('pv-open').addEventListener('click', function () { $('pv-wrap').classList.add('open'); $('pv-open').style.display = 'none'; });
  $('pv-close').addEventListener('click', function () { $('pv-wrap').classList.remove('open'); $('pv-open').style.display = ''; });

  // ---------- save ----------
  function summary(id) {
    var l = look(), c = cols(l), parts = [];
    parts.push('Setup ' + id);
    parts.push(S.plan === 'solo' ? 'Erea Solo' : 'Erea');
    parts.push('Look: ' + l.name + (changed(l) ? ' (own colors)' : ' (original colors)'));
    parts.push('Colors: ' + l.roles.map(function (r) { return r[1] + ' ' + c[r[0]]; }).join(', '));
    if (S.font) parts.push('Heading font: ' + S.font);
    parts.push('Books: ' + S.kind);
    if (val('f-tagline')) parts.push('Line: ' + val('f-tagline'));
    if (S.sched === 'us') parts.push('Schedule: set it up for me' + (val('f-link') ? ' - ' + val('f-link') : '') + (schedFile ? ' (file attached)' : ''));
    else {
      var mine = S.rows.filter(function (r) { return (r[0] || '').trim(); }).map(function (r) { return r[0].trim() + ' ' + r[1] + ' ' + t12(r[2]); });
      parts.push('Schedule: ' + (mine.length ? mine.join('; ') : 'none added yet') + (val('f-link') ? ' - ' + val('f-link') : ''));
    }
    if (S.logo || S.photo) parts.push('Has ' + [S.logo ? 'logo' : '', S.photo ? 'photo' : ''].filter(Boolean).join(' + ') + ' (ask them to send)');
    var extra = (form.elements.extra.value || '').trim(); if (extra) parts.push('Note: ' + extra);
    return parts.join(' | ').slice(0, 1500);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('st-msg'), btn = $('go'); msg.hidden = true;
    var need = [form.elements.business, form.elements.name, form.elements.email];
    for (var i = 0; i < need.length; i++) { if (!need[i].reportValidity()) { need[i].focus(); return; } }
    var id = 'ST-' + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();
    var d = new URLSearchParams();
    d.set('type', S.plan); d.set('name', form.elements.name.value.trim()); d.set('business', val('f-business'));
    d.set('email', form.elements.email.value.trim()); d.set('phone', form.elements.phone.value.trim()); d.set('town', val('f-town'));
    d.set('note', summary(id)); d.set('page', '/start'); d.set('website', form.elements.website.value);
    var payUrl = S.plan === 'solo' ? SOLO_STRIPE : STUDIO_STRIPE;
    if (payUrl) payUrl += '?prefilled_email=' + encodeURIComponent(form.elements.email.value.trim()) + '&client_reference_id=' + id;
    btn.disabled = true; btn.textContent = schedFile ? 'Uploading your schedule…' : 'Saving your setup…';
    fileData(schedFile).then(function (fd) {
      if (fd) { d.set('fileName', fd.name); d.set('fileType', fd.type); d.set('fileData', fd.data); }
      return fetch(ENDPOINT, { method: 'POST', body: d });
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r.ok) throw new Error(r.error || 'fail');
        persist();
        if (payUrl) { btn.textContent = 'Saved! Taking you to checkout…'; location.href = payUrl; return; }
        var first = (form.elements.name.value || '').trim().split(' ')[0];
        $('step-you').innerHTML = '<div class="done"><div class="tick">✓</div><h3>Your setup is saved' + (first ? ', ' + esc(first) : '') + '!</h3>' +
          '<p style="color:var(--muted);margin:8px 0 0">You’re first in line for Erea Solo. We’ll reach out personally within 1 business day to finish your booking link with you. Nothing to pay today.</p></div>';
      })
      .catch(function (err) {
        btn.disabled = false; drawPlan();
        var m = (err && err.message && err.message !== 'fail' && !/fetch|json|network/i.test(err.message)) ? esc(err.message) : 'We couldn’t save your setup just now. Please try again.';
        msg.innerHTML = m + (payUrl ? ' Or <a href="' + payUrl + '">continue to checkout</a> and email your choices to <a href="mailto:hello@ereaai.com">hello@ereaai.com</a>.' : ' Or email <a href="mailto:hello@ereaai.com">hello@ereaai.com</a>.');
        msg.hidden = false;
      });
  });

  all();
})();
