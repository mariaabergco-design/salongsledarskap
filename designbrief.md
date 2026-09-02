# Designbrief för salongsledarskap.se

Sajten ska kännas som Åberg & Co, men läsas som en kunskapstidskrift. Inte en
broschyr som säljer, utan en plats där en salongsägare läser tolv minuter och
går därifrån med något hon kan göra i morgon.

Den här filen är sanningen om designen. Ändras något här ska `scripts/style.css`
följa efter.

## Vad jag utgått från

**abergco.se.** Sajten ligger på Squarespace. Jag har läst den och hämtat de
faktiska värdena ur dess stilmall, inte gissat.

- Rubriktypsnitt: Playfair Display
- Brödtext: Montserrat
- Bakgrund: `#FFFCF5`, en varm råvit
- Text: `#2E2E2E`
- Accent: `#FCBE04`, en gyllene gul
- Två stödfärger: `#FEE69F` ljus guld och `#E6DDD4` varm gråbeige

**Lilla Manualen_ÅbergCO.pdf**, den grafiska profilen från 2020. Den ligger i
mappen Bygga hemsidan i din Drive. Värdena nedan är hämtade därifrån och går
före allt jag mätt i bild.

| Roll i manualen | Kod | Tryck |
|---|---|---|
| Primärfärg | `#FCBE04` | CMYK 0/28/94/0 |
| Komplementfärg | `#F6A313` | CMYK 0/42/94/0, PMS 137 C |
| Accentfärg | `#878787` | CMYK 0/0/0/60, PMS Cool gray 8 C |

**Logotypen.** Ordbild där ÅBERG står i manualens accentgrå och &CO i
komplementfärgen. Under står raden Ledarskap Utveckling Coaching i samma grå.
Den liggande varianten är ungefär 502 gånger 131 pixlar, den stående 197 gånger
133.

Manualen säger två saker om användningen. Den liggande logotypen används med
fördel alltid tillsammans med taglinen. Den stående används med eller utan.

**Frizonen** är definierad i manualen: runt logotypen ska det alltid finnas ett
område fritt från andra element, bilder och texter, och det området ska vara
minst höjden på bokstaven G i ÅBERG.

**Formspråket på den befintliga sajten** består av stora rundade organiska
former i guld och beige som ligger som bakgrund bakom text. De fungerar på en
säljsida. De följer inte med hit, och varför står under Vad som inte följer med.

**Tonaliteten** i texten på abergco.se är personlig och uppmuntrande. Maria
berättar sin egen resa. Den tonen finns kvar i sajtens Om-sida, men artiklarna
har en annan röst: torrare, mer fackpress, mindre uppmuntran.

## Känslan vi vill åt

En läsare som landar på en artikel ska tänka tre saker inom fem sekunder.

Någon har brytt sig om det här. Det är skrivet för mig, inte för alla. Det här
kostar mig ingenting att läsa.

Ord som ska stämma: **lugn, varm, precis, vuxen, redaktionell**.

Ord som inte ska stämma: peppig, säljig, mjuk i kanterna, kursig.

## Färger

Basen är hämtad rakt av från varumärket. Den enda avvikelsen är att den gula
accentfärgen inte går att använda till text, och det förklaras under Accenten.

### Ljust läge

| Roll | Kod | Används till |
|---|---|---|
| Grund | `#FFFCF5` | Sidbakgrund, varumärkets råvita |
| Panel | `#F7F0E4` | Faktarutor, citatblock, verktygens fält |
| Panel ljus | `#FFFFFF` | Kort som ska lyfta från grunden |
| Text | `#2E2E2E` | All brödtext och alla rubriker |
| Text dämpad | `#6E685F` | Ingresser, bildtexter, sammanfattningar |
| Text svag | `#736D64` | Datum, lästid, filnamn, etiketter |
| Linje | `#E6DDD4` | Avdelare, ramar, tabellinjer |
| Linje stark | `#D6C9BB` | Ramar som ska synas, inputfält |
| Accent | `#F6A313` | Grafisk markering, aldrig text |
| Accent djup | `#8A5A05` | Länkar, knappar, etiketter i versal |
| Guldton | `#FEE69F` | Bakgrund i markerade block |

Kontrasterna är kontrollerade. Text mot grund ger 13,3. Dämpad text ger 5,4.
Djup accent mot grund ger 5,8. Alla klarar kravet på 4,5.

### Mörkt läge

Den som har mörkt läge i sin telefon ska slippa bli bländad klockan elva på
kvällen. Samma varma temperatur, omvänd.

| Roll | Kod |
|---|---|
| Grund | `#1B1714` |
| Panel | `#241F1A` |
| Panel ljus | `#201B17` |
| Text | `#F2EBE1` |
| Text dämpad | `#C4B8A9` |
| Text svag | `#A79B8C` |
| Linje | `#332B24` |
| Linje stark | `#4A3E33` |
| Accent | `#FFB43D` |
| Accent djup | `#FFC661` |
| Guldton | `#3A2C12` |

### Accenten, och varför den ändras

Manualens primärfärg `#FCBE04` ger kontrast 1,6 mot den råvita bakgrunden.
Komplementfärgen `#F6A313` ger 2,0. Kravet för läsbar text är 4,5. En länk i någon av de
färgerna är alltså osynlig för den som läser i solljus eller ser färger sämre.

Därför delas accenten i två.

**`#F6A313` är den grafiska accenten.** Den syns i logotypen, i den lodräta
linjen bredvid citat, i understrykningen under en aktiv menypost, i siffran
framför en pelare, i ikonen i faviconet. Aldrig som text som ska läsas.

**`#8A5A05` är den läsbara accenten.** Samma färgton som komplementfärgen, mörkare.
Den används på länkar i löptext och på etiketter i versal. Den ser ut som samma
familj och den går att läsa.

**Knappar bär guldet.** Bakgrunden är komplementfärgen och texten på den är
`#2E2E2E`, mörk i både ljust och mörkt läge. Kontrasten blir 6,6. Det är den
enda ytan på sajten som är helt guldfärgad, och den gör att en besökare känner
igen avsändaren utan att läsa logotypen.

Guldet `#FEE69F` används som bakgrund bakom ett block som ska sticka ut, med
vanlig svart text ovanpå. Kontrasten där blir 11,0.

## Typsnitt

Båda finns redan i `typsnitt/` och laddas från sajten själv.

**Playfair Display** för rubriker. Den finns i vikterna 500, 600 och 700 samt
kursiv 400.

**Montserrat** för brödtext och allt gränssnitt. Vikterna 400, 500, 600 och 700.

Det är samma par som på abergco.se, vilket är hela poängen. En läsare som gått
från den ena sajten till den andra ska känna igen sig utan att kunna säga varför.

### Skala

| Element | Typsnitt | Storlek | Vikt | Radavstånd |
|---|---|---|---|---|
| Artikelrubrik | Playfair Display | 2,6 till 3,2 rem, flytande | 600 | 1,08 |
| Sektionsrubrik i artikel | Playfair Display | 1,55 rem | 600 | 1,2 |
| Underrubrik | Playfair Display | 1,15 rem | 600 | 1,3 |
| Ingress | Montserrat | 1,16 rem | 400 | 1,55 |
| Brödtext | Montserrat | 17 px | 400 | 1,72 |
| Citat | Playfair Display kursiv | 1,3 rem | 400 | 1,4 |
| Avsändare i citat | Montserrat | 0,82 rem | 600 | 1,4 |
| Etikett i versal | Montserrat | 0,7 rem | 700 | 1,2 |
| Meta, datum och lästid | Montserrat | 0,78 rem | 600 | 1,4 |

Etiketter i versal får `letter-spacing: .13em`. Ingen annan text spärras.

Rubriker får `text-wrap: balance` så att sista raden inte blir ett ensamt ord.

### Läsbarhet

Textspalten är **68 tecken bred**, aldrig bredare. Det är runt 720 pixlar med
den här texten.

Radavståndet i brödtext är 1,72. Det är mer luft än de flesta sajter har, och
det är avsiktligt. Målgruppen läser på telefon mellan två kunder.

Avstånd mellan stycken är 1,1 rem. Avstånd före en ny sektionsrubrik är 2,6 rem,
efter den 0,7 rem. Rubriken ska sitta ihop med sin text, inte sväva mitt emellan.

## Luft och layout

Sidan har tre bredder och inga fler.

**Textbredd, 720 pixlar.** Artiklar, kundcase, dataskydd, allt som läses.

**Innehållsbredd, 1020 pixlar.** Startsidan, artikelöversikten, verktygslistan.

**Full bredd.** Bara sidhuvudet och sidfoten.

Marginalen mot skärmkanten är 24 pixlar på telefon och växer inte linjärt. Hellre
smal spalt med luft runt än text som ligger an mot kanten.

Mellan två block på startsidan är avståndet 46 pixlar och en hårfin linje i
`#E6DDD4`. Linjen gör mer för känslan av ordning än en färgad platta gör.

Ingenting på sajten har rundade hörn större än 3 pixlar. Knappar och fält får 2
pixlar. Kort får 0. Rundade hörn drar mot app, raka drar mot tryck, och vi vill
åt tryck.

Skuggor används en gång, på kort som ligger på panelfärg, och då mycket svagt:
`0 1px 2px rgba(46, 46, 46, .06)`.

## Logotypen

### I sidhuvudet

Logotypen ligger till vänster i sidhuvudet, som länk till startsidan.

- Den liggande varianten, höjd 26 pixlar på dator och 22 på telefon
- Version **utan taglinen**, alltså bara ordbilden ÅBERG&CO
- Frizon enligt manualen: minst höjden på bokstaven G i ÅBERG, åt alla håll.
  Vid 26 pixlars logotyp blir det ungefär 14 pixlar
- Till höger om frizonen, med en lodrät linje emellan, står ordet
  **Salongsledarskap** i Montserrat 600, 0,95 rem, i `#2E2E2E`

Manualen säger att den liggande logotypen med fördel alltid används med
taglinen. Här görs ett undantag, och skälet är storleken. Vid 26 pixlars höjd
blir taglinen omkring 2 pixlar hög och går inte att läsa. En oläslig tagline
tjänar varumärket sämre än ingen alls. Hela lockupen med tagline finns i stället
i sidfoten, där den är läsbar.

Ordningen är avsiktlig. Åberg & Co är avsändaren, Salongsledarskap är
publikationen. Precis som ett förlag står före en tidskrifts namn.

Sidhuvudet är `position: sticky`, har grundens bakgrund och en linje undertill i
`#E6DDD4`. Ingen skugga.

### I sidfoten

Sidfoten är den enda platsen där hela lockupen används, alltså ordbilden **med**
taglinen Ledarskap Utveckling Coaching.

- Bredd 180 pixlar
- Placerad överst till vänster i sidfotens första kolumn
- Under den, den korta texten om vem som skriver

### Filformat

Fyra filer ligger i `bilder/`, gjorda av `scripts/logotyp.py` ur originalet i
`bilder/original/aberg-co-logotyp.png`.

| Fil | Innehåll |
|---|---|
| `aberg-co` | Ordbilden, till sidhuvudet |
| `aberg-co-morkt` | Samma, ljus, till mörkt läge |
| `aberg-co-tagline` | Hela lockupen, till sidfoten |
| `aberg-co-tagline-morkt` | Samma, ljus, till mörkt läge |

Varje fil finns som png och webp. I den ljusa varianten byts manualens
accentgrå mot `#F2EBE1`. Bärnstenen i &CO står kvar, den syns bra mot mörkt.
Antikaliseringen ligger i alfakanalen, så färgbytet blir rent.

Originalet är 392 pixlar brett, vilket räcker gott till 26 pixlars höjd i
sidhuvudet och 180 pixlars bredd i sidfoten, även på skärmar med hög upplösning.
Punktformat i stället för svg är ett medvetet val av praktiska skäl: eps-filerna
går inte att göra om till svg utan Illustrator eller Inkscape. Får du fram en
svg någon gång byter du bara ut filerna och behåller namnen.

## Bilder

**Inga stockbilder. Aldrig.** En bild på en anonym leende kvinna i en salong gör
sajten mindre trovärdig, inte mer.

Det som får finnas:

- Fotografierna av Maria från Louise Ernerhav, de som redan ligger i `bilder/`
- Diagram och tabeller som förklarar något, ritade i sajtens egna färger
- Ingenting annat

En artikel behöver ingen bild. De flesta artiklar på sajten har ingen, och det
är rätt. En text som är värd att läsa behöver inte en bild för att verka värd att
läsa.

Porträttet i bylinen är runt, 34 pixlar, och det är den enda runda formen på
sajten.

Fotografier läggs alltid ut med `<picture>` och webp först, som i dag.

## Vad som inte följer med från abergco.se

Det här är avsiktligt bortvalt, inte glömt.

**De rundade organiska formerna i guld och beige.** De är gjorda för en säljsida
där de fyller tomrum bakom rubriker. På en textsida konkurrerar de med texten.
Luften gör samma jobb bättre.

**Den stora gula ytan.** Gult i stora fält blir tröttsamt att läsa mot och
signalerar kampanj. Guldet finns kvar, men som en tunn linje och som bakgrund i
enstaka block.

**Den peppande tonen i knappar.** Knapptexter på den här sajten säger vad som
händer. Läs artikeln. Öppna verktyget. Boka ett samtal. Inte Kom igång nu.

**Testimonials som bildkarusell.** Kundcasen är artiklar med siffror, inte citat
som glider förbi.

## Så vet vi att det blev rätt

Fyra kontroller innan något publiceras.

1. Öppna en artikel på telefon i solljus. Går varje ord att läsa.
2. Slå på mörkt läge. Ser sidan gjord ut, inte inverterad.
3. Skriv ut en artikel. Ser den ut som en sida ur en tidskrift.
4. Visa startsidan för någon som känner till abergco.se. Säger hon att det är
   samma bolag utan att du frågar.

## Beslut

Fattade 2026-09-02.

**Den gula accenten delas i två.** `#F6A313` till ren grafik, `#8A5A05` till allt
som ska läsas. Avvikelsen från varumärket är godkänd, och skälet är kontrasten.

**Åberg & Co står först i sidhuvudet**, sedan en tunn linje och ordet
Salongsledarskap. Avsändaren före publikationen.

**Sajten har mörkt läge** och följer läsarens systeminställning.

## Öppna frågor

1. **Taglinen i sidhuvudet.** Manualen säger att den liggande logotypen med
   fördel alltid används med tagline. Förslaget här är att utelämna den i
   sidhuvudet, eftersom den blir oläslig i den storleken, och behålla hela
   lockupen i sidfoten. Det behöver ditt ja.
2. **Logotyp i svg.** Jag gör två svg-filer ur eps-filerna, en utan tagline till
   sidhuvudet och en med till sidfoten, om du inte redan har dem.
