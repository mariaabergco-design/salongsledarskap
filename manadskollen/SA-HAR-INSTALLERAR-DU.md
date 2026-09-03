# Så här installerar du Månadskollen

En gång, sedan aldrig mer. Räkna med en halvtimme.

## 1. Skapa kalkylarket

1. Gå till [sheets.new](https://sheets.new) och döp arket till **Månadskollen**.
2. Välj **Tillägg → Apps Script** i menyn.
3. Radera koden som ligger där, öppna `manadskollen/apps-script.gs` i det här
   repot, kopiera hela innehållet och klistra in det.
4. Spara, med diskettknappen eller cmd+S.

## 2. Kör igång det

1. Välj funktionen `installera` i listan högst upp och tryck **Kör**.
2. Google frågar om lov första gången. Godkänn. Kommer en varning om att appen
   inte är verifierad: klicka **Avancerat** och sedan **Fortsätt till
   Månadskollen**. Det är ditt eget skript, du ger det tillgång till ditt eget ark.
3. En ruta visar din **coachnyckel**. Spara den i din lösenordshanterare. Den är
   det enda som skyddar coachvyn.

Har du tappat bort nyckeln: kör funktionen `visaCoachnyckel` så visas den igen.

## 3. Lägg in kunderna

Öppna fliken **Kunder** i kalkylarket och fyll på under rubrikraden. Filen
`manadskollen/kunder.csv` är ett utkast med de kunder jag kunde hitta i
Circleback. Öppna den, kontrollera den, och klistra in de rader som stämmer.

| Kolumn | Vad du skriver |
|---|---|
| `kod` | Kundens del av länken. Ska vara svår att gissa. Byt aldrig en kod efter att kunden börjat svara, då tappar hon sin historik |
| `namn` | Som du tilltalar henne |
| `salong` | Salongens namn, får vara tomt |
| `mejl` | Dit månadsmailet går |
| `sokord` | Namn som hittar hennes möten i Circleback, mellanslag emellan. Ta med felstavningar: `Rebecca Rebecka Josefsson` |
| `aktiv` | `ja` eller `nej`. `nej` göms i coachvyn men svaren finns kvar |
| `mal_*` | Hennes egna målnivåer. Coachvyn jämför mot dem, aldrig mot en annan kund |

## 4. Publicera webbappen

1. I Apps Script: **Distribuera → Ny distribution**.
2. Välj typ **Webbapp**.
3. Kör som: **Jag**. Vem har åtkomst: **Alla**.
4. Klicka **Distribuera** och kopiera adressen som slutar på `/exec`.

"Alla" låter mer öppet än det är. Adressen räcker inte för att komma åt något —
allt kräver antingen en kundkod eller coachnyckeln. Men adressen ska ändå inte
ligga någon annanstans än där den behövs.

## 5. Koppla ihop sidorna med arket

Öppna `manadskollen/konfig.js` i repot och klistra in adressen:

```js
window.MANADSKOLLEN_API = "https://script.google.com/macros/s/AKfycb…/exec";
```

Kör sedan `python3 scripts/bygg-sajt.py` och lägg upp ändringen som vanligt.

## 6. Prova själv först

Gå till `salongsledarskap.se/manadskollen/formular.html?k=DINKOD` med en egen
testrad i Kunder-fliken. Fyll i, skicka, och kontrollera att raden hamnar i
fliken **Svar**. Gör det innan du skickar länken till någon kund.

Öppna sedan `salongsledarskap.se/manadskollen/coachvy.html` och klistra in
coachnyckeln. Den sparas i webbläsaren, så du gör det en gång per enhet.

## 7. Skicka ut länkarna

Varje kund får sin egen adress:

```
https://salongsledarskap.se/manadskollen/formular.html?k=HENNES-KOD
```

Be henne spara den. Samma länk fungerar varje månad och visar hennes egen
utveckling när hon skickat in.

Formuläret gäller alltid månaden som gick. Ska någon fylla i en äldre månad i
efterhand lägger du till månaden i länken:

```
…/formular.html?k=HENNES-KOD&p=2026-07
```

Bygger du baslinjen ur gamla mötesanteckningar går det fortare att skriva raderna
direkt i fliken **Svar** i kalkylarket. Kolumnen `period` ska stå som text,
`2026-07`, inte som ett datum.

## Om du ändrar i koden sedan

Ändrar du i `apps-script.gs` måste du klistra in den nya koden i Apps Script och
sedan välja **Distribuera → Hantera distributioner**, klicka pennan och välja
**Ny version**. Gör du bara "Spara" händer ingenting med den publicerade
adressen.

Ändrar du i html-filerna räcker det att köra byggskriptet och pusha.

## Om något inte fungerar

| Det här ser du | Det här är det |
|---|---|
| "Formuläret är inte kopplat än" | `konfig.js` är tom, eller så har du inte byggt om sajten |
| "Länken saknar din kod" | `?k=` saknas i adressen |
| Kod som borde stämma avvisas | Koden i Kunder-fliken har ett mellanslag i sig, eller så har du inte distribuerat om efter att du ändrade koden |
| Coachvyn säger att nyckeln är fel | Kör `visaCoachnyckel` i Apps Script och jämför |
| Svaren hamnar inte i arket | **Distribuera → Hantera distributioner → Ny version**. Nästan alltid det |
