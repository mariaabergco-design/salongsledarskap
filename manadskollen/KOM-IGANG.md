# Kom igång

Allt är byggt och testat. Det som återstår är fyra saker som måste göras i en
webbläsare där du är inloggad — jag kör i en container utan webbläsare och når
varken ditt Google-konto eller ditt Resend-konto.

**Total tid: ungefär 20 minuter.** Sedan är det skarpt.

| # | Steg | Tid | Vem |
|---|---|---|---|
| 1 | Kalkylarket och Apps Script | 8 min | Du, eller Claude i Chrome |
| 2 | Publicera webbappen och skicka adressen till mig | 3 min | Du |
| 3 | Jag kopplar in adressen och publicerar | 2 min | Jag |
| 4 | Resend-konto och nyckel | 5 min | Du, eller Claude i Chrome |
| 5 | Testmailet | 1 min | Du, i coachvyn |

Steg 4 kan hoppas över i början. Utan Resend kopierar du mailen till din vanliga
inkorg som vanligt — allt annat fungerar ändå.

## Steg 1 och 2 — Google

**Vad steg 2 egentligen är.** Efter steg 1 ligger koden i ditt kalkylark, men
den har ingen adress. Formuläret på sajten måste kunna nå den, och att
distribuera som webbapp är det som ger den en adress. "Kör som: Jag" gör att
skriptet agerar med dina rättigheter så att det kommer åt ditt eget ark.
"Åtkomst: Alla" gör att adressen svarar på anrop utifrån, vilket krävs eftersom
kunderna öppnar formuläret från sajten — allt bakom adressen kräver ändå en
kundkod eller din coachnyckel. Resultatet är en lång adress som slutar på
`/exec`. Det är den jag behöver.

Öppna [sheets.new](https://sheets.new), döp arket till **Månadskollen**, och gå
till **Tillägg → Apps Script**. Radera koden som ligger där, klistra in hela
`manadskollen/apps-script.gs`, spara.

Välj funktionen `installera` och tryck **Kör**. Godkänn behörigheterna. Kommer en
varning om att appen inte är verifierad: **Avancerat → Fortsätt till
Månadskollen**. Det är ditt eget skript som får tillgång till ditt eget ark.

En ruta visar hur många kunder och baslinjerader som lagts in, och din
**coachnyckel**. Spara nyckeln i din lösenordshanterare.

Sedan: **Distribuera → Ny distribution → Webbapp**. Kör som **Jag**, åtkomst
**Alla**. Kopiera adressen som slutar på `/exec` och skicka den till mig här.

Kunderna och baslinjen läggs in automatiskt. Du behöver inte klistra in några
csv-filer — de ligger redan i skriptet.

### Uppdraget att klistra in i Claude i Chrome

Klistra in hela texten nedan. Den klarar både steg 1 och steg 2, och hämtar
koden själv från GitHub.

---

Jag ska installera ett Apps Script i ett Google-kalkylark. Följ stegen i
ordning. Stanna och fråga mig så fort något ser annorlunda ut än jag beskrivit
— gissa inte.

**Koden du ska använda** ligger här, öppna den och kopiera hela filen:
https://github.com/mariaabergco-design/salongsledarskap/blob/claude/salon-coach-monthly-form-8kxp0b/manadskollen/apps-script.gs
Använd knappen som kopierar råtexten, så att inga radnummer följer med.

**Steg 1 — kalkylarket**
1. Har jag redan ett kalkylark som heter "Månadskollen"? Kolla på
   drive.google.com. Finns det, öppna det. Finns det inte, gå till sheets.new
   och döp det till Månadskollen.
2. Öppna menyn Tillägg → Apps Script.
3. Ligger det redan kod där som innehåller ordet STARTKUNDER, är steg 1 klart
   — hoppa till steg 2. Annars: markera allt i redigeraren, radera, och klistra
   in koden du kopierade. Spara med diskettknappen.
4. Välj funktionen "installera" i listan högst upp och tryck Kör.
5. Google frågar om behörighet. Godkänn med mitt konto. Kommer en röd varning
   om att appen inte är verifierad: klicka Avancerat och sedan "Fortsätt till
   Månadskollen". Det är mitt eget skript som får tillgång till mitt eget ark.
6. En ruta visar hur många kunder och baslinjerader som lagts in, plus en
   coachnyckel. Läs upp allt som står i rutan för mig.

**Steg 2 — publicera**
7. Klicka Distribuera uppe till höger, sedan Ny distribution.
8. Klicka kugghjulet vid "Välj typ" och välj Webbapp.
9. Sätt "Kör som" till Jag, och "Vem har åtkomst" till Alla.
10. Klicka Distribuera.
11. Kopiera webbappens adress — den är lång och slutar på /exec — och ge den
    till mig.

**Om något går fel**
- Hittar du inte Distribuera-knappen: koden är inte sparad. Spara först.
- Säger den att behörighet saknas: kör funktionen installera en gång till och
  godkänn.
- Ser du en gammal distribution i stället för en ny: välj Distribuera → Hantera
  distributioner, klicka pennan, och välj Ny version.

Skriv aldrig ut coachnyckeln någon annanstans än till mig i den här chatten.

---

När du fått adressen: **skicka bara `/exec`-adressen till mig i Claude Code.**
Coachnyckeln behåller du själv — jag behöver den inte, och den ska inte ligga i
en chatt mer än nödvändigt.

## Steg 4 — Resend

Med Resend skickas månadsmailen direkt från coachvyn i stället för att du
kopierar dem till din inkorg. Åtta mail i månaden blir åtta knapptryck.

1. Skapa konto på [resend.com](https://resend.com).
2. Under **API Keys**, skapa en nyckel. Den börjar med `re_`.
3. Gå till Apps Script, kör funktionen `sattResendnyckel` och klistra in
   nyckeln i rutan.

**Nyckeln ska aldrig hamna i den här chatten och aldrig i repot.** Den lever i
skriptets egna inställningar, där bara du och skriptet ser den.

Innan du verifierat en egen domän hos Resend släpper de bara igenom mail till
din egen kontoadress. Det räcker för testet. Vill du sedan att mailen kommer
från `maria@abergco.se` lägger du in domänen `abergco.se` hos Resend, lägger till
dns-posterna de ger dig hos Loopia, och kör `sattAvsandare` med
`Maria Åberg <maria@abergco.se>`.

## Steg 5 — testmailet

Öppna coachvyn, klistra in coachnyckeln, och klicka **Skicka ett mail**. Välj
**Maria (test)** i listan — den raden ligger redan i registret med din egen
adress. Ämnesraden och brödtexten är förifyllda. Tryck **Skicka**.

Kommer det fram är hela kedjan bevisad: formulär, lagring, coachvy och utskick.

Ta bort raden **Maria (test)** ur fliken Kunder när du är klar, eller sätt
`aktiv` till `nej` så försvinner den ur coachvyn.

## Sedan är det skarpt

Ordningen på det första riktiga varvet:

1. Gå igenom fliken **Kunder**. Mejladresser saknas för sex av åtta, och
   målnivåerna är mina gissningar för fem av dem. Det tar tio minuter och är det
   enda som står mellan dig och ett system som mäter rätt saker.
2. Ge varje kund hennes länk. Formuleringen finns i `ikapp-lankar.md`.
3. Be dem fylla i juli och augusti i efterhand, helst med dig på ett möte.
   Då har alla två punkter och en kurva från dag ett.
4. Den 3 oktober går det första ordinarie utskicket, för september.

Efter det förbättrar du systemet i stället för att bygga det. Frågorna ska inte
ändras — vill du lägga till något, lägg till en elfte fråga. Det som däremot ska
justeras löpande är målnivåerna per kund, vilka artiklar som föreslås, och
ordningen i mailet.
