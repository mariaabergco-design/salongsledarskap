# salongsledarskap.se

Kunskapssajt för salongsägare med fyra anställda eller fler. Innehållet ägs av
Åberg & Co.

## Vad som finns här

| Mapp | Innehåll |
|---|---|
| `artiklar/` | 46 artiklar som markdown, fem pelarartiklar och resten stödartiklar |
| `kundcase/` | Fyra kundcase |
| `verktyg/` | Fyra interaktiva verktyg i html, plus Flaskhalstestets text |
| `site/` | Den färdiga sajten, genererad. Redigera aldrig här, ändringar skrivs över |
| `scripts/` | Byggskript och stilmall |
| `typsnitt/` | Montserrat och Playfair Display som filer, med licenser |
| `dataskydd.md` | Texten på dataskyddssidan, redigeras som vanlig markdown |
| `nisch.md` | Målgrupp, nisch, kundens helvete och himmel |
| `innehallsplan.md` | Pelare, publiceringsrytm, trappan till kartläggningsmöte |
| `fas1-research.md` | Research med källa och verifieringsgrad per påstående |
| `fas2-problemkarta.md` | Sju teman sorterade efter medvetandenivå |
| `fas3-rubriker.md` | Rubriker och ingresser |

## Bygga om sajten

```
python3 scripts/bygg-sajt.py
```

Skriptet läser markdown i `artiklar/` och `kundcase/`, verktygen i `verktyg/`
och stilmallen i `scripts/style.css`. Allt hamnar i `site/`.

Byter du ut ett fotografi, kör först

```
python3 scripts/komprimera.py
```

Det skriptet läser originalen i `bilder/original/`, skalar ner dem och sparar
både jpeg och webp i `bilder/`. Sajten väger 1,7 MB med bilder, mot 6,9 MB
med originalen.

När du skriver en ny artikel: lägg markdownfilen i `artiklar/`, lägg till
filnamnet i rätt pelare i listan `PELARE` överst i `scripts/bygg-sajt.py`, och
kör skriptet igen.

## Typsnitten

Montserrat och Playfair Display ligger i `typsnitt/` och laddas från sajten
själv. Inget hämtas från Google när någon läser, så besökarens ip-adress
stannar hos dig. Filerna ska checkas in i repot.

Behöver du en ny vikt eller ett annat snitt, ändra `ADRESS` överst i
`scripts/hamta-typsnitt.py` och kör

```
python3 scripts/hamta-typsnitt.py
```

Skriptet behöver internet, hämtar hem filerna och skriver om
`typsnitt/typsnitt.css`. Byggskriptet kopierar hela mappen till `site/`.

## Länkar i texten

Skriv `[texten som syns](adressen)`. Adressen får se ut på fyra sätt.

| Adress | Leder till |
|---|---|
| `artikel:a21-delegera-i-tre-nivaer` | En artikel, filnamnet utan `.md` |
| `verktyg:flaskhalstestet` | Ett verktyg |
| `kundcase:case-04-1982` | Ett kundcase |
| `https://exempel.se` | En sida utanför sajten, öppnas i ny flik |

Ett exempel:

```
Ramen säger vad som gäller. [Nästa text](artikel:a21-delegera-i-tre-nivaer)
säger hur mycket frihet som följer med.
```

De tre första sorterna hittar rätt oavsett var på sajten sidan ligger. Skriv
aldrig sökvägar med `../` för hand.

Titta lokalt innan du publicerar:

```
python3 -m http.server -d site 8000
```

Öppna sedan `http://localhost:8000`.

## Publicera på salongsledarskap.se

Sajten är helt statisk. Den behöver ingen databas och ingen serverkod.

**Alternativ 1, Netlify.** Skapa ett konto, välj Add new site och Import from
Git, peka på det här repot. Ange `python3 scripts/bygg-sajt.py` som build
command och `site` som publish directory. Lägg sedan till domänen under Domain
settings och följ instruktionen för DNS.

**Alternativ 2, GitHub Pages.** Slå på Pages i repots inställningar och välj
GitHub Actions som källa. Arbetsflödet i `.github/workflows/pages.yml` bygger
och publicerar automatiskt vid varje push. Lägg till domänen under Custom
domain.

**Alternativ 3, vilket webbhotell som helst.** Kör byggskriptet och ladda upp
innehållet i `site/` med ftp.

## Nyhetsbrevet

Formuläret kommer från Kartra, under Forms. Koden ligger i `nyhetsbrev.html`
och byggskriptet lägger in den på startsidan.

Byter du formulär i Kartra: kopiera den nya koden, klistra in den i
`nyhetsbrev.html` i stället för den gamla, och kör
`python3 scripts/bygg-sajt.py`. Filen används rakt av.

Tar du bort filen visas i stället ett formulär som ser rätt ut men inte
skickar något.

## Innan sajten går live

- [x] Koppla nyhetsbrevsformuläret på startsidan till Kartra. Koden ligger i `nyhetsbrev.html`
- [x] Kartras formulär laddas från Kartra när startsidan öppnas. Det står i `dataskydd.md`
- [x] Låt de fyra kunderna godkänna sina case, de är namngivna. Klart 2026-09-02
- [x] Kontrollera siffrorna som kommer ur kundernas egna uppföljningar. Klart 2026-09-02
- [x] Lägg in en dataskyddstext om du samlar in mejladresser. Utkast finns i `dataskydd.md`, läs igenom det
- [x] Verktygen ska vara öppna. Beslut 2026-09-02, ingen mejladress krävs för att se sitt resultat
- [ ] Välj var sajten ska ligga och peka domänen dit

## Ordning på publiceringen

Innehållsplanen föreslår två artiklar i månaden i sex månader. Sajten kan
publiceras med allt på plats direkt, men nyhetsbrevet och Instagram bör följa
den takten. Se avsnittet om de första sex månaderna i `innehallsplan.md`.
