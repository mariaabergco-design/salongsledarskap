# Baslinjen — vad som faktiskt gick att hämta

Genomgång av alla coachmöten i Circleback från juni till 3 september 2026, kund
för kund, för att fylla trenderna med data innan formuläret börjat användas.

Kort svar: **fyra rader, sex tal, tre kunder.** Mötesanteckningarna innehåller
massor av mål, branschsnitt och tal om enskilda medarbetare, men mycket få
mätvärden för en salong och en månad. Det är den ärliga skörden.

Raderna ligger i `baslinje.csv` och klistras in i fliken **Svar**. Varje rad är
märkt i kolumnen `kalla`, och coachvyn skriver ut en varning på en sådan rad.

## Det som gick att hämta

### Sara — två hela månader, det bästa fyndet

Ur *Sara & Maria – Mastermind augusti*, 25 augusti 2026, avsnittet
"Produktförsäljning och ombokningsgrad":

> Salongens produktförsäljning låg på **4%** i juli och **14%** i augusti — målet
> är **30%**, satt av Linnea.
> Ombokningsgraden var **39%** i juli och **34%** i augusti — **34%** är bra på
> gruppnivå.

Det ger två rader med två tal vardera, juli och augusti. Sara är den enda kund
som har en riktig rörelse att visa från dag ett.

Notera att du på samma möte tyckte att 30 % är högt men inte omöjligt, och
föreslog en skala: 20–25 % grönt, 30 % guldstjärna. Målet i kundregistret är satt
till 30 eftersom det är det uttalade målet, men coachvyn kommer flagga henne varje
månad tills hon är där. Vill du hellre mäta mot 25, ändra `mal_produkt` för henne.

### Rebecca — ett tal, från i våras

Ur *Rebecca Josefsson: Coaching 60 min*, 8 juni 2026:

> Beläggningsgraden i november 2025 var **59%** mot **79%** i maj 2026.

79 % för maj 2026 är med. Novembersiffran ligger utanför — 2025 är för långt bort
för att höra hemma i samma kurva, och november är dessutom den månad hela
höstprojektet handlar om att lyfta.

### Verdi — ett tal, och det är en uppskattning

Ur *Verdi och Maria*, 9 juni 2026:

> Ombokning är högsta prioritet — idag lämnar uppskattningsvis ~**90%** av
> kunderna utan en ny tid bokad.

Det ger ombokningsgrad omkring 10 % i juni. Ordet är "uppskattningsvis", och
raden är märkt `uppskattning` av just det skälet. Den duger som utgångspunkt att
peka på, inte som mätvärde att räkna procentuell förändring från.

## Det som inte gick att hämta, och varför

| Kund | Vad som finns i augustimötena | Varför det inte blev en rad |
|---|---|---|
| **Christina** | Nedtrappning till 3 kundagar, mål 80 % beläggning och 1 000 kr/timme, medarbetaren Marias omsättning | Planer och mål framåt, inga mätvärden bakåt. Medarbetarens siffror är inte salongens |
| **Matilda** | Bistrons ekonomi i detalj, hennes egen utmattning | Bistron är en annan verksamhet än salongen. Utmattningen är ett tydligt tecken men inte ett tal — jag vägrar sätta en siffra på fråga 8 åt henne |
| **Maja** | Snittpris 1 200 kr per färgbehandling, medarbetarnas omsättning var för sig | Per behandling och per medarbetare, inte per salong och månad |
| **Elin Eliasson Holm** | Bokslut på 12 000 kr minus | Helårsresultat, inte en månad |
| **Ebba (Nettans)** | Att hon tackar ja till kunder på admintid | Beskrivning, inget tal |

Att det inte finns mer är inte ett fel i anteckningarna. Ni pratar ledarskap på
mötena, inte månadsstatistik — vilket är hela poängen med att formuläret behövs.

## Mål som gick att hämta

De här är uttalade i mötena och är inlagda i `kunder.csv`. De ersätter mina
generiska förslag, som var samma för alla.

| Kund | Mål | Källa |
|---|---|---|
| Sara | Produktförsäljning **30 %** | Mastermind 25 augusti, målet satt av Linnea |
| Rebecca | Ombokningsgrad **40 %**, minimum 25–30 % | Coaching 7 augusti, du satte det på mötet |
| Christina | Beläggning **80 %**, 1 000 kr/timme | Coaching 18 augusti, målbild till uppstartsmötet |

Övriga har kvar mina generiska nivåer. Gå igenom dem innan du skickar ut
länkarna — Christina som trappar ner mot pension ska inte mätas mot samma
timmar bakom stolen som Verdi som just startat ett program.

## Tre namnkrockar som måste hanteras innan mailen går ut

Det här är den viktigaste upptäckten i genomgången, och den är allvarligare än
den tunna baslinjen.

**Två Ebbor.** Ebba är mastermind-kund på Nettans tillsammans med Linda. Ebba är
*också* anställd hos Rebecca, och i mötet den 7 augusti står det att hon knappt
bokat om en enda kund i sommar och att grundproblemet är osäkerhet hon inte
erkänner. Ett sökord som bara är `Ebba` skulle kunna lägga den meningen i ett
mail till fel person. Sökorden för Nettans är därför satta till `Nettans` och
`Linda`, aldrig till `Ebba` ensamt.

**Tre Eliner.** Elin Eliasson Holm är kund. Elin är också hudterapeut hos Maja,
och en Elin nämns på Nettans. Sökordet är därför `Eliasson`, inte `Elin`.

**Två Matildor.** Matilda Thegerström är kund. Matilda är också namnet på en
medarbetare på Åberg & Co:s egen salong som vill bli resortledare på Böda Sand.
Sökordet är `Thegerström`.

Samma sak gäller `Maria`, som är du själv, Christinas medarbetare och en deltagare
i gruppcoachingen. Och `Sara`, som förekommer som headhuntingkandidat i ett möte
med Cissi. Sökorden i registret är skärpta efter det, men regeln i `mailmall.md`
gäller före allt annat: **är det oklart om ett möte är hennes, tas det inte med.**

## Snabbaste vägen till en riktig baslinje

Genomgången ovan tog en stund och gav sex tal. Att be kunderna själva fylla i juli
och augusti tar tio minuter per person och ger fullständiga rader.

Länken finns redan:

```
…/formular.html?k=HENNES-KOD&p=2026-07
…/formular.html?k=HENNES-KOD&p=2026-08
```

Gör det på nästa coachmöte, med henne, medan ni ändå sitter ner. Då vet du också
att hon hämtat talen på rätt ställe i bokningssystemet, vilket är hela skillnaden
mellan en trend och brus.
