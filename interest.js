// Interest list form: sends signups to the Erea Interest List Google Apps Script (saves to a sheet + emails Erea).
(function () {
  var ENDPOINT = '__ENDPOINT__';
  var f = document.getElementById('jform'); if (!f) return;
  var msg = document.getElementById('jmsg'), btn = f.querySelector('button');
  f.addEventListener('submit', function (e) {
    e.preventDefault(); msg.hidden = true;
    if (!f.reportValidity()) return;
    var d = new URLSearchParams(new FormData(f)); d.set('page', location.pathname);
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(ENDPOINT, { method: 'POST', body: d })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (!r.ok) throw new Error(r.error || 'fail'); done(); })
      .catch(function (err) {
        btn.disabled = false; btn.textContent = 'Join the interest list';
        msg.textContent = (err && err.message && err.message !== 'fail' && !/fetch|json|network/i.test(err.message)) ? err.message :
          'Something went wrong. Please try again, or email hello@ereaai.com.';
        msg.hidden = false;
      });
  });
  function done() {
    var first = (f.elements.name.value || '').trim().split(' ')[0];
    f.outerHTML = '<div class="jdone"><div class="tick">✓</div><h3>You’re on the list' + (first ? ', ' + first.replace(/[<>&"]/g, '') : '') +
      '!</h3><p>We\u2019ll reach out personally within 1 business day. Nothing to pay, nothing to sign.</p></div>';
  }
})();
