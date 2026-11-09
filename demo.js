/* Erea practice demo. Everything lives in this page's memory:
   nothing is sent to any server, nothing is saved, no texts go out.
   Each page sets window.EREA_DEMO (studio or solo) before loading this file. */
(function () {
  var C = window.EREA_DEMO;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var bizName = C.defaultName;

  // ---------- sample data (fictional) ----------
  var DAYS = [];
  var base = new Date(); base.setHours(12, 0, 0, 0);
  for (var i = 0; i < 6; i++) DAYS.push(new Date(base.getTime() + i * 86400000));
  var dayLabel = function (d, i) { return i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }); };
  var dayLong = function (d) { return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
  var NAMES = ['Maya R.', 'Jordan T.', 'Aisha K.', 'Luis M.', 'Priya S.', 'Dev P.', 'Kemi A.', 'Sam W.', 'Tasha B.', 'Marco D.', 'Nia O.', 'Ben C.', 'Rosa L.', 'Ike N.'];
  var PAYS = C.pays; // e.g. ['member','paid','unpaid']
  var sessions = [];
  var sid = 0;
  DAYS.forEach(function (d, di) {
    C.schedule.forEach(function (t, ti) {
      if ((di + ti) % 4 === 3 && t.cap > 1) return; // vary the days a little
      var s = { id: ++sid, day: di, time: t.time, name: t.name, who: t.who, where: t.where || '', cap: t.cap, people: [], wait: [] };
      var n = t.full ? t.cap : Math.max(0, Math.min(t.cap - 1, Math.round(t.cap * (0.35 + ((di * 7 + ti * 3) % 5) / 10))));
      for (var k = 0; k < n; k++) s.people.push({ name: NAMES[(di * 5 + ti * 3 + k) % NAMES.length], pay: PAYS[(k + ti + di) % PAYS.length], inn: di === 0 && k % 2 === 0 && ti === 0 });
      if (s.people.length >= s.cap) s.wait.push({ name: NAMES[(di + ti + 9) % NAMES.length], you: false });
      sessions.push(s);
    });
  });

  var state = { cDay: 0, oDay: 0, oTab: 'today', you: null, youWait: null, log: [] };

  // ---------- branding ----------
  function applyName() {
    document.querySelectorAll('[data-biz]').forEach(function (el) { el.textContent = bizName; });
  }
  var nameIn = $('#bizname');
  nameIn.addEventListener('input', function () { bizName = nameIn.value.trim().slice(0, 40) || C.defaultName; applyName(); });

  // ---------- tabs (phones) ----------
  document.querySelectorAll('.vtab').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.vtab').forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      document.body.setAttribute('data-view', b.dataset.v);
    });
  });

  // ---------- texts on the client's phone ----------
  var texts = [];
  function addText(from, body, reply) {
    texts.push({ from: from, body: body, reply: reply || null });
    renderClient();
  }
  function logOwner(msg, kind) {
    var t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    state.log.unshift({ t: t, msg: msg, kind: kind || '' });
    state.log = state.log.slice(0, 8);
    renderOwner();
  }

  function spotsLeft(s) { return s.cap - s.people.length; }
  function fmtWhen(s) { return dayLong(DAYS[s.day]) + ' at ' + s.time; }

  // ---------- CLIENT VIEW ----------
  var cEl = $('#client');
  var sheet = null; // session being booked
  function renderClient() {
    var h = '<div class="ph-head">' + (C.logo ? '<div class="logo-slot" title="Your logo goes here">YOUR<br>LOGO</div>' : '') +
      '<div><div class="ph-kicker">' + esc(C.bookTitle) + '</div><div class="ph-name" data-biz>' + esc(bizName) + '</div></div></div>';
    if (texts.length) {
      h += '<div class="thread" aria-live="polite"><div class="thread-h">💬 Texts from <span data-biz>' + esc(bizName) + '</span></div>';
      texts.slice(-3).forEach(function (m, i, arr) {
        h += '<div class="tb in">' + esc(m.body) + '</div>';
        if (m.reply && i === arr.length - 1 && !m.answered) {
          h += '<div class="replies">' + m.reply.map(function (r) { return '<button class="rbtn" data-r="' + r + '">' + r + '</button>'; }).join('') + '</div>';
        } else if (m.answered) h += '<div class="tb out">' + esc(m.answered) + '</div>';
      });
      h += '</div>';
    }
    if (sheet) {
      var s = sheet, full = spotsLeft(s) <= 0;
      h += '<div class="sheet"><button class="back" data-act="back">← Back</button>' +
        '<h3>' + esc(s.name) + '</h3><p class="muted">' + fmtWhen(s) + (s.where ? '<br>📍 ' + esc(s.where) : '') + '</p>' +
        (full ? '<p class="full-note">This one is full. Join the waitlist and you\'ll get a text the moment a spot opens.</p>' : '') +
        '<label>Your name<input id="yname" autocomplete="off" placeholder="e.g. Maya" maxlength="30"></label>' +
        '<label>Mobile number<input id="yphone" inputmode="tel" autocomplete="off" placeholder="(555) 555-0123" maxlength="20"></label>' +
        '<label class="chk"><input type="checkbox" id="yok"><span>I agree to get booking texts from <span data-biz>' + esc(bizName) + '</span>. Reply STOP to opt out.</span></label>' +
        '<p class="tiny">Practice demo: this number isn\'t saved and no real text is sent.</p>' +
        '<button class="big" data-act="' + (full ? 'wait' : 'book') + '">' + (full ? 'Join the waitlist' : 'Book my spot') + '</button></div>';
    } else {
      h += '<div class="chips">' + DAYS.map(function (d, i) { return '<button class="chip' + (i === state.cDay ? ' on' : '') + '" data-cday="' + i + '">' + dayLabel(d, i) + '</button>'; }).join('') + '</div>';
      var list = sessions.filter(function (s) { return s.day === state.cDay; });
      h += '<div class="list">' + list.map(function (s) {
        var left = spotsLeft(s), mine = state.you && state.you.sid === s.id;
        return '<button class="cls" data-open="' + s.id + '"><span class="ct">' + s.time + '</span><span class="cn"><b>' + esc(s.name) + '</b><small>' + esc(s.who) + (s.where ? ' · ' + esc(s.where) : '') + '</small></span>' +
          '<span class="cs ' + (mine ? 'mine' : left <= 0 ? 'full' : '') + '">' + (mine ? 'Booked ✓' : left <= 0 ? 'Waitlist' : (s.cap === 1 ? 'Open' : left + ' left')) + '</span></button>';
      }).join('') + '</div>';
    }
    cEl.innerHTML = h;
  }
  cEl.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cday) { state.cDay = +t.dataset.cday; renderClient(); return; }
    if (t.dataset.open) { sheet = sessions.filter(function (s) { return s.id === +t.dataset.open; })[0]; renderClient(); var f = $('#yname'); if (f) f.focus(); return; }
    if (t.dataset.act === 'back') { sheet = null; renderClient(); return; }
    if (t.dataset.r) { reply(t.dataset.r); return; }
    if (t.dataset.act === 'book' || t.dataset.act === 'wait') {
      var nm = ($('#yname').value || '').trim().replace(/[^\p{L}\p{N} .'-]/gu, '').slice(0, 20);
      if (!nm) { $('#yname').focus(); $('#yname').classList.add('bad'); return; }
      if (!$('#yok').checked) { $('.chk').classList.add('bad'); return; }
      var s = sheet, first = nm.split(' ')[0];
      if (t.dataset.act === 'book') {
        if (state.you) { var old = byId(state.you.sid); old.people = old.people.filter(function (p) { return !p.you; }); }
        s.people.push({ name: nm + ' (you)', pay: C.newPay, you: true, fresh: true });
        state.you = { sid: s.id, name: nm };
        sheet = null;
        addText(bizName, fill(C.txtBooked, first, s), ['C', 'R']);
        logOwner('New booking: ' + nm + ' → ' + s.name + ', ' + fmtWhen(s) + '. Confirmation text sent.', 'new');
      } else {
        s.wait.push({ name: nm + ' (you)', you: true });
        state.youWait = { sid: s.id, name: nm };
        sheet = null;
        addText(bizName, 'Hi ' + first + '! You\'re on the waitlist for ' + s.name + ', ' + fmtWhen(s) + '. We\'ll text you the moment a spot opens.');
        logOwner(nm + ' joined the waitlist for ' + s.name + ', ' + fmtWhen(s) + '.', 'new');
        setTimeout(function () { // simulate someone cancelling so they can try YES
          if (!state.youWait) return;
          var leaver = s.people.filter(function (p) { return !p.you; })[0];
          if (!leaver) return;
          s.people = s.people.filter(function (p) { return p !== leaver; });
          logOwner(leaver.name + ' replied R (cancel). Spot opened in ' + s.name + '.', 'cancel');
          s.wait = s.wait.filter(function (w) { return !w.you; });
          s.offer = { name: nm };
          addText(bizName, 'Good news ' + first + '! A spot just opened in ' + s.name + ', ' + fmtWhen(s) + '. Want it? Reply YES or NO.', ['YES', 'NO']);
          logOwner('Waitlist offer texted to ' + nm + '.', 'offer');
        }, 4000);
      }
      if (window.matchMedia('(max-width:999px)').matches) toast(t.dataset.act === 'book' ? 'Booked! Tap "' + C.ownerTabLabel + '" above to see it on the owner\'s screen.' : 'On the waitlist. Watch your texts: a spot opens in a few seconds.');
    }
  });
  function byId(id) { return sessions.filter(function (s) { return s.id === id; })[0]; }
  function fill(tpl, first, s) {
    return tpl.replace('{first}', first).replace('{biz}', bizName).replace('{cls}', s.name).replace('{when}', fmtWhen(s)).replace('{where}', s.where);
  }
  function reply(r) {
    var m = texts[texts.length - 1]; m.answered = r;
    if (r === 'C') { logOwner((state.you ? state.you.name : 'Client') + ' replied C. Confirmed ✓', 'ok'); addText(bizName, 'Thanks, you\'re confirmed! See you there.'); }
    else if (r === 'R' && state.you) {
      var s = byId(state.you.sid); s.people = s.people.filter(function (p) { return !p.you; });
      logOwner(state.you.name + ' replied R. Booking cancelled, spot reopened.', 'cancel');
      state.you = null; addText(bizName, 'You\'re cancelled. Thanks for letting us know!');
      refill(s);
    } else if (r === 'YES' && state.youWait) {
      var w = byId(state.youWait.sid); w.offer = null;
      w.people.push({ name: state.youWait.name + ' (you)', pay: C.newPay, you: true, fresh: true });
      state.you = { sid: w.id, name: state.youWait.name }; state.youWait = null;
      logOwner('Replied YES → booked from the waitlist. Class full again.', 'ok');
      addText(bizName, 'You\'re in! See you at ' + w.name + ', ' + fmtWhen(w) + '.');
    } else if (r === 'NO') { state.youWait = null; logOwner('Waitlist offer declined. Moving to the next person.', 'cancel'); addText(bizName, 'No problem. You\'re off the waitlist for this one.'); }
    renderClient(); renderOwner();
  }
  function refill(s) {
    var w = s.wait.filter(function (x) { return !x.you; })[0];
    if (!w) { renderOwner(); return; }
    setTimeout(function () { logOwner('Waitlist offer texted to ' + w.name + ': "A spot just opened. Reply YES."', 'offer'); }, 600);
    setTimeout(function () {
      s.wait = s.wait.filter(function (x) { return x !== w; });
      s.people.push({ name: w.name, pay: PAYS[1], fresh: true });
      logOwner(w.name + ' replied YES → booked. Spot refilled with no phone calls.', 'ok');
      renderClient();
    }, 2600);
  }

  // ---------- OWNER VIEW ----------
  var oEl = $('#owner');
  function payTag(p) {
    var lab = C.payLabels[p.pay] || p.pay;
    return '<button class="tag t-' + p.pay + '" data-pay="1" title="Tap to change">' + lab + '</button>';
  }
  function renderOwner() {
    var h = '<div class="o-head">' + (C.logo ? '<div class="logo-slot sm">LOGO</div>' : '') + '<div><div class="o-kicker">' + esc(C.ownerTitle) + '</div><div class="o-name" data-biz>' + esc(bizName) + '</div></div></div>';
    h += '<div class="otabs" role="tablist">' + C.ownerTabs.map(function (t) { return '<button role="tab" aria-selected="' + (state.oTab === t[0]) + '" data-otab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
    if (state.log.length) h += '<div class="activity" aria-live="polite"><div class="act-h">Live activity <span class="dot"></span></div>' + state.log.map(function (l) { return '<div class="act ' + l.kind + '"><span>' + l.t + '</span>' + esc(l.msg) + '</div>'; }).join('') + '</div>';
    if (state.oTab === 'today') {
      h += '<div class="chips">' + DAYS.map(function (d, i) { return '<button class="chip' + (i === state.oDay ? ' on' : '') + '" data-oday="' + i + '">' + dayLabel(d, i) + '</button>'; }).join('') + '</div>';
      sessions.filter(function (s) { return s.day === state.oDay; }).forEach(function (s) {
        var pct = Math.round(100 * s.people.length / s.cap);
        h += '<div class="ocls"><div class="ocls-h"><div><b>' + s.time + ' · ' + esc(s.name) + '</b><small>' + esc(s.who) + (s.where ? ' · 📍 ' + esc(s.where) : '') + '</small></div><span class="cnt">' + s.people.length + '/' + s.cap + '</span></div>' +
          '<div class="bar"><i style="width:' + pct + '%"></i></div>';
        s.people.forEach(function (p, i) {
          h += '<div class="row' + (p.fresh ? ' fresh' : '') + (p.you ? ' you' : '') + '"><span class="pn">' + esc(p.name) + '</span>' + payTag(p) +
            '<button class="ci' + (p.inn ? ' on' : '') + '" data-ci="' + s.id + ':' + i + '">' + (p.inn ? '✓ In' : 'Check in') + '</button>' +
            '<button class="x" data-x="' + s.id + ':' + i + '" aria-label="Cancel ' + esc(p.name) + '">✕</button></div>';
        });
        if (s.wait.length) h += '<div class="wl">Waitlist: ' + s.wait.map(function (w) { return esc(w.name); }).join(', ') + '</div>';
        h += '<form class="add" data-add="' + s.id + '"><input placeholder="+ Add a client by name" maxlength="20" aria-label="Add a client"><button>Add</button></form></div>';
      });
      h += '<p class="hint">Try it: tap ✕ on someone in a full class and watch the waitlist refill the spot by itself.</p>';
    } else if (state.oTab === 'wait') {
      var any = false;
      sessions.forEach(function (s) { s.wait.forEach(function (w) { any = true; h += '<div class="lrow"><b>' + esc(w.name) + '</b><span>' + esc(s.name) + ' · ' + fmtWhen(s) + '</span><em class="tag t-wait">waiting</em></div>'; }); });
      if (!any) h += '<p class="muted">Nobody waiting right now.</p>';
      h += '<p class="hint">When a spot opens, the next person gets a text. If they don\'t answer in 2 hours, it moves to the next one.</p>';
    } else if (state.oTab === 'members') {
      h += '<div class="tbl"><div class="th"><span>Name</span><span>' + C.planWord + '</span><span>Left</span><span>Paid through</span></div>' +
        C.members.map(function (m) { return '<div class="tr"><span>' + m[0] + '</span><span>' + m[1] + '</span><span>' + m[2] + '</span><span>' + m[3] + '</span></div>'; }).join('') + '</div>' +
        '<p class="hint">Packs count down on their own when someone books, and come back if they cancel.</p>';
    } else if (state.oTab === 'report') {
      h += '<div class="rep"><div class="ex">EXAMPLE NUMBERS</div><h4>Your Monday report</h4>' +
        '<div class="kpis"><div><b>7</b>spots refilled by text</div><div><b>$175</b>kept from cancellations</div><div><b>2</b>no-shows</div><div><b>4</b>new clients</div></div>' +
        '<p class="muted">Emailed to you every Monday at 8 AM.</p></div>';
    } else if (state.oTab === 'share') {
      h += '<div class="rep"><h4>Your booking link</h4><div class="linkbox">ereaai.com/book?b=<i>your-studio</i></div><div class="linkbox">🖨️ Plus a printed QR code for your front door</div><p class="muted">Share it in your bio, print the QR for the door, or text it to clients.</p></div>';
    }
    oEl.innerHTML = h;
    sessions.forEach(function (s) { s.people.forEach(function (p) { if (p.fresh) setTimeout(function () { p.fresh = false; }, 2500); }); });
  }
  oEl.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.otab) { state.oTab = t.dataset.otab; renderOwner(); return; }
    if (t.dataset.oday) { state.oDay = +t.dataset.oday; renderOwner(); return; }
    var row = t.closest('.row');
    if (t.dataset.ci) { var a = t.dataset.ci.split(':'), p = byId(+a[0]).people[+a[1]]; p.inn = !p.inn; if (p.inn) logOwner(p.name.replace(' (you)', '') + ' checked in.', 'ok'); else renderOwner(); return; }
    if (t.dataset.pay && row) {
      var ci = row.querySelector('[data-ci]').dataset.ci.split(':'), pp = byId(+ci[0]).people[+ci[1]];
      pp.pay = PAYS[(PAYS.indexOf(pp.pay) + 1) % PAYS.length]; renderOwner(); return;
    }
    if (t.dataset.x) {
      var b = t.dataset.x.split(':'), s = byId(+b[0]), gone = s.people.splice(+b[1], 1)[0];
      if (gone.you) { state.you = null; addText(bizName, 'Your booking for ' + s.name + ' was cancelled by the front desk.'); }
      logOwner(gone.name + ' cancelled from ' + s.name + '. Spot reopened.', 'cancel');
      refill(s); renderClient(); return;
    }
  });
  oEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, s = byId(+f.dataset.add), v = f.querySelector('input').value.trim().replace(/[^\p{L}\p{N} .'-]/gu, '').slice(0, 20);
    if (!v) return;
    if (spotsLeft(s) <= 0) { s.wait.push({ name: v }); logOwner(v + ' added to the waitlist (class is full).', 'new'); }
    else { s.people.push({ name: v, pay: PAYS[PAYS.length - 1], fresh: true }); logOwner('Added ' + v + ' to ' + s.name + '. Confirmation text sent.', 'new'); }
    renderClient();
  });

  // ---------- toast ----------
  var tEl = $('#toast'), tT;
  function toast(m) { tEl.textContent = m; tEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { tEl.classList.remove('on'); }, 3800); }

  renderClient(); renderOwner(); applyName();
})();
