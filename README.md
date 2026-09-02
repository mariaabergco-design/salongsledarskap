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

När du skriver en ny artikel: lägg markdownfilen i `artiklar/`, lägg till
filnamnet i rätt pelare i listan `PELARE` överst i `scripts/bygg-sajt.py`, och
kör skriptet igen.

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

## Innan sajten går live

- [ ] Koppla nyhetsbrevsformuläret på startsidan till din e-posttjänst
- [ ] Låt de fyra kunderna godkänna sina case, de är namngivna
- [ ] Kontrollera siffrorna som kommer ur kundernas egna uppföljningar
- [ ] Lägg in en dataskyddstext om du samlar in mejladresser
- [ ] Koppla verktygen till mejlinsamling om de ska fungera som lead magnets

## Ordning på publiceringen

Innehållsplanen föreslår två artiklar i månaden i sex månader. Sajten kan
publiceras med allt på plats direkt, men nyhetsbrevet och Instagram bör följa
den takten. Se avsnittet om de första sex månaderna i `innehallsplan.md`.
