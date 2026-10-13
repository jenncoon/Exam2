/* Shared sync layer for the player page and the host page.
   remote mode: talks to a Google Apps Script web app (config.js endpoint)
   local mode : localStorage + BroadcastChannel (demo on one computer)   */
(function () {
  'use strict';
  var cfg = window.HEIST_CONFIG || {};
  var endpoint = String(cfg.endpoint || '').trim();
  var sbUrl = String(cfg.supabaseUrl || '').trim().replace(/\/+$/, '');
  var sbKey = String(cfg.supabaseKey || '').trim();
  var supa = !!(sbUrl && sbKey);
  var mode = (supa || endpoint) ? 'remote' : 'local';
  var sbHeaders = { apikey: sbKey, 'Content-Type': 'application/json' };

  function toRow(r) {
    return { key: r.key, session: r.session, team: r.team, members: r.members || [], device: r.device,
      run: r.run, pts: r.pts, max: r.max, qdone: r.qdone, stations: r.stations, first_try: r.firstTry,
      status: r.status, started_at: r.startedAt || 0, updated_at: r.updatedAt || 0,
      finished_at: r.finishedAt || 0, answers: r.answers || [] };
  }
  function fromRow(x) {
    return { key: x.key, session: x.session, team: x.team, members: x.members || [], device: x.device,
      run: x.run, pts: x.pts, max: x.max, qdone: x.qdone, stations: x.stations, firstTry: x.first_try,
      status: x.status, startedAt: Number(x.started_at) || 0, updatedAt: Number(x.updated_at) || 0,
      finishedAt: Number(x.finished_at) || 0, answers: x.answers || [] };
  }
  var LS = 'heist:rec:';
  var bc = null;
  try { bc = new BroadcastChannel('heist-board'); } catch (e) {}

  function push(rec) {
    if (mode === 'local') {
      try {
        var k = LS + rec.session;
        var all = JSON.parse(localStorage.getItem(k) || '{}');
        all[rec.key] = rec;
        localStorage.setItem(k, JSON.stringify(all));
        if (bc) bc.postMessage({ s: rec.session });
        return Promise.resolve(true);
      } catch (e) { return Promise.resolve(false); }
    }
    if (supa) {
      var h = { apikey: sbKey, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' };
      return fetch(sbUrl + '/rest/v1/scores?on_conflict=key', { method: 'POST', headers: h, body: JSON.stringify(toRow(rec)) })
        .then(function (r) { return r.ok; }).catch(function () { return false; });
    }
    // text/plain keeps this a "simple" request (no CORS preflight), which Apps Script requires.
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'upsert', record: rec })
    }).then(function (r) { return r.json(); })
      .then(function (j) { return !!(j && j.ok); })
      .catch(function () { return false; });
  }

  function list(session) {
    if (mode === 'local') {
      try {
        var all = JSON.parse(localStorage.getItem(LS + session) || '{}');
        return Promise.resolve(Object.keys(all).map(function (k) { return all[k]; }));
      } catch (e) { return Promise.resolve([]); }
    }
    if (supa) {
      return fetch(sbUrl + '/rest/v1/scores?select=*&session=eq.' + encodeURIComponent(session), { headers: { apikey: sbKey } })
        .then(function (r) { if (!r.ok) throw new Error('bad response'); return r.json(); })
        .then(function (rows) { return rows.map(fromRow); });
    }
    var url = endpoint + (endpoint.indexOf('?') < 0 ? '?' : '&') +
      'action=list&session=' + encodeURIComponent(session) + '&t=' + Date.now();
    return fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) throw new Error((j && j.error) || 'bad response');
      return j.records || [];
    });
  }

  function onLocalChange(fn) {
    if (bc) bc.onmessage = function (m) { fn(m.data && m.data.s); };
    window.addEventListener('storage', function (e) {
      if (e.key && e.key.indexOf(LS) === 0) fn(e.key.slice(LS.length));
    });
  }

  window.HeistSync = { mode: mode, push: push, list: list, onLocalChange: onLocalChange };
})();
