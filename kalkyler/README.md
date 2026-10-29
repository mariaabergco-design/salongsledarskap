# Kalkylerna

Den här mappen publiceras av Vercel på salongskalkylen.vercel.app.

| Fil | Sida |
|---|---|
| `index.html` | Salongskalkylen, för salongsägare |
| `start/index.html` | Salongskalkylen Start, den avskalade versionen för första mötet med en salongsägare |
| `frisor/index.html` | Frisörkalkylen, för anställda frisörer |
| `veckoschema/index.html` | Veckoschemat, där salongsledaren bygger sin vecka från 06 till 23 med färdiga och egna block och ser timmarna per vecka och månad |
| `hushallskalkyl/index.html` | Hushållskalkylen, privatekonomi för salongsledaren: läser in kontoutdrag från skärmdump, pdf eller inklistrad text, räknar månadens verkliga över- eller underskott, håller utläggsrapporten till bolaget och en hushållsbudget med lönen salongen måste bära |
| `mastermind/index.html` | Master Mind våren 2027, programsidan för Mastermind-gruppen med Master Mind, Office Hours, Gruppcoaching och Boot Camp |
| `api/las.js` | Serverfunktion som läser fakturor och kassalistor med Claude |

Sidorna redigeras som artefakter på claude.ai. Den färdiga html-filen läggs
här, och varje push till `main` bygger om Vercel-sidan. Mappen ingår inte i
sajtbygget för salongsledarskap.se.

## Fakturasorteraren utan Claude-konto

På salongskalkylen.vercel.app läses fakturorna av funktionen `api/las.js`
med Åberg & Co:s egen nyckel, så salongsledaren behöver inget Claude-konto.
Funktionen kräver två miljövariabler i Vercel (Settings, Environment
Variables). Variablerna gäller först efter nästa bygge: gör Redeploy i Vercel
eller pusha valfri ändring till `main`. Ta aldrig bort det bygge som är märkt
Production under Deployments: då slutar adressen fungera tills ett nytt bygge
gjorts.

| Variabel | Innehåll |
|---|---|
| `ANTHROPIC_API_KEY` | API-nyckel från console.anthropic.com. Ligger bara i Vercel, aldrig i repot eller i sidan. |
| `SALONGSKOD` | Koden salongsledaren skriver in på sidan. Flera koder skiljs med kommatecken, så varje salong kan få en egen kod som går att ta bort. |

Sidan sparar salongskoden i webbläsaren och skickar den som rubriken
`x-salongskod` vid varje läsning. Fel kod ger svaret 401. Varje läsning
loggas i Vercel med antal tecken, bilder och tokens, så kostnaden går att
följa där. Hushållskalkylen använder samma funktion och samma salongskod för att läsa
skärmdumpar av kontoutdrag. Inklistrade rader läses i webbläsaren när ingen kod
finns. Inne på claude.ai används i stället besökarens eget Claude-konto,
när kontot tillåter det.
