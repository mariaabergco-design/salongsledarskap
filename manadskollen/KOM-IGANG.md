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

### Vill du att Claude i Chrome gör det

Öppna Claude i Chrome, ha `apps-script.gs` uppe i en flik, och klistra in:

> Jag ska installera ett Apps Script i ett Google-kalkylark. Gör så här, och
> stanna och fråga mig om något ser annorlunda ut än beskrivet:
>
> 1. Gå till sheets.new och döp arket till "Månadskollen".
> 2. Öppna Tillägg → Apps Script.
> 3. Radera all kod i redigeraren och klistra in koden jag ger dig i nästa
>    meddelande. Spara.
> 4. Välj funktionen "installera" i listan högst upp och kör den. Godkänn
>    behörigheterna med mitt konto. Får du en varning om overifierad app,
>    välj Avancerat och fortsätt.
> 5. Läs upp rutan som visas — den innehåller en coachnyckel som jag behöver.
> 6. Gå till Distribuera → Ny distribution → Webbapp. Kör som: Jag. Åtkomst:
>    Alla. Distribuera, och ge mig adressen som slutar på /exec.
>
> Skriv aldrig ut coachnyckeln någon annanstans än till mig i den här chatten.

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
