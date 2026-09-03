/* Månadskollen — frågorna, nyckeltalen och läsningen av dem.
   Delas av formular.html och coachvy.html. Ändrar du en frågas text börjar
   tidsserien om. Lägg hellre till en elfte fråga än att skriva om en gammal. */

window.MK = (function () {

  /* ---------------------------------------------------------------- frågor */

  const FRAGOR = [
    {
      nr: 1, omrade: "Ekonomi, leverans och försäljning",
      text: "Siffrorna för månaden.",
      hjalp: "Hämta dem ur samma rapport i bokningssystemet varje gång. Det är viktigare att du hämtar dem likadant än att de är på decimalen rätt.",
      typ: "tal",
      falt: [
        { id: "omsattning", etikett: "Omsättning", suffix: "kr", kalla: "Ex moms", min: 0, max: 100000000 },
        { id: "belaggning", etikett: "Beläggningsgrad", suffix: "%", kalla: "Hela teamet", min: 0, max: 100 },
        { id: "ombokning", etikett: "Ombokningsgrad", suffix: "%", kalla: "Hela teamet", min: 0, max: 100 },
        { id: "produkt", etikett: "Produktförsäljning", suffix: "%", kalla: "Andel av omsättningen", min: 0, max: 100 }
      ]
    },
    {
      nr: 2, omrade: "Ekonomi",
      text: "Tog du ut hela din avtalade lön ur salongen den här månaden?",
      hjalp: "Frågan gäller din egen lön, inte salongens resultat.",
      typ: "val", id: "lon",
      val: [
        { v: "ja_over", t: "Ja, och något blev över" },
        { v: "ja", t: "Ja" },
        { v: "nej", t: "Nej" }
      ]
    },
    {
      nr: 3, omrade: "Marknadsföring",
      text: "Hur många nya kunder kom in, och varifrån kom de flesta?",
      hjalp: "Ungefärligt antal räcker. Svara ”vet inte” om du inte vet — det svaret säger något det också.",
      typ: "tal_och_val",
      falt: [{ id: "nya_kunder", etikett: "Nya kunder", suffix: "st", kalla: "Ungefär", min: 0, max: 10000 }],
      id: "nya_varifran",
      val: [
        { v: "rekommendation", t: "Rekommendation" },
        { v: "sociala", t: "Sociala medier" },
        { v: "forbi", t: "Gick förbi" },
        { v: "annons", t: "Annonsering" },
        { v: "vet_ej", t: "Vet inte" }
      ]
    },
    {
      nr: 4, omrade: "Försäljning",
      text: "Hur många i teamet nådde ert ombokningsmål?",
      hjalp: "Räkna alla som tar kunder, dig själv inräknad. Snittet döljer spridningen — det här visar den.",
      typ: "av",
      falt: [
        { id: "mal_antal", etikett: "Nådde målet", suffix: "st", kalla: "", min: 0, max: 200 },
        { id: "mal_av", etikett: "Av totalt", suffix: "st", kalla: "Alla som tar kunder", min: 1, max: 200 }
      ]
    },
    {
      nr: 5, omrade: "Ledarskap",
      text: "Teamet löste saker själva utan att fråga mig.",
      hjalp: "0 betyder att allt gick genom dig. 10 betyder att de klarade månaden utan dig.",
      typ: "skala", id: "ledarskap",
      lag: "Allt gick genom mig", hog: "De klarade sig själva"
    },
    {
      nr: 6, omrade: "Leverans",
      text: "Kunderna fick samma upplevelse oavsett vem som tog dem.",
      hjalp: "Tänk på hela kedjan: välkomnandet, konsultationen, hantverket och avslutet.",
      typ: "skala", id: "leverans",
      lag: "Helt beroende av vem", hog: "Lika varje gång"
    },
    {
      nr: 7, omrade: "Tid",
      text: "Din tid den här månaden.",
      hjalp: "Bakom stolen menas tid med kund. Ledig dag betyder en hel dag utan salongen, inte en dag du var hemma och gjorde schemat.",
      typ: "tal",
      falt: [
        { id: "timmar_stol", etikett: "Timmar bakom stolen", suffix: "h", kalla: "En normal vecka", min: 0, max: 90 },
        { id: "lediga_dagar", etikett: "Hela lediga dagar", suffix: "st", kalla: "Under månaden", min: 0, max: 31 }
      ]
    },
    {
      nr: 8, omrade: "Hälsa",
      text: "Hur var din energi den här månaden?",
      hjalp: "Svara som det faktiskt var, inte som du vill att det ska bli.",
      typ: "skala", id: "energi",
      lag: "Tom", hog: "Full"
    },
    {
      nr: 9, omrade: "Uppföljning",
      text: "Vad kom vi överens om att du skulle göra sedan sist — och blev det gjort?",
      hjalp: "",
      typ: "text_och_val", id: "atagande_status", textid: "atagande_text",
      platshallare: "Skriv med egna ord vad ni bestämde.",
      val: [
        { v: "gjort", t: "Gjort" },
        { v: "paborjat", t: "Påbörjat" },
        { v: "inte_gjort", t: "Inte gjort" }
      ]
    },
    {
      nr: 10, omrade: "Riktning",
      text: "Månadens vinst — och vad vi tar först nästa gång.",
      hjalp: "Vinsten går rakt in i din statusuppdatering. Skriv den även om den är liten.",
      typ: "avslut",
      textid: "vinst",
      platshallare: "Vad gick bra den här månaden som du vill att jag ska veta?",
      id: "nasta_omrade",
      val: [
        { v: "forsaljning", t: "Försäljning" },
        { v: "marknadsforing", t: "Marknadsföring" },
        { v: "ledarskap", t: "Ledarskap" },
        { v: "leverans", t: "Leverans" },
        { v: "ekonomi", t: "Ekonomi" },
        { v: "halsa", t: "Hälsa" },
        { v: "tid", t: "Tid" }
      ],
      textid2: "nasta_text",
      platshallare2: "Vad vill du att vi tar först nästa gång?"
    }
  ];

  /* ------------------------------------------------------------ nyckeltal */

  const TAL = [
    { id: "ombokning", namn: "Ombokningsgrad", suffix: "%", bra: "upp", mal: "ombokning" },
    { id: "produkt", namn: "Produktförsäljning", suffix: "%", bra: "upp", mal: "produkt" },
    { id: "belaggning", namn: "Beläggningsgrad", suffix: "%", bra: "upp", mal: "belaggning" },
    { id: "omsattning", namn: "Omsättning", suffix: "kr", bra: "upp", mal: null },
    { id: "timmar_stol", namn: "Timmar bakom stolen", suffix: "h", bra: "ner", mal: "timmar_stol" },
    { id: "lediga_dagar", namn: "Lediga dagar", suffix: "st", bra: "upp", mal: "lediga_dagar" },
    { id: "ledarskap", namn: "Teamet klarar sig själva", suffix: "/10", bra: "upp", mal: null },
    { id: "leverans", namn: "Jämn leverans", suffix: "/10", bra: "upp", mal: null },
    { id: "energi", namn: "Energi", suffix: "/10", bra: "upp", mal: null }
  ];

  const MANADER = ["januari", "februari", "mars", "april", "maj", "juni",
                   "juli", "augusti", "september", "oktober", "november", "december"];

  function manadsnamn(p) {
    if (!p) return "";
    const d = p.split("-");
    return MANADER[parseInt(d[1], 10) - 1] + " " + d[0];
  }

  function forraManaden(idag) {
    const d = idag || new Date();
    const ar = d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear();
    const m = d.getMonth() === 0 ? 12 : d.getMonth();
    return ar + "-" + String(m).padStart(2, "0");
  }

  function tal(v) {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return isFinite(n) ? n : null;
  }

  function visa(v, suffix) {
    if (v === null) return "–";
    if (suffix === "kr") return Math.round(v).toLocaleString("sv-SE") + " kr";
    if (suffix === "/10") return v + " /10";
    return v.toLocaleString("sv-SE") + (suffix ? " " + suffix : "");
  }


  /* Liten kurva över de månader som finns. Ritas i ett 100x42-rutnät som
     sträcks ut av svg:ns preserveAspectRatio, därför non-scaling-stroke. */

  function sparkline(varden) {
    const v = varden.filter(x => x !== null && x !== undefined);
    if (v.length < 2) return "";
    const min = Math.min.apply(null, v), max = Math.max.apply(null, v);
    const spann = (max - min) || 1;
    const n = varden.length;
    const punkter = [];
    varden.forEach(function (x, i) {
      if (x === null || x === undefined) return;
      const px = n === 1 ? 50 : (i / (n - 1)) * 100;
      const py = 38 - ((x - min) / spann) * 34;
      punkter.push([px, py]);
    });
    const d = punkter.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const sist = punkter[punkter.length - 1];
    return '<svg viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + d + '" fill="none" stroke="var(--accent-graf)" stroke-width="1.6" ' +
      'vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"></path>' +
      '<circle cx="' + sist[0].toFixed(1) + '" cy="' + sist[1].toFixed(1) + '" r="2.4" ' +
      'fill="var(--accent)" vector-effect="non-scaling-stroke"></circle></svg>';
  }

  /* ---------------------------------------------------------------- läsning
     Paren ur planen. Ett enskilt svar säger nästan ingenting; det är när två
     mått går isär som det finns något att prata om. Varje regel får en ton:
     "vinst" lyfts fram, "varning" flaggas rött, "notis" är neutral. */

  function lasning(rader, mal) {
    const ut = [];
    if (!rader.length) return ut;
    const s = rader[rader.length - 1];
    const f = rader.length > 1 ? rader[rader.length - 2] : null;
    const m = mal || {};
    const d = (id) => (f && tal(s[id]) !== null && tal(f[id]) !== null) ? tal(s[id]) - tal(f[id]) : null;

    const dTimmar = d("timmar_stol"), dOms = d("omsattning");
    if (dTimmar !== null && dOms !== null && dTimmar <= -2 && dOms >= 0) {
      ut.push({ ton: "vinst", text: "Du stod " + Math.abs(dTimmar) + " timmar mindre bakom stolen och omsättningen höll. Det är ledarskapet som bär, inte dina händer." });
    }

    const dOmbok = d("ombokning");
    if (dOmbok !== null && dOms !== null && dOmbok >= 3 && Math.abs(dOms) < tal(s.omsattning) * 0.02) {
      ut.push({ ton: "notis", text: "Ombokningsgraden steg men omsättningen står still. Då är det priset, inte säljet, som är frågan." });
    }

    const dLedar = d("ledarskap");
    if (dLedar !== null && dTimmar !== null && dLedar >= 2 && dTimmar >= -1) {
      ut.push({ ton: "varning", text: "Du upplever att teamet klarar sig bättre, men du står lika många timmar bakom stolen. Känslan har flyttat sig, strukturen inte. Värt att titta på innan den vänder tillbaka." });
    }

    const andel = tal(s.mal_av) ? tal(s.mal_antal) / tal(s.mal_av) : null;
    if (andel !== null && andel <= 0.5 && tal(s.ombokning) !== null && m.ombokning && tal(s.ombokning) >= m.ombokning * 0.9) {
      ut.push({ ton: "varning", text: "Snittet ser bra ut men bara " + s.mal_antal + " av " + s.mal_av + " nådde målet. Någon enstaka drar upp siffran. Resten står still." });
    }

    const energier = rader.slice(-3).map(r => tal(r.energi)).filter(v => v !== null);
    if (energier.length === 3 && energier[2] < energier[1] && energier[1] < energier[0]) {
      ut.push({ ton: "varning", text: "Energin har gått ner tre månader i rad. Den siffran går före alla andra i det här formuläret." });
    }
    if (tal(s.energi) !== null && tal(s.energi) <= 3) {
      ut.push({ ton: "varning", text: "Energin ligger på " + s.energi + " av 10. Hör av dig innan nästa möte om det inte vänt." });
    }

    if (tal(s.belaggning) !== null && tal(s.belaggning) < 65) {
      ut.push({ ton: "varning", text: "Beläggningen ligger under 65 procent. Under den gränsen bär inte salongen sina kostnader, och allt annat får vänta." });
    }

    const senaste = rader.slice(-2).map(r => r.atagande_status);
    if (senaste.length === 2 && senaste.every(v => v === "inte_gjort")) {
      ut.push({ ton: "varning", text: "Åtagandet har inte blivit gjort två månader i rad. Då är det åtagandet som ska ändras, inte du." });
    }

    const loner = rader.slice(-3).map(r => r.lon);
    if (loner.length === 3 && loner.every(v => v === "nej")) {
      ut.push({ ton: "varning", text: "Du har inte tagit ut din lön tre månader i rad. Du finansierar salongen med din egen ersättning." });
    }

    if (tal(s.lediga_dagar) !== null && tal(s.lediga_dagar) <= 2) {
      ut.push({ ton: "varning", text: "Två lediga dagar eller färre på en hel månad. Det håller en månad, inte ett år." });
    }

    if (s.lon === "ja_over" && (!f || f.lon !== "ja_over")) {
      ut.push({ ton: "vinst", text: "Du tog ut din lön och något blev över. Skriv upp det, det är lätt att glömma." });
    }

    if (m.ombokning && tal(s.ombokning) !== null && tal(s.ombokning) >= m.ombokning) {
      ut.push({ ton: "vinst", text: "Ombokningsgraden är i mål på " + s.ombokning + " procent." });
    }

    return ut;
  }

  /* --------------------------------------------------- vad som ska skickas
     Utlösare mot artikelbiblioteket på salongsledarskap.se. Ordningen är
     prioriteringsordning: det som står först är det som är mest akut.
     De tre sista utlösarna har inget material än, och säger det rakt ut. */

  const FORSLAG = [
    {
      villkor: s => tal(s.belaggning) !== null && tal(s.belaggning) < 65,
      rubrik: "Beläggningen under lönsamhetsgränsen",
      material: [
        { slug: "a16-lonsamhetsgransen", typ: "artikel", namn: "Lönsamhetsgränsen" },
        { slug: "nyckeltal", typ: "verktyg", namn: "Salongens nyckeltal" }
      ]
    },
    {
      villkor: (s, m) => tal(s.energi) !== null && tal(s.energi) <= 4,
      rubrik: "Energin är låg",
      material: [],
      saknas: "Ingen artikel om ägarens egen hälsa finns i biblioteket."
    },
    {
      villkor: s => (tal(s.ledarskap) !== null && tal(s.ledarskap) <= 4) ||
                    (tal(s.timmar_stol) !== null && tal(s.timmar_stol) > 30),
      rubrik: "Allt går fortfarande genom henne",
      material: [
        { slug: "flaskhalstestet", typ: "verktyg", namn: "Flaskhalstestet" },
        { slug: "a21-delegera-i-tre-nivaer", typ: "artikel", namn: "Delegera i tre nivåer" }
      ]
    },
    {
      villkor: s => s.lon === "nej",
      rubrik: "Ingen lön ur salongen",
      material: [{ slug: "a08-din-lon-blir-over", typ: "artikel", namn: "Din lön blir över" }]
    },
    {
      villkor: s => s.atagande_status === "inte_gjort",
      rubrik: "Åtagandet blev inte gjort",
      material: [{ slug: "a06-beslut-utan-uppfoljning", typ: "artikel", namn: "Beslut utan uppföljning" }]
    },
    {
      villkor: s => tal(s.mal_av) && (tal(s.mal_antal) / tal(s.mal_av)) <= 0.5,
      rubrik: "Stor spridning i teamet",
      material: [
        { slug: "b02-tydliggora-mal", typ: "artikel", namn: "Tydliggöra mål" },
        { slug: "b05-nar-nagon-inte-gjort-som-ni-bestamt", typ: "artikel", namn: "När någon inte gjort som ni bestämt" }
      ]
    },
    {
      villkor: (s, m) => tal(s.ombokning) !== null && tal(s.ombokning) < (m.ombokning || 40),
      rubrik: "Ombokningsgraden under målet",
      material: [{ slug: "e02-ombokningsgraden", typ: "artikel", namn: "Ombokningsgraden" }]
    },
    {
      villkor: s => tal(s.leverans) !== null && tal(s.leverans) <= 5,
      rubrik: "Ojämn leverans",
      material: [
        { slug: "c06-ledarskap-behover-en-rytm", typ: "artikel", namn: "Ledarskap behöver en rytm" },
        { slug: "veckomotet", typ: "verktyg", namn: "Mallen för 20-minutersmötet" }
      ]
    },
    {
      villkor: s => tal(s.lediga_dagar) !== null && tal(s.lediga_dagar) < 4,
      rubrik: "För få lediga dagar",
      material: [{ slug: "a17-fran-45-timmar-till-25", typ: "artikel", namn: "Från 45 timmar till 25" }]
    },
    {
      villkor: (s, m) => tal(s.produkt) !== null && tal(s.produkt) < (m.produkt || 15),
      rubrik: "Produktförsäljningen under målet",
      material: [],
      saknas: "Ingen artikel om produktförsäljning finns i biblioteket."
    },
    {
      villkor: s => s.nya_varifran === "vet_ej",
      rubrik: "Vet inte varifrån kunderna kommer",
      material: [],
      saknas: "Ingen artikel om marknadsföring finns i biblioteket."
    }
  ];

  function forslag(rad, mal) {
    const m = mal || {};
    return FORSLAG.filter(f => { try { return f.villkor(rad, m); } catch (e) { return false; } });
  }

  return { FRAGOR, TAL, FORSLAG, MANADER, manadsnamn, forraManaden, tal, visa,
           sparkline, lasning, forslag };
})();
