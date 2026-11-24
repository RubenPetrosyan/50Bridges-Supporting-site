// DOT lookup widget — calls the site's own /api/carrier function, which reads the
// public FMCSA SAFER Company Snapshot plus FMCSA open data (Company Census and
// Insurance History datasets) and returns clean JSON. No data is invented:
// fields the sources leave empty are shown as —, and the insurance history is
// labelled as cancelled/replaced filings only, because active filings are not
// part of the open dataset.
(function () {
  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function list(v) { return (v && v.length) ? v.join(', ') : '—'; }
  function val(v) { return (v == null || v === '') ? '—' : v; }

  var input = el('dot'), btn = el('lookupBtn'), msg = el('lookupMsg'), box = el('fmcsaResult');
  if (!input || !btn) return;

  function saferLink(d) {
    return 'https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=' + encodeURIComponent(d);
  }

  async function lookup() {
    var d = (input.value || '').replace(/[^0-9]/g, '').slice(0, 10);
    input.value = d;
    if (!d) {
      msg.innerHTML = '<b>A US DOT number is required.</b> Enter it first, then run the lookup.';
      input.focus();
      return;
    }
    msg.textContent = 'Looking up FMCSA records for DOT ' + d + '…';
    box.style.display = 'none';
    try {
      var res = await fetch('/api/carrier?dot=' + encodeURIComponent(d));
      var data = await res.json();
      if (!res.ok || data.error) {
        msg.innerHTML = '<b>FMCSA did not return a carrier for DOT ' + esc(d) + '.</b> ' +
          esc(data.message || 'Check the number and try again.') +
          ' <a href="' + saferLink(d) + '" target="_blank" rel="noopener">Open the SAFER snapshot directly →</a>';
        return;
      }
      msg.innerHTML = '<b style="color:#0f6b5e">Found: ' + esc(data.legalName || 'DOT ' + d) + '</b> — public FMCSA record, as of ' + esc(data.dataAsOf || 'the latest update') + '.';
      var hist = (data.insuranceHistory && data.insuranceHistory.length)
        ? data.insuranceHistory.map(function (r) {
            return esc(r.insurer || '—') + ' • Policy ' + esc(r.policyNumber || '—') + ' • ' + esc(r.form || '—') +
              ' • $' + esc(r.amount != null ? r.amount : '—') + ' • ' + esc(r.status || '—') +
              ' • Effective ' + esc(r.effectiveDate || '—') +
              (r.cancellationDate ? ' • Cancelled ' + esc(r.cancellationDate) : '');
          }).join('<br>')
        : 'No cancelled or replaced filings found in FMCSA open data for this DOT number.';
      box.innerHTML =
        '<h3>' + esc(data.legalName || 'Carrier record') + '</h3>' +
        (data.dba ? 'DBA: ' + esc(data.dba) + '<br>' : '') +
        'USDOT status: <b>' + esc(val(data.usdotStatus)) + '</b> &nbsp;•&nbsp; Authority: <b>' + esc(val(data.authorityStatus)) + '</b><br>' +
        'MC: ' + esc(list(data.mcNumbers)) + ' &nbsp;•&nbsp; Power units: ' + esc(val(data.powerUnits)) + ' &nbsp;•&nbsp; Drivers: ' + esc(val(data.drivers)) + '<br>' +
        'MCS-150 date: ' + esc(val(data.mcs150Date)) + '<br>' +
        'Cargo: ' + esc(list(data.cargo)) + '<br>' +
        'Operation: ' + esc(list(data.operationClassification)) + ' • ' + esc(list(data.carrierOperation)) + '<br>' +
        'Physical address: ' + esc(val(data.physicalAddress)) + '<br>' +
        'Phone: ' + esc(val(data.phone)) + '<br><br>' +
        '<strong>Insurance filing history (FMCSA open data — cancelled and replaced filings only):</strong><br>' + hist + '<br><br>' +
        '<span style="color:#5d6b82">This history does not show the carrier\'s current active filing — active filings are not included in that open dataset. For the complete record, open the Motus public snapshot and turn on "Include History" under Insurance Details.</span><br>' +
        '<a href="' + esc(data.saferUrl || saferLink(d)) + '" target="_blank" rel="noopener">Full SAFER snapshot →</a> &nbsp;•&nbsp; ' +
        '<a href="' + esc(data.motusUrl || ('https://motus.dot.gov/customer/' + encodeURIComponent(d) + '/account')) + '" target="_blank" rel="noopener">Motus public snapshot →</a>';
      box.style.display = 'block';
      try { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
    } catch (err) {
      msg.innerHTML = '<b>The lookup failed just now.</b> FMCSA systems are sometimes slow or down. Try again in a moment, or ' +
        '<a href="' + saferLink(d) + '" target="_blank" rel="noopener">open the SAFER snapshot directly →</a>';
    }
  }

  btn.addEventListener('click', lookup);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); lookup(); } });
})();
