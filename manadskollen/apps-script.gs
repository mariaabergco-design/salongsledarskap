/**
 * Månadskollen — lagringen.
 *
 * Ligger som ett Apps Script i Google-kalkylarket "Månadskollen".
 * Två flikar: Kunder och Svar. Kör installera() en gång, sedan
 * Distribuera som webbapp. Hela gången står i SA-HAR-INSTALLERAR-DU.md.
 */

var KUNDKOLUMNER = ["kod", "namn", "salong", "mejl", "sokord", "aktiv",
                    "mal_ombokning", "mal_produkt", "mal_belaggning",
                    "mal_timmar_stol", "mal_lediga_dagar"];

var SVARKOLUMNER = ["tidpunkt", "kod", "period",
                    "omsattning", "belaggning", "ombokning", "produkt",
                    "lon", "nya_kunder", "nya_varifran", "mal_antal", "mal_av",
                    "ledarskap", "leverans", "timmar_stol", "lediga_dagar", "energi",
                    "atagande_text", "atagande_status",
                    "vinst", "nasta_omrade", "nasta_text",
                    // Varifrån raden kommer. Formuläret sätter alltid "formular".
                    // Rader du skriver in själv märker du "motesanteckning" eller
                    // "uppskattning", så att härledda tal aldrig läses som kundens egna svar.
                    "kalla"];

/** Kör en gång för hand. Skapar flikarna och lägger in rubrikraderna. */
function installera() {
  var bok = SpreadsheetApp.getActiveSpreadsheet();
  [["Kunder", KUNDKOLUMNER], ["Svar", SVARKOLUMNER]].forEach(function (par) {
    var flik = bok.getSheetByName(par[0]) || bok.insertSheet(par[0]);
    if (flik.getLastRow() === 0) {
      flik.appendRow(par[1]);
      flik.getRange(1, 1, 1, par[1].length).setFontWeight("bold");
      flik.setFrozenRows(1);
    }
  });
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty("COACHNYCKEL")) {
    p.setProperty("COACHNYCKEL", Utilities.getUuid());
  }
  SpreadsheetApp.getUi().alert(
    "Klart.\n\nDin coachnyckel är:\n" + p.getProperty("COACHNYCKEL") +
    "\n\nSpara den. Du klistrar in den i coachvyn första gången du öppnar den.");
}

/** Visar coachnyckeln igen om du tappat bort den. */
function visaCoachnyckel() {
  SpreadsheetApp.getUi().alert(PropertiesService.getScriptProperties().getProperty("COACHNYCKEL"));
}

/* ------------------------------------------------------------------ hjälp */

function flik(namn) {
  var f = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(namn);
  if (!f) throw new Error("Fliken " + namn + " saknas. Kör installera().");
  return f;
}

function lasFlik(namn, kolumner) {
  var f = flik(namn);
  if (f.getLastRow() < 2) return [];
  var v = f.getRange(2, 1, f.getLastRow() - 1, kolumner.length).getValues();
  return v.map(function (rad) {
    var o = {};
    kolumner.forEach(function (k, i) { o[k] = rad[i]; });
    return o;
  }).filter(function (o) { return String(o.kod).trim() !== ""; });
}

function hittaKund(kod) {
  var k = String(kod || "").trim();
  if (!k) return null;
  var alla = lasFlik("Kunder", KUNDKOLUMNER);
  for (var i = 0; i < alla.length; i++) {
    if (String(alla[i].kod).trim() === k) return alla[i];
  }
  return null;
}

function kundUt(rad) {
  return {
    kod: String(rad.kod).trim(),
    namn: rad.namn,
    salong: rad.salong,
    mal: {
      ombokning: Number(rad.mal_ombokning) || null,
      produkt: Number(rad.mal_produkt) || null,
      belaggning: Number(rad.mal_belaggning) || null,
      timmar_stol: Number(rad.mal_timmar_stol) || null,
      lediga_dagar: Number(rad.mal_lediga_dagar) || null
    }
  };
}

function svarFor(kod) {
  return lasFlik("Svar", SVARKOLUMNER)
    .filter(function (r) { return String(r.kod).trim() === String(kod).trim(); })
    .map(stada)
    .sort(function (a, b) { return a.period < b.period ? -1 : 1; });
}

function stada(r) {
  var ut = {};
  SVARKOLUMNER.forEach(function (k) {
    var v = r[k];
    if (k === "tidpunkt" && v instanceof Date) v = v.toISOString();
    if (k === "period" && v instanceof Date) {
      v = v.getFullYear() + "-" + ("0" + (v.getMonth() + 1)).slice(-2);
    }
    ut[k] = v === "" ? null : v;
  });
  return ut;
}

function svara(objekt) {
  return ContentService.createTextOutput(JSON.stringify(objekt))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ läsa */

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};

    if (p.alla === "1") {
      var nyckel = PropertiesService.getScriptProperties().getProperty("COACHNYCKEL");
      if (!nyckel || p.nyckel !== nyckel) return svara({ ok: false, fel: "nyckel" });
      return svara({
        ok: true,
        kunder: lasFlik("Kunder", KUNDKOLUMNER)
          .filter(function (k) { return String(k.aktiv).toLowerCase() !== "nej"; })
          .map(function (k) {
            var u = kundUt(k);
            u.mejl = k.mejl;
            u.sokord = String(k.sokord || "").split(/\s+/).filter(String);
            return u;
          }),
        svar: lasFlik("Svar", SVARKOLUMNER).map(stada)
      });
    }

    var kund = hittaKund(p.k);
    if (!kund) return svara({ ok: false, fel: "okand kod" });
    return svara({ ok: true, kund: kundUt(kund), svar: svarFor(kund.kod) });

  } catch (fel) {
    return svara({ ok: false, fel: String(fel) });
  }
}

/* ---------------------------------------------------------------- skriva */

function doPost(e) {
  var las = LockService.getScriptLock();
  try {
    las.waitLock(20000);

    var data = JSON.parse(e.postData.contents);
    var kund = hittaKund(data.kod);
    if (!kund) return svara({ ok: false, fel: "okand kod" });

    var period = String(data.period || "");
    if (!/^\d{4}-\d{2}$/.test(period)) return svara({ ok: false, fel: "period" });

    var rad = SVARKOLUMNER.map(function (k) {
      if (k === "tidpunkt") return new Date();
      if (k === "kod") return String(kund.kod).trim();
      if (k === "period") return period;
      // Källan sätts av servern, aldrig av det som skickas in.
      if (k === "kalla") return "formular";
      var v = data[k];
      return (v === undefined || v === null) ? "" : v;
    });

    // Ett svar per kund och månad. Ett nytt svar ersätter det gamla.
    var f = flik("Svar");
    var befintlig = 0;
    if (f.getLastRow() > 1) {
      var nycklar = f.getRange(2, 2, f.getLastRow() - 1, 2).getValues();
      for (var i = 0; i < nycklar.length; i++) {
        var pv = nycklar[i][1];
        if (pv instanceof Date) {
          pv = pv.getFullYear() + "-" + ("0" + (pv.getMonth() + 1)).slice(-2);
        }
        if (String(nycklar[i][0]).trim() === String(kund.kod).trim() && String(pv) === period) {
          befintlig = i + 2;
        }
      }
    }

    if (befintlig) {
      f.getRange(befintlig, 1, 1, rad.length).setValues([rad]);
    } else {
      f.appendRow(rad);
    }

    return svara({ ok: true, period: period });

  } catch (fel) {
    return svara({ ok: false, fel: String(fel) });
  } finally {
    try { las.releaseLock(); } catch (ignorera) {}
  }
}
