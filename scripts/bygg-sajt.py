#!/usr/bin/env python3
"""Bygger den statiska sajten salongsledarskap.se ur repots markdown och verktyg.

Kör:  python3 scripts/bygg-sajt.py
Ut:   site/
"""

import html
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site")

# ---------------------------------------------------------------- struktur

PELARE = [
    {
        "nr": 1,
        "slug": "flaskhalstrasket",
        "namn": "Flaskhalsträsket",
        "gloss": "Tillståndet där allt måste passera dig. Ju hårdare du jobbar, desto djupare sjunker du.",
        "helvete": "Tidsfällan",
        "himmel": "Tidsfrihet",
        "verktyg": "flaskhalstestet",
        "artiklar": ["01-flaskhalstrasket", "01-05-sjukdagen", "a01-salongens-varde",
                     "a02-rakna-dina-avbrott", "a17-fran-45-timmar-till-25",
                     "a18-kunden-pa-admintiden", "a19-vart-tiden-tar-vagen",
                     "a20-fem-beslut-teamet-borde-fatta", "a21-delegera-i-tre-nivaer",
                     "a22-veckomotet-pa-tjugo-minuter"],
    },
    {
        "nr": 2,
        "slug": "ledarskap-gar-att-lara-sig",
        "namn": "Ledarskap går att lära sig",
        "gloss": "Tydliggöra, följa upp, feedback. Ett hantverk med tre delar, precis som klippning.",
        "helvete": "Ledarskapsgapet",
        "himmel": "Ledarskapsklarhet",
        "verktyg": "veckomotet",
        "artiklar": ["02-tydliggora-folja-upp-feedback", "a05-inte-omotiverat",
                     "a06-beslut-utan-uppfoljning", "b01-informera-eller-leda",
                     "b02-tydliggora-mal", "b03-feedback-tre-meningar",
                     "b04-medarbetarsamtalet", "b05-nar-nagon-inte-gjort-som-ni-bestamt"],
    },
    {
        "nr": 3,
        "slug": "salongens-ekonomi",
        "namn": "Salongens ekonomi",
        "gloss": "Fem tal styr en salong med anställda. De flesta ägare kan ett av dem.",
        "helvete": "Ekonomistressen",
        "himmel": "Ekonomisk trygghet",
        "verktyg": "nyckeltal",
        "artiklar": ["03-salongens-ekonomi", "a07-vad-drar-varje-stol-in",
                     "a08-din-lon-blir-over", "a09-tio-procent-hogre-pris",
                     "a10-luckorna-ar-ledarskap", "a11-fylla-luckan-at-nagon-annan",
                     "a16-lonsamhetsgransen", "e01-belaggningsgraden",
                     "e02-ombokningsgraden", "e03-varfor-vinsten-ar-borta"],
    },
    {
        "nr": 4,
        "slug": "ett-team-som-stannar",
        "namn": "Ett team som stannar",
        "gloss": "Uppsägningen kommer sällan som en överraskning för den som säger upp sig.",
        "helvete": "Personalstrul",
        "himmel": "Personalstolthet",
        "verktyg": "introduktion",
        "artiklar": ["04-ett-team-som-stannar", "a12-erfarna-valjer-ledare",
                     "a13-forsta-sex-veckorna", "a14-hyrstol-och-ledarskap",
                     "a15-rakna-pa-hyrstol-och-anstalld", "d01-rekrytera-nar-ingen-soker",
                     "d02-hog-sjukfranvaro", "d03-behall-din-basta-frisor",
                     "e04-lonesamtalet"],
    },
    {
        "nr": 5,
        "slug": "att-bara-ledarrollen",
        "namn": "Att bära ledarrollen",
        "gloss": "Ensamheten i ledarrollen är ett strukturfel, inte ett karaktärsfel.",
        "helvete": "Ensamheten",
        "himmel": "Gemenskap",
        "verktyg": None,
        "artiklar": ["05-ensam-mitt-bland-manniskor", "a03-ensamheten-ar-ett-strukturfel",
                     "a04-det-du-inte-sager", "c01-kollega-och-chef",
                     "c02-konflikt-i-personalrummet", "c03-vad-tycker-personalen",
                     "c04-fran-kompis-till-ledare", "c05-lamna-golvet",
                     "c06-ledarskap-behover-en-rytm"],
    },
]

VERKTYG = [
    {"slug": "flaskhalstestet", "namn": "Flaskhalstestet",
     "text": "Tolv påståenden som mäter hur mycket av salongen som måste passera dig. Tre minuter."},
    {"slug": "veckomotet", "namn": "Tjugominutersmötet",
     "text": "Mallen för veckomötet. Tre punkter, och anteckningen du tar med till nästa gång."},
    {"slug": "nyckeltal", "namn": "Salongens nyckeltal",
     "text": "Räknar fram beläggning, snittintäkt per kundtimme och bidrag per stol med dina egna tal."},
    {"slug": "introduktion", "namn": "Introduktion av ny frisör",
     "text": "Checklista för de sex första veckorna, med de tre samtalen som avgör om hon stannar."},
]

BILDER = {
    "portratt": {"fil": "maria-portratt.jpg",
                 "alt": "Maria Åberg vid ett bord, med penna och surfplatta"},
    "orange": {"fil": "maria-vid-bordet.jpg",
               "alt": "Maria Åberg arbetar vid ett bord i orange jacka"},
    "fargskal": {"fil": "maria-pa-golvet.jpg",
                 "alt": "Maria Åberg sopar hår i salongen och skrattar"},
    "skoljning": {"fil": "maria-skoljning.jpg",
                  "alt": "Maria Åberg sköljer en kunds hår, båda skrattar"},
}


def bild(nyckel, klass=""):
    """Returnerar en img-tagg om filen finns, annars tom sträng."""
    b = BILDER[nyckel]
    if not os.path.exists(os.path.join(ROOT, "bilder", b["fil"])):
        return ""
    return '<img class="%s" src="{p}bilder/%s" alt="%s" loading="lazy">' % (klass, b["fil"], b["alt"])


CASE = ["case-01-ledartid-som-gav-resultat", "case-02-uppfoljning-som-holl",
        "case-03-harkroppsverkstan", "case-04-1982"]

# ---------------------------------------------------------------- markdown

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", t)
    return t


def parse_md(path):
    src = open(path, encoding="utf-8").read()
    blocks = re.split(r"\n\s*\n", src.strip())
    title, deck, out = None, None, []
    for b in blocks:
        b = b.strip()
        if not b or b == "<!--cta-->":
            continue
        if b.startswith("# "):
            title = b[2:].strip()
            continue
        if title and deck is None and not b.startswith("#"):
            deck = " ".join(l.strip() for l in b.split("\n"))
            continue
        if b.startswith("### "):
            out.append("<h3>%s</h3>" % inline(b[4:].strip()))
        elif b.startswith("## "):
            out.append("<h2>%s</h2>" % inline(b[3:].strip()))
        elif b.startswith("> "):
            raw = " ".join(l.strip().lstrip(">").strip() for l in b.split("\n"))
            if " | " in raw:
                q, who = raw.split(" | ", 1)
                out.append('<blockquote class="quote"><p>%s</p><cite>%s</cite></blockquote>'
                           % (inline(q), inline(who)))
            else:
                out.append('<blockquote class="quote"><p>%s</p></blockquote>' % inline(raw))
        elif re.match(r"^\d+\.\s", b):
            items = [re.sub(r"\s*\n\s*", " ", i) for i in re.split(r"\n(?=\d+\.\s)", b) if i.strip()]
            items = [inline(re.sub(r"^\d+\.\s+", "", i)) for i in items]
            out.append("<ol>" + "".join("<li>%s</li>" % i for i in items) + "</ol>")
        elif b.startswith("- "):
            items = [inline(re.sub(r"\s*\n\s*", " ", l.strip()[2:])) for l in re.split(r"\n(?=- )", b) if l.strip()]
            out.append("<ul>" + "".join("<li>%s</li>" % i for i in items) + "</ul>")
        elif b.startswith("|"):
            rows = [r for r in b.split("\n") if r.strip().startswith("|")]
            cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
            if len(cells) > 1 and set("-: ") >= set("".join(cells[1])):
                head, body = cells[0], cells[2:]
            else:
                head, body = cells[0], cells[1:]
            t = "<div class='scroll'><table><thead><tr>"
            t += "".join("<th>%s</th>" % inline(c) for c in head) + "</tr></thead><tbody>"
            for r in body:
                t += "<tr>" + "".join("<td>%s</td>" % inline(c) for c in r) + "</tr>"
            out.append(t + "</tbody></table></div>")
        else:
            lines = [l.strip() for l in b.split("\n") if l.strip()]
            if len(lines) > 1 and all(l.startswith("*") for l in lines):
                out.append("<p>" + "<br>".join(inline(l) for l in lines) + "</p>")
            else:
                out.append("<p>%s</p>" % inline(" ".join(lines)))
    ord_count = len(re.findall(r"\S+", re.sub(r"^#.*$", "", src, flags=re.M)))
    return {"title": title or "", "deck": deck or "", "body": "\n      ".join(out),
            "minuter": max(2, round(ord_count / 200))}

# ---------------------------------------------------------------- mallar

def nav(depth, aktiv=""):
    p = "../" * depth
    lankar = [("", "Start", "index.html"), ("artiklar", "Artiklar", "artiklar.html"),
              ("verktyg", "Verktyg", "verktyg.html"), ("kundcase", "Kundcase", "kundcase.html"),
              ("om", "Om", "om.html")]
    ut = []
    for key, namn, fil in lankar:
        cls = ' class="pa"' if key == aktiv else ""
        ut.append('<a href="%s%s"%s>%s</a>' % (p, fil, cls, namn))
    return ('<nav class="nav"><a class="ord" href="%sindex.html">Salongsledarskap</a>'
            '<div class="navlank">%s</div></nav>') % (p, "".join(ut))


def foot(depth):
    p = "../" * depth
    return """<footer class="sitefot">
  <div class="fotgrid">
    <div>
      <strong>Salongsledarskap</strong>
      <p>En kunskapssajt för dig som äger salong och har anställda. Skriven av Maria Åberg, Åberg &amp; Co.</p>
    </div>
    <div>
      <strong>Börja här</strong>
      <p><a href="{p}verktyg/flaskhalstestet.html">Flaskhalstestet</a><br>
         <a href="{p}artiklar.html">Alla artiklar</a><br>
         <a href="{p}om.html">Om Maria</a></p>
    </div>
    <div>
      <strong>Kontakt</strong>
      <p>maria@abergco.se<br>abergco.se</p>
    </div>
  </div>
  <p class="fotrad">Åberg &amp; Co · salongsledarskap.se</p>
</footer>""".format(p=p)


def sida(titel, beskrivning, innehall, depth=0, aktiv="", klass=""):
    p = "../" * depth
    ogfil = os.path.join(ROOT, "bilder", BILDER["portratt"]["fil"])
    ogbild = ('\n<meta property="og:image" content="%sbilder/%s">' % (p, BILDER["portratt"]["fil"])
              if os.path.exists(ogfil) else "")
    return """<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titel}</title>
<meta name="description" content="{besk}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap">
<link rel="stylesheet" href="{p}style.css">
<link rel="icon" href="{p}favicon.svg" type="image/svg+xml">
<meta property="og:title" content="{titel}">
<meta property="og:description" content="{besk}">
<meta property="og:type" content="website">
<meta property="og:locale" content="sv_SE">{ogbild}
<meta name="twitter:card" content="summary_large_image">
</head>
<body class="{klass}">
{nav}
{innehall}
{foot}
</body>
</html>""".format(titel=html.escape(titel), besk=html.escape(beskrivning), p=p,
                  klass=klass, nav=nav(depth, aktiv), innehall=innehall, foot=foot(depth),
                  ogbild=ogbild)


def cta_block(pelare, depth):
    p = "../" * depth
    if pelare and pelare["verktyg"]:
        v = next(x for x in VERKTYG if x["slug"] == pelare["verktyg"])
        return """<div class="cta">
  <span class="label">Nästa steg</span>
  <h2>{namn}</h2>
  <p>{text}</p>
  <a class="knapp" href="{p}verktyg/{slug}.html">Öppna verktyget</a>
</div>""".format(namn=v["namn"], text=v["text"], p=p, slug=v["slug"])
    return """<div class="cta">
  <span class="label">Nästa steg</span>
  <h2>Det svåra är att hålla i det</h2>
  <p>Nästan alla klarar den första veckan. Det som brukar fattas är någon som frågar hur det gick i månad tre.</p>
  <a class="knapp" href="{p}om.html">Så arbetar jag</a>
</div>""".format(p=p)

# ---------------------------------------------------------------- bygge

def bygg():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, "artiklar"))
    os.makedirs(os.path.join(OUT, "kundcase"))
    os.makedirs(os.path.join(OUT, "verktyg"))

    shutil.copyfile(os.path.join(ROOT, "scripts", "style.css"), os.path.join(OUT, "style.css"))
    shutil.copyfile(os.path.join(ROOT, "scripts", "favicon.svg"), os.path.join(OUT, "favicon.svg"))

    kalla = os.path.join(ROOT, "bilder")
    if os.path.isdir(kalla):
        os.makedirs(os.path.join(OUT, "bilder"), exist_ok=True)
        for f in os.listdir(kalla):
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                shutil.copyfile(os.path.join(kalla, f), os.path.join(OUT, "bilder", f))

    artiklar = {}
    for pel in PELARE:
        for slug in pel["artiklar"]:
            path = os.path.join(ROOT, "artiklar", slug + ".md")
            if not os.path.exists(path):
                raise SystemExit("Saknas: " + path)
            d = parse_md(path)
            d["pelare"] = pel
            d["slug"] = slug
            artiklar[slug] = d

    # artikelsidor
    for pel in PELARE:
        for i, slug in enumerate(pel["artiklar"]):
            a = artiklar[slug]
            grannar = [artiklar[s] for s in pel["artiklar"] if s != slug][:3]
            mer = "".join(
                '<li><a href="%s.html">%s</a></li>' % (g["slug"], html.escape(g["title"]))
                for g in grannar)
            inne = """<article class="artikel">
  <header class="artikelhuvud">
    <a class="ovan" href="../artiklar.html#pelare{nr}">Pelare {nr} · {pnamn}</a>
    <h1>{titel}</h1>
    <p class="ingress">{deck}</p>
    <div class="byline">{avatar}<span>Maria Åberg</span><span>{min} min läsning</span></div>
  </header>
  <div class="brod">
      {body}
  </div>
  {cta}
  <div class="mer">
    <span class="label">Mer i samma pelare</span>
    <ul>{mer}</ul>
  </div>
</article>""".format(nr=pel["nr"], pnamn=html.escape(pel["namn"]), titel=html.escape(a["title"]),
                     deck=inline(a["deck"]), min=a["minuter"], body=a["body"],
                     cta=cta_block(pel, 1), mer=mer,
                     avatar=bild("portratt", "avatar").format(p="../"))
            open(os.path.join(OUT, "artiklar", slug + ".html"), "w", encoding="utf-8").write(
                sida(a["title"] + " · Salongsledarskap", a["deck"], inne, 1, "artiklar"))

    # artikelöversikt
    delar = []
    for pel in PELARE:
        rader = []
        for i, slug in enumerate(pel["artiklar"]):
            a = artiklar[slug]
            etikett = "Pelarartikel" if i == 0 else ""
            rader.append("""<li{cls}><a href="artiklar/{slug}.html">
      <span class="rubrik">{titel}</span>
      <span class="ing">{deck}</span>
      <span class="dags">{et}{sep}{min} min</span></a></li>""".format(
                cls=' class="huvud"' if i == 0 else "", slug=slug,
                titel=html.escape(a["title"]), deck=inline(a["deck"]),
                et=etikett, sep=" · " if etikett else "", min=a["minuter"]))
        delar.append("""<section class="pelare" id="pelare{nr}">
  <div class="pelarhuvud">
    <span class="pnr">{nr}</span>
    <div>
      <h2>{namn}</h2>
      <p class="gloss">{gloss}</p>
      <div class="arc"><span class="chip hell">{h}</span><span class="pil">→</span><span class="chip heaven">{him}</span></div>
    </div>
  </div>
  <ol class="lista">{rader}</ol>
</section>""".format(nr=pel["nr"], namn=html.escape(pel["namn"]), gloss=html.escape(pel["gloss"]),
                     h=pel["helvete"], him=pel["himmel"], rader="".join(rader)))

    inne = """<div class="sidhuvud">
  <span class="ovan">Alla artiklar</span>
  <h1>Fem pelare, {n} artiklar</h1>
  <p class="ingress">Varje pelare tar sig an ett dyrt och återkommande problem. Börja med pelarartikeln, den ligger först.</p>
</div>
{delar}""".format(n=len(artiklar), delar="".join(delar))
    open(os.path.join(OUT, "artiklar.html"), "w", encoding="utf-8").write(
        sida("Artiklar · Salongsledarskap",
             "Alla artiklar om ledarskap, ekonomi och personal i salong med anställda.",
             inne, 0, "artiklar"))

    # verktyg
    for v in VERKTYG:
        frag = open(os.path.join(ROOT, "verktyg", v["slug"] + ".html"), encoding="utf-8").read()
        m_title = re.search(r"<title>(.*?)</title>", frag, re.S)
        titel = m_title.group(1) if m_title else v["namn"]
        head_bitar = re.findall(r"<link[^>]*>|<style>.*?</style>", frag, re.S)
        kropp = re.sub(r"<title>.*?</title>|<link[^>]*>|<style>.*?</style>", "", frag, flags=re.S)
        extra = """<style>
  .nav{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;
    gap:16px;flex-wrap:wrap;padding:14px 24px;border-bottom:1px solid var(--line);
    background:var(--ground);font-family:var(--body);font-size:.8rem;font-weight:600}
  .nav .ord{font-family:var(--display);font-size:1rem;font-weight:700;color:var(--ink);text-decoration:none}
  .nav .navlank{display:flex;gap:16px;flex-wrap:wrap}
  .nav a{color:var(--ink-soft);text-decoration:none}
  .nav a:hover,.nav a.pa{color:var(--accent)}
</style>"""
        full = """<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t} · Salongsledarskap</title>
<meta name="description" content="{b}">
{head}
{extra}
</head>
<body>
{nav}
{kropp}
{foot}
</body>
</html>""".format(t=titel, b=html.escape(v["text"]), head="\n".join(head_bitar), extra=extra,
                  nav=nav(1, "verktyg"), kropp=kropp, foot="")
        open(os.path.join(OUT, "verktyg", v["slug"] + ".html"), "w", encoding="utf-8").write(full)

    kort = "".join("""<li><a href="verktyg/{slug}.html">
    <span class="rubrik">{namn}</span><span class="ing">{text}</span>
    <span class="dags">Öppna verktyget</span></a></li>""".format(**v) for v in VERKTYG)
    inne = """<div class="sidhuvud">
  <span class="ovan">Verktyg</span>
  <h1>Fyra saker du kan göra i veckan</h1>
  <p class="ingress">Verktygen räknar och håller ordning. De sparar allt i din egen webbläsare och skickar ingenting vidare.</p>
</div>
<ol class="lista stor">{kort}</ol>""".format(kort=kort)
    open(os.path.join(OUT, "verktyg.html"), "w", encoding="utf-8").write(
        sida("Verktyg · Salongsledarskap", "Fyra verktyg för salongsägare med anställda.",
             inne, 0, "verktyg"))

    # kundcase
    case_data = []
    for slug in CASE:
        d = parse_md(os.path.join(ROOT, "kundcase", slug + ".md"))
        d["slug"] = slug
        case_data.append(d)
        inne = """<article class="artikel">
  <header class="artikelhuvud">
    <a class="ovan" href="../kundcase.html">Kundcase</a>
    <h1>{titel}</h1>
    <p class="ingress">{deck}</p>
  </header>
  <div class="brod">
      {body}
  </div>
  {cta}
</article>""".format(titel=html.escape(d["title"]), deck=inline(d["deck"]), body=d["body"],
                     cta=cta_block(None, 1))
        open(os.path.join(OUT, "kundcase", slug + ".html"), "w", encoding="utf-8").write(
            sida(d["title"] + " · Salongsledarskap", d["deck"], inne, 1, "kundcase"))

    kort = "".join("""<li><a href="kundcase/{slug}.html">
    <span class="rubrik">{titel}</span><span class="ing">{deck}</span>
    <span class="dags">Läs caset</span></a></li>""".format(
        slug=c["slug"], titel=html.escape(c["title"]), deck=inline(c["deck"])) for c in case_data)
    inne = """<div class="sidhuvud">
  <span class="ovan">Kundcase</span>
  <h1>Fyra salonger, dokumenterade</h1>
  <p class="ingress">Siffrorna kommer ur salongernas egna uppföljningar. Medarbetare är anonyma.</p>
</div>
<ol class="lista stor">{kort}</ol>""".format(kort=kort)
    open(os.path.join(OUT, "kundcase.html"), "w", encoding="utf-8").write(
        sida("Kundcase · Salongsledarskap", "Fyra dokumenterade kundcase.", inne, 0, "kundcase"))

    # om
    inne = """{omhero}
<div class="sidhuvud smal">
  <span class="ovan">Om</span>
  <h1>Jag har stått där du står</h1>
  <p class="ingress">Trettio år i branschen, tjugo som salongsledare. Jag driver fortfarande en säsongssalong varje sommar och står själv på golvet.</p>
</div>
<div class="brod smal">
  <p>Jag startade eget 2005 och byggde tre salonger. Under samma period fick jag två barn, köpte hus och utbildade mig till coach i England.</p>
  <p>Jag är för bra på att jobba hårt. Det är därför jag känner igen mönstret hos varje salongsägare jag möter, och det är därför den här sajten finns.</p>
  <h2>Det jag hjälper till med</h2>
  <p>Salongsägare med fyra anställda eller fler, som vill gå från tjat och brandsläckning till ett team som tar egna initiativ. Det handlar om tid, tydlighet och lönsamhet.</p>
  <p>Arbetet bygger på tre delar som hänger ihop. Tydliggöra vad som gäller, följa upp att det händer, och ge feedback så att det upprepas. Det är ett hantverk, precis som klippning, och det går att lära sig.</p>
  {ombild}
  <h2>Det jag har att visa</h2>
  <ul>
    <li>Salonger som ökat sin ombokningsgrad och försäljning</li>
    <li>Medarbetare som gått från 27 till 68 procents beläggning på två år</li>
    <li>Ägare som gått från 120 procents arbetstid ner mot halvtid med kund</li>
  </ul>
  <p>Siffrorna kommer ur salongernas egna uppföljningar och finns i sin helhet under kundcase.</p>
  <h2>Kontakt</h2>
  <p>maria@abergco.se</p>
</div>
""".format(omhero=('<div class="omhero">%s</div>' % bild("portratt", "portratthero").format(p="")) if bild("orange") else "",
           ombild=('<figure class="brodbild">%s<figcaption>Trettio år i branschen, och fortfarande på golvet varje sommar.</figcaption></figure>'
                   % bild("skoljning").format(p="")) if bild("skoljning") else "") + cta_block(None, 0)
    open(os.path.join(OUT, "om.html"), "w", encoding="utf-8").write(
        sida("Om Maria Åberg · Salongsledarskap",
             "Trettio år i branschen, tjugo som salongsledare.", inne, 0, "om"))

    # start
    pelarkort = "".join("""<a class="pkort" href="artiklar.html#pelare{nr}">
    <span class="pnr">{nr}</span>
    <span class="pnamn">{namn}</span>
    <span class="pgloss">{gloss}</span>
    <span class="pantal">{antal} artiklar</span></a>""".format(
        nr=p["nr"], namn=html.escape(p["namn"]), gloss=html.escape(p["gloss"]),
        antal=len(p["artiklar"])) for p in PELARE)

    utvalda = "".join("""<li><a href="artiklar/{slug}.html">
    <span class="rubrik">{titel}</span><span class="ing">{deck}</span>
    <span class="dags">Pelare {nr} · {min} min</span></a></li>""".format(
        slug=p["artiklar"][0], titel=html.escape(artiklar[p["artiklar"][0]]["title"]),
        deck=inline(artiklar[p["artiklar"][0]]["deck"]), nr=p["nr"],
        min=artiklar[p["artiklar"][0]]["minuter"]) for p in PELARE)

    vkort = "".join("""<a class="vkort" href="verktyg/{slug}.html">
    <span class="vnamn">{namn}</span><span class="vtext">{text}</span></a>""".format(**v)
        for v in VERKTYG)

    inne = """<section class="hero">
  <span class="ovan">För dig som äger salong och har anställda</span>
  <h1>Ditt team är inte omotiverat. De har lärt sig att du löser det.</h1>
  <p class="ingress">Här finns {n} artiklar om ledarskap, ekonomi och personal i salong. Alla utgår från samma sak: att ledarskap är ett hantverk som går att lära sig, precis som klippning.</p>
  <div class="heroknappar">
    <a class="knapp" href="verktyg/flaskhalstestet.html">Gör Flaskhalstestet</a>
    <a class="knapp tunn" href="artiklar.html">Läs artiklarna</a>
  </div>
  <div class="fakta">
    <div><strong>{n}</strong><span>artiklar</span></div>
    <div><strong>5</strong><span>pelare</span></div>
    <div><strong>4</strong><span>verktyg</span></div>
    <div><strong>3 min</strong><span>tar testet</span></div>
  </div>
</section>

<section class="block">
  <div class="blockhuvud"><h2>Fem problem som kostar pengar varje månad</h2>
    <p>Välj det som skaver mest just nu.</p></div>
  <div class="pkortgrid">{pelarkort}</div>
</section>

<section class="block">
  <div class="blockhuvud"><h2>Börja med pelarartiklarna</h2>
    <p>En per pelare. Läs den som handlar om din vardag.</p></div>
  <ol class="lista">{utvalda}</ol>
</section>

<section class="block">
  <div class="blockhuvud"><h2>Verktygen räknar åt dig</h2>
    <p>Allt sparas i din egen webbläsare. Ingenting skickas vidare.</p></div>
  <div class="vkortgrid">{vkort}</div>
</section>

{band}

<section class="block brev">
  <div>
    <span class="label">Nyhetsbrevet</span>
    <h2>Ett brev varannan vecka</h2>
    <p>Ett kort resonemang, en länk och ett konkret tips. Inget annat.</p>
  </div>
  <form class="brevform" onsubmit="return false;">
    <label for="mejl">Din mejladress</label>
    <div class="brevrad">
      <input id="mejl" type="email" placeholder="namn@salong.se" required>
      <button type="submit">Anmäl mig</button>
    </div>
    <p class="notis">Formuläret behöver kopplas till din e-posttjänst innan sajten publiceras.</p>
  </form>
</section>""".format(n=len(artiklar), pelarkort=pelarkort, utvalda=utvalda, vkort=vkort,
           band=('<section class="band">%s<div class="bandtext"><span class="label">Vem som skriver</span>'
                 '<h2>Maria Åberg</h2><p>Trettio år i branschen, tjugo som salongsledare. Driver fortfarande '
                 'en säsongssalong varje sommar och står själv på golvet.</p>'
                 '<a class="knapp tunn" href="om.html">Läs mer om mig</a></div></section>'
                 % bild("fargskal", "bandbild").format(p="")) if bild("fargskal") else "")

    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(
        sida("Salongsledarskap · kunskapssajten för dig som äger salong",
             "Artiklar och verktyg om ledarskap, ekonomi och personal för salongsägare med anställda.",
             inne, 0, "", "start"))

    print("Sidor byggda:")
    print(" ", len(artiklar), "artiklar")
    print(" ", len(case_data), "kundcase")
    print(" ", len(VERKTYG), "verktyg")
    print(" ", 5, "översiktssidor")


if __name__ == "__main__":
    bygg()
