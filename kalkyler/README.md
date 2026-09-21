# Kalkylerna

Den här mappen publiceras av Vercel på salongskalkylen.vercel.app.

| Fil | Sida |
|---|---|
| `index.html` | Salongskalkylen, för salongsägare |
| `frisor/index.html` | Frisörkalkylen, för anställda frisörer |
| `api/las.js` | Serverfunktion som läser fakturor och kassalistor med Claude |

Sidorna redigeras som artefakter på claude.ai. Den färdiga html-filen läggs
här, och varje push till `main` bygger om Vercel-sidan. Mappen ingår inte i
sajtbygget för salongsledarskap.se.

## Fakturasorteraren utan Claude-konto

På salongskalkylen.vercel.app läses fakturorna av funktionen `api/las.js`
med Åberg & Co:s egen nyckel, så salongsledaren behöver inget Claude-konto.
Funktionen kräver två miljövariabler i Vercel (Settings, Environment
Variables), och Vercel måste byggas om efter att de lagts in:

| Variabel | Innehåll |
|---|---|
| `ANTHROPIC_API_KEY` | API-nyckel från console.anthropic.com. Ligger bara i Vercel, aldrig i repot eller i sidan. |
| `SALONGSKOD` | Koden salongsledaren skriver in på sidan. Flera koder skiljs med kommatecken, så varje salong kan få en egen kod som går att ta bort. |

Sidan sparar salongskoden i webbläsaren och skickar den som rubriken
`x-salongskod` vid varje läsning. Fel kod ger svaret 401. Varje läsning
loggas i Vercel med antal tecken, bilder och tokens, så kostnaden går att
följa där. Inne på claude.ai används i stället besökarens eget Claude-konto,
när kontot tillåter det.
