// ─────────────────────────────────────────────────────────────
//  CLASS SETTINGS  (the only file you need to edit)
//
//  supabaseUrl / supabaseKey:
//      From your free Supabase project (Project Settings > API).
//      Paste the Project URL and the "anon" or "publishable" key.
//      Leave both empty to run in DEMO mode, where scores are shared
//      only between browser tabs on the same computer.
//  endpoint:
//      Optional. Only used if you set up the Google Apps Script
//      version instead (see apps-script/Code.gs). Leave empty otherwise.
//  defaultSession:
//      Label used when the player link has no ?s= code. You can change
//      the session code on the host page, and the QR code updates.
//  shortLink / shortLinkSession:
//      A short web address (for example from TinyURL) to show under the QR
//      code. It must point to play.html with the session code in
//      shortLinkSession. It is only shown while the host page uses that code.
// ─────────────────────────────────────────────────────────────
window.HEIST_CONFIG = {
  supabaseUrl: '',
  supabaseKey: '',
  endpoint: 'https://script.google.com/macros/s/AKfycbyMUgnsCGyhuiXDd_KGB5BIz9K9WiXLv793j9rFxzRWFpcsfV8OiB4LDbXCg2XZD91pYw/exec',
  defaultSession: 'EXAM2',
  shortLink: 'https://tinyurl.com/coon2301',
  shortLinkSession: 'EXAM2'
};
