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

/* ---------------------------------------------------------- startinnehåll
   Kunderna och baslinjen, inlagda här så att installera() fyller båda
   flikarna åt dig. Du behöver alltså inte klistra in några csv-filer.
   Ändrar du något efteråt gör du det i kalkylarket, inte här — installera()
   rör aldrig rader som redan finns. */

var STARTKUNDER = [
    ["sara-9678db", "Sara", "Hårkroppsverkstan, Sunne", "", "Sara Hårkroppsverkstan", "ja", "40", "30", "75", "25", "8"],
    ["maja-42a3df", "Maja", "Magasinet", "", "Maja Magasinet", "ja", "40", "15", "75", "25", "8"],
    ["verdi-1ed2df", "Verdi", "Zodiac Hair Team, Örebro", "zodiakhairteam@gmail.com", "Verdi Zodiac Zodiak Saga", "ja", "40", "15", "75", "25", "8"],
    ["ebba-8f658f", "Ebba", "Nettans", "", "Nettans Linda", "ja", "40", "15", "75", "25", "8"],
    ["rebecca-2dfac5", "Rebecca Josefsson", "Rejoys", "rebecca@rejoys.se", "Rebecca Josefsson Rejoys", "ja", "40", "15", "75", "25", "8"],
    ["christina-8632ad", "Christina Olsson Jerrlinger", "", "", "Jerrlinger Christina Kristina", "ja", "40", "15", "80", "25", "8"],
    ["elin-4d1e67", "Elin Eliasson Holm", "", "", "Eliasson", "ja", "40", "15", "75", "25", "8"],
    ["matilda-ae857a", "Matilda Thegerström", "Örebro och Linköping", "", "Thegerström", "ja", "40", "15", "75", "25", "8"],
    ["test-maria", "Maria (test)", "Testrad, ta bort när du är klar", "mariaabergco@gmail.com", "", "ja", "40", "15", "75", "25", "8"]
];

var STARTSVAR = [
    ["2026-08-25", "sara-9678db", "2026-07", "", "", "39", "4", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "motesanteckning"],
    ["2026-08-25", "sara-9678db", "2026-08", "", "", "34", "14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "motesanteckning"],
    ["2026-06-08", "rebecca-2dfac5", "2026-05", "", "79", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "motesanteckning"],
    ["2026-06-09", "verdi-1ed2df", "2026-06", "", "", "10", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "uppskattning"]
];

/** Kör en gång för hand. Skapar flikarna, rubrikerna, kunderna och baslinjen. */
function installera() {
  var bok = SpreadsheetApp.getActiveSpreadsheet();
  var lagt = { Kunder: 0, Svar: 0 };

  [["Kunder", KUNDKOLUMNER, STARTKUNDER], ["Svar", SVARKOLUMNER, STARTSVAR]].forEach(function (par) {
    var namn = par[0], kolumner = par[1], start = par[2];
    var flik = bok.getSheetByName(namn) || bok.insertSheet(namn);

    if (flik.getLastRow() === 0) {
      flik.appendRow(kolumner);
      flik.getRange(1, 1, 1, kolumner.length).setFontWeight("bold");
      flik.setFrozenRows(1);
    }

    // Fyll bara på en tom flik. Kör du installera() igen rörs inget som finns.
    if (flik.getLastRow() === 1 && start.length) {
      flik.getRange(2, 1, start.length, kolumner.length).setValues(start);
      lagt[namn] = start.length;
    }
    flik.autoResizeColumns(1, Math.min(kolumner.length, 6));
  });

  // Perioderna ska vara text, annars gör Google om 2026-07 till ett datum.
  var svarflik = bok.getSheetByName("Svar");
  svarflik.getRange(2, 3, Math.max(svarflik.getMaxRows() - 1, 1), 1).setNumberFormat("@");
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty("COACHNYCKEL")) {
    p.setProperty("COACHNYCKEL", Utilities.getUuid());
  }
  SpreadsheetApp.getUi().alert(
    "Klart.\n\n" +
    lagt.Kunder + " kunder och " + lagt.Svar + " baslinjerader är inlagda.\n\n" +
    "Din coachnyckel är:\n" + p.getProperty("COACHNYCKEL") +
    "\n\nSpara den. Du klistrar in den i coachvyn första gången du öppnar den.");
}

/** Klistra in din Resend-nyckel. Kör funktionen och klistra in i rutan. */
function sattResendnyckel() {
  var ui = SpreadsheetApp.getUi();
  var svar = ui.prompt("Resend", "Klistra in din API-nyckel (börjar med re_):", ui.ButtonSet.OK_CANCEL);
  if (svar.getSelectedButton() !== ui.Button.OK) return;
  var nyckel = svar.getResponseText().trim();
  if (nyckel.indexOf("re_") !== 0) { ui.alert("Det där ser inte ut som en Resend-nyckel."); return; }
  PropertiesService.getScriptProperties().setProperty("RESENDNYCKEL", nyckel);
  ui.alert("Sparad. Nyckeln ligger i skriptets egna inställningar, inte i kalkylarket.");
}

/**
 * Avsändaradress. Innan du verifierat abergco.se hos Resend måste den vara
 * onboarding@resend.dev, och då går mail bara till din egen kontoadress —
 * vilket räcker för att testa. När domänen är verifierad kör du den här och
 * skriver in: Maria Åberg <maria@abergco.se>
 */
function sattAvsandare() {
  var ui = SpreadsheetApp.getUi();
  var svar = ui.prompt("Avsändare", 'Skriv "Namn <adress>":', ui.ButtonSet.OK_CANCEL);
  if (svar.getSelectedButton() !== ui.Button.OK) return;
  PropertiesService.getScriptProperties().setProperty("AVSANDARE", svar.getResponseText().trim());
  ui.alert("Sparad.");
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

/* ------------------------------------------------------------------ mail
   Skickar via Resend. Kräver coachnyckeln — formuläret kan alltså aldrig
   få något skickat, bara du från coachvyn. Texten kommer alltid från det du
   har framför dig på skärmen, aldrig från något som genereras här. */

function skickaMail(data) {
  var p = PropertiesService.getScriptProperties();
  var nyckel = p.getProperty("RESENDNYCKEL");
  if (!nyckel) return { ok: false, fel: "Ingen Resend-nyckel. Kör sattResendnyckel() i Apps Script." };

  var till = String(data.till || "").trim();
  var amne = String(data.amne || "").trim();
  var text = String(data.text || "").trim();
  if (!till || till.indexOf("@") < 1) return { ok: false, fel: "Mejladressen saknas eller ser fel ut." };
  if (!amne) return { ok: false, fel: "Ämnesraden är tom." };
  if (!text) return { ok: false, fel: "Brödtexten är tom." };

  var svar = UrlFetchApp.fetch("https://api.resend.com/emails", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + nyckel },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      from: p.getProperty("AVSANDARE") || "Månadskollen <onboarding@resend.dev>",
      to: [till],
      reply_to: "maria@abergco.se",
      subject: amne,
      text: text
    })
  });

  var kod = svar.getResponseCode();
  var kropp = svar.getContentText();
  if (kod >= 200 && kod < 300) {
    return { ok: true, id: (JSON.parse(kropp) || {}).id };
  }
  // Resends vanligaste nej, översatt
  if (kropp.indexOf("domain is not verified") > -1 || kropp.indexOf("testing emails") > -1) {
    return { ok: false, fel: "Resend släpper bara igenom mail till din egen kontoadress tills " +
                             "abergco.se är verifierad. Testa mot din egen adress först." };
  }
  return { ok: false, fel: "Resend svarade " + kod + ": " + kropp.slice(0, 300) };
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

    if (data.ata === "skicka") {
      var coach = PropertiesService.getScriptProperties().getProperty("COACHNYCKEL");
      if (!coach || data.nyckel !== coach) return svara({ ok: false, fel: "nyckel" });
      return svara(skickaMail(data));
    }

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
