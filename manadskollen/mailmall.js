/* Månadsmailet som html.
   Mejlklienter är inte webbläsare: inga webbtypsnitt, ingen flexbox, ingen
   extern css. Därför tabeller, inline-stilar och 600 pixlars bredd. Playfair
   och Montserrat finns inte i en inkorg, så Georgia och Helvetica får bära
   samma roll — serif för rubriker, sans för brödtext.
   Färgerna är sajtens egna, ur scripts/style.css. */

(function (root) {

  var F = {
    grund:      "#F7F5F1",
    panel:      "#FCF9F4",
    vit:        "#FFFFFF",
    ink:        "#33302C",
    inkMjuk:    "#55514B",
    inkSvag:    "#878787",
    linje:      "#E3DED6",
    linjeStark: "#D6CEC2",
    accent:     "#B06E00",
    accentGraf: "#F6A313",
    accentTon:  "#FCE7BC",
    ned:        "#A2503C",
    serif:      "Georgia, 'Times New Roman', Times, serif",
    sans:       "'Helvetica Neue', Helvetica, Arial, sans-serif"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function tal(v) {
    return typeof v === "number" ? v.toLocaleString("sv-SE") : String(v);
  }

  /* En etikett i versal, samma som eyebrow på sajten. */
  function etikett(text, farg) {
    return '<div style="font-family:' + F.sans + ';font-size:11px;font-weight:700;' +
      'letter-spacing:1.6px;text-transform:uppercase;color:' + (farg || F.accent) +
      ';margin:0 0 10px;">' + esc(text) + '</div>';
  }

  function rubrik(text, storlek) {
    return '<h2 style="margin:0 0 14px;font-family:' + F.serif + ';font-size:' +
      (storlek || 20) + 'px;font-weight:600;line-height:1.25;color:' + F.ink + ';">' +
      esc(text) + '</h2>';
  }

  function stycke(text) {
    return '<p style="margin:0 0 14px;font-family:' + F.sans + ';font-size:15px;' +
      'line-height:1.65;color:' + F.inkMjuk + ';">' + esc(text) + '</p>';
  }

  function avdelare() {
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
      '<tr><td style="border-top:1px solid ' + F.linje + ';font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table>';
  }

  function sektion(innehall, toppLuft) {
    return '<tr><td style="padding:' + (toppLuft == null ? 30 : toppLuft) + 'px 34px 0;">' +
      innehall + '</td></tr>';
  }

  /* --------------------------------------------------------------- talen
     Ett tal per rad: namn, värde, rörelse mot förra månaden, mål. */

  function talrad(t) {
    var upp = t.forra != null && t.varde > t.forra;
    var ner = t.forra != null && t.varde < t.forra;
    var bra = t.riktning === "ner" ? ner : upp;
    var rorelse = "";

    if (t.forra != null) {
      var diff = t.varde - t.forra;
      // Skillnaden mellan två procenttal är procentenheter, inte procent.
      // "+10 %" skulle läsas som tio procents ökning. Därför ingen enhet alls
      // på rörelsen när talet mäts i procent.
      var enhet = t.suffix === "%" ? "" : (t.suffix ? " " + t.suffix : "");
      rorelse = diff === 0
        ? '<span style="color:' + F.inkSvag + ';">oförändrat</span>'
        : '<span style="color:' + (bra ? F.accent : F.ned) + ';">' +
          (diff > 0 ? "+" : "−") + tal(Math.abs(diff)) + enhet +
          ' mot ' + esc(t.forraEtikett || "förra") + '</span>';
    }

    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
      'style="margin:0 0 4px;"><tr>' +
      '<td style="padding:13px 0;border-bottom:1px solid ' + F.linje + ';">' +
        '<div style="font-family:' + F.sans + ';font-size:10px;font-weight:700;letter-spacing:1.4px;' +
          'text-transform:uppercase;color:' + F.inkSvag + ';padding-bottom:5px;">' + esc(t.namn) + '</div>' +
        '<span style="font-family:' + F.serif + ';font-size:27px;font-weight:600;color:' + F.ink + ';">' +
          tal(t.varde) + (t.suffix ? '<span style="font-size:15px;color:' + F.inkSvag + ';"> ' + esc(t.suffix) + '</span>' : '') +
        '</span>' +
        '<span style="font-family:' + F.sans + ';font-size:13px;font-weight:600;padding-left:10px;">' + rorelse + '</span>' +
        (t.mal != null
          ? '<div style="font-family:' + F.sans + ';font-size:12px;color:' + F.inkSvag + ';padding-top:6px;">Ditt mål: ' +
            tal(t.mal) + (t.suffix ? " " + esc(t.suffix) : "") + '</div>'
          : '') +
      '</td></tr></table>';
  }

  /* ----------------------------------------------------------- utveckling
     Stapel byggd av tabellceller, det enda diagram som håller i Outlook. */

  function stapel(rad, hogsta) {
    var andel = hogsta ? Math.max(Math.round((rad.varde / hogsta) * 100), 2) : 2;
    return '<tr>' +
      '<td width="76" style="font-family:' + F.sans + ';font-size:12px;color:' + F.inkSvag +
        ';padding:5px 10px 5px 0;white-space:nowrap;">' + esc(rad.etikett) + '</td>' +
      '<td style="padding:5px 0;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
          '<td width="' + andel + '%" style="background:' + F.accentGraf + ';height:9px;font-size:0;line-height:0;">&nbsp;</td>' +
          '<td style="font-size:0;line-height:0;">&nbsp;</td>' +
        '</tr></table>' +
      '</td>' +
      '<td width="54" align="right" style="font-family:' + F.sans + ';font-size:13px;font-weight:600;color:' +
        F.ink + ';padding:5px 0 5px 10px;white-space:nowrap;">' + tal(rad.varde) + esc(rad.suffix || "") + '</td>' +
      '</tr>';
  }

  function utvecklingsblock(u) {
    // Taket är målet när det finns, annars seriens högsta. Skalar man mot
    // seriens max ser varje litet hack ut som ett ras.
    var hogsta = Math.max.apply(null, u.serie.map(function (r) { return r.varde; })
      .concat(u.mal != null ? [u.mal] : []));
    return '<div style="font-family:' + F.sans + ';font-size:10px;font-weight:700;letter-spacing:1.4px;' +
      'text-transform:uppercase;color:' + F.inkSvag + ';margin:0 0 8px;">' + esc(u.namn) + '</div>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">' +
      u.serie.map(function (r) {
        return stapel({ etikett: r.etikett, varde: r.varde, suffix: u.suffix }, hogsta);
      }).join("") +
      (u.mal != null
        ? '<tr><td colspan="3" style="font-family:' + F.sans + ';font-size:11px;color:' + F.inkSvag +
          ';padding:3px 0 0;">Skalan går till ditt mål, ' + tal(u.mal) + esc(u.suffix || "") + '.</td></tr>'
        : "") +
      '</table>';
  }

  /* ---------------------------------------------------------------- mailet */

  function mailhtml(d) {
    var kropp = "";

    // Vinsten. Alltid först, före siffrorna.
    if (d.vinst || d.vinstkommentar) {
      kropp += sektion(
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr><td style="background:' + F.accentTon + ';border-left:3px solid ' + F.accent + ';padding:18px 20px;">' +
          etikett("Din vinst den här månaden") +
          (d.vinst ? '<p style="margin:0;font-family:' + F.serif + ';font-size:17px;line-height:1.5;color:' +
            F.ink + ';">' + esc(d.vinst) + '</p>' : "") +
          (d.vinstkommentar ? '<p style="margin:12px 0 0;font-family:' + F.sans + ';font-size:14px;' +
            'line-height:1.6;color:' + F.inkMjuk + ';">' + esc(d.vinstkommentar) + '</p>' : "") +
        '</td></tr></table>', 28);
    }

    // Talen
    if (d.tal && d.tal.length) {
      kropp += sektion(rubrik(esc(d.manad).replace(/^./, function (c) { return c.toUpperCase(); }) + " i siffror") +
        d.tal.map(talrad).join(""));
    }

    // Brödtexten står på egna ben. Finns inga siffror ska den ändå med.
    if (d.brodtext && d.brodtext.length) {
      kropp += sektion(d.brodtext.map(stycke).join(""), d.tal && d.tal.length ? 18 : 28);
    }

    // Råden ur mötena
    if (d.rad && d.rad.length) {
      kropp += sektion(avdelare(), 26);
      kropp += sektion(rubrik("Det vi sagt sedan sist") +
        d.rad.map(function (r) {
          return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
            '<tr><td width="8" valign="top" style="padding:7px 12px 0 0;">' +
              '<div style="width:7px;height:7px;background:' + F.accentGraf + ';font-size:0;line-height:0;">&nbsp;</div></td>' +
            '<td style="padding:0 0 14px;">' +
              (r.datum ? '<span style="font-family:' + F.sans + ';font-size:12px;font-weight:600;color:' +
                F.inkSvag + ';">' + esc(r.datum) + '</span><br>' : "") +
              '<span style="font-family:' + F.sans + ';font-size:15px;line-height:1.6;color:' + F.inkMjuk + ';">' +
                esc(r.text) + '</span>' +
            '</td></tr></table>';
        }).join(""), 22);
    }

    // Utvecklingen
    if (d.utveckling && d.utveckling.length) {
      kropp += sektion(avdelare(), 26);
      kropp += sektion(rubrik("Din utveckling") +
        d.utveckling.map(utvecklingsblock).join("") +
        (d.utvecklingstext ? stycke(d.utvecklingstext) : ""), 22);
    }

    // Materialet
    if (d.material) {
      kropp += sektion(
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr><td style="background:' + F.panel + ';border:1px solid ' + F.linje + ';padding:20px 22px;">' +
          etikett("Det här skickar jag med dig") +
          '<div style="font-family:' + F.serif + ';font-size:17px;font-weight:600;color:' + F.ink +
            ';padding-bottom:7px;">' + esc(d.material.rubrik) + '</div>' +
          '<p style="margin:0;font-family:' + F.sans + ';font-size:14px;line-height:1.6;color:' +
            F.inkMjuk + ';">' + esc(d.material.text) + '</p>' +
          (d.material.lank
            ? '<p style="margin:14px 0 0;"><a href="' + esc(d.material.lank) + '" style="font-family:' + F.sans +
              ';font-size:14px;font-weight:600;color:' + F.accent + ';">Läs den här</a></p>'
            : "") +
        '</td></tr></table>', 26);
    }

    // Nästa steg
    if (d.nasta) {
      kropp += sektion(avdelare(), 26);
      kropp += sektion(rubrik("Till nästa gång", 18) + stycke(d.nasta), 22);
    }

    kropp += sektion('<p style="margin:0;font-family:' + F.serif + ';font-size:17px;color:' + F.ink + ';">' +
      esc(d.avsandare || "Maria") + '</p>', 22);

    return '<!doctype html>\n<html lang="sv"><head>' +
      '<meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<meta name="color-scheme" content="light">' +
      '<meta name="supported-color-schemes" content="light">' +
      '<title>' + esc(d.amne || "Din månad") + '</title>' +
      '<style>@media (max-width:620px){.ram{width:100%!important}.luft{padding-left:20px!important;padding-right:20px!important}}</style>' +
      '</head>' +
      '<body style="margin:0;padding:0;background:' + F.grund + ';">' +
      // Förhandsraden i inkorgslistan
      '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' +
        esc(d.forhandsrad || (d.vinst || "Din månad i siffror")) +
      '</div>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
        'style="background:' + F.grund + ';"><tr><td align="center" style="padding:28px 12px 40px;">' +
      '<table role="presentation" class="ram" width="600" cellpadding="0" cellspacing="0" border="0" ' +
        'style="width:600px;max-width:600px;background:' + F.vit + ';border:1px solid ' + F.linje + ';">' +

      // Sidhuvud
      '<tr><td class="luft" style="padding:34px 34px 0;">' +
        etikett("Åberg & Co · Månadskollen") +
        '<h1 style="margin:0 0 6px;font-family:' + F.serif + ';font-size:30px;font-weight:700;' +
          'line-height:1.1;color:' + F.ink + ';">' + esc(d.rubrik || ("Din månad — " + d.manad)) + '</h1>' +
        '<p style="margin:0;font-family:' + F.sans + ';font-size:15px;line-height:1.6;color:' + F.inkMjuk + ';">Hej ' +
          esc(d.namn) + ',</p>' +
      '</td></tr>' +

      kropp +

      // Sidfot
      '<tr><td class="luft" style="padding:30px 34px 30px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr><td style="border-top:1px solid ' + F.linje + ';padding-top:18px;font-family:' + F.sans +
          ';font-size:12px;line-height:1.7;color:' + F.inkSvag + ';">' +
          'Åberg &amp; Co · Ledarskap, utveckling, coaching<br>' +
          'Du får brevet för att du är coachkund hos mig. Svara på det, så läser jag.' +
        '</td></tr></table>' +
      '</td></tr>' +

      '</table></td></tr></table></body></html>';
  }

  /* Ren text till samma innehåll, som alternativ för den som blockar html. */
  function mailtext(d) {
    var r = ["Hej " + d.namn + ",", ""];
    if (d.vinst) r.push(d.vinst, "");
    if (d.vinstkommentar) r.push(d.vinstkommentar, "");
    if (d.tal && d.tal.length) {
      r.push((d.manad || "Månaden").toUpperCase() + " I SIFFROR", "");
      d.tal.forEach(function (t) {
        var s = "- " + t.namn + " " + tal(t.varde) + (t.suffix ? " " + t.suffix : "");
        if (t.forra != null) s += ", från " + tal(t.forra) + (t.suffix ? " " + t.suffix : "") +
          " i " + (t.forraEtikett || "förra månaden");
        if (t.mal != null) s += ". Mål " + tal(t.mal) + (t.suffix ? " " + t.suffix : "");
        r.push(s);
      });
      r.push("");
    }
    (d.brodtext || []).forEach(function (p) { r.push(p, ""); });
    if (d.rad && d.rad.length) {
      r.push("DET VI SAGT SEDAN SIST", "");
      d.rad.forEach(function (x) { r.push("- " + (x.datum ? x.datum + ": " : "") + x.text); });
      r.push("");
    }
    if (d.utvecklingstext) r.push("DIN UTVECKLING", "", d.utvecklingstext, "");
    if (d.material) {
      r.push("DET HÄR SKICKAR JAG MED DIG", "", d.material.rubrik, d.material.text);
      if (d.material.lank) r.push(d.material.lank);
      r.push("");
    }
    if (d.nasta) r.push("TILL NÄSTA GÅNG", "", d.nasta, "");
    r.push(d.avsandare || "Maria");
    return r.join("\n");
  }

  root.MK_MAIL = { mailhtml: mailhtml, mailtext: mailtext, farger: F };

})(typeof window !== "undefined" ? window : globalThis);
