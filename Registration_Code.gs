// PUBLIC registration-only web app. Never returns student names.
const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
function doPost(e) {
  const id = String(e.parameter.id || '');
  const name = String(e.parameter.name || '').trim();
  if (!/^[a-f0-9-]{32,36}$/i.test(id) || !name || name.length > 60 || /[\x00-\x1f\x7f]/.test(name)) return result('invalid');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName('Registrations') || ss.insertSheet('Registrations');
    if (!sh.getLastRow()) sh.appendRow(['Registration ID','Student name']);
    const n = sh.getLastRow();
    if (n > 1 && sh.getRange(2,1,n-1,1).createTextFinder(id).matchEntireCell(true).findNext()) return result('ok');
    // Prefix apostrophe so user-supplied names cannot become spreadsheet formulas.
    sh.appendRow([id, "'" + name]);
    SpreadsheetApp.flush();
    return result('ok');
  } finally { lock.releaseLock(); }
}
function doGet(){return result('Registration endpoint');}
function result(s){return ContentService.createTextOutput(s);}
