# Bilder

Lägg fotografierna här med exakt de här filnamnen. Sajten hämtar dem automatiskt
nästa gång byggskriptet körs. Saknas en fil hoppas den bilden över, och sajten
byggs ändå utan trasiga bildrutor.

| Filnamn | Vilken bild | Används till |
|---|---|---|
| `maria-orange.jpg` | Du i den oranga jackan i dörröppningen, den tajtare av de två | Överst på om-sidan, och som delningsbild när någon delar en länk |
| `maria-fargskal.jpg` | Du som sträcker fram färgskålen, liggande format | Brett band längst ner på startsidan |
| `maria-skoljning.jpg` | Sköljningen där ni båda skrattar | Om-sidan, under stycket om de trettio åren |
| `maria-portratt.jpg` | Porträttet vid tvättstolen, du tittar in i kameran | Liten rund bild vid bylinen i varje artikel |

Ladda upp originalen, upplösningen spelar ingen roll. Delningsbilden bör vara
minst 1200 pixlar bred, vilket originalen är.

Två saker att tänka på innan bilderna publiceras:

- Kunderna syns tydligt i flera av bilderna och behöver ha godkänt att synas på
  en webbplats.
- Ange gärna fotografens namn i sidfoten om avtalet kräver det.

Kör sedan `python3 scripts/bygg-sajt.py` så följer bilderna med till `site/`.
