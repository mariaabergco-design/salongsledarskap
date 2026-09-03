# Så publicerar du de nya sidorna

Du behöver inte röra Loopia. Loopia äger bara adressen salongsledarskap.se.
Själva sajten ligger på GitHub, och där finns en robot som bygger om sajten
varje gång något ändras i mappen. Ditt jobb är alltså att lägga in de nya
filerna i GitHub. Resten sköter sig självt.

Räkna med tjugo minuter. Du kan inte förstöra något: allt som ligger där i dag
sparas, och går det fel kan vi backa.

---

## Innan du börjar

Ladda ner filpaketet jag skickade i chatten och packa upp det. Du får en mapp
som heter `export` med det här i:

- `style.css`
- `bygg-sajt.py`
- `verktyg-tokens.css`
- mappen `bilder` med tre foton
- den här filen och LADDA-UPP.md

Du behöver också de fyra verktygsfilerna. Säg till så skickar jag dem i samma
paket.

---

## Steg 1. Logga in på GitHub

Gå till **github.com** och logga in. Klicka dig in på ditt projekt
**mariaabergco-design/salongsledarskap**.

Det du ser är en lista med mappar: `artiklar`, `bilder`, `kundcase`, `scripts`,
`site`, `typsnitt`, `verktyg`. Ungefär som mappar på datorn.

---

## Steg 2. Lägg in den nya stilmallen

Stilmallen är filen som bestämmer färger, typsnitt och form på hela sajten.
Den nya ska ersätta den gamla.

1. Klicka på mappen **scripts**.
2. Klicka på filen **style.css** i listan.
3. Uppe till höger finns en penna. Klicka på den.
4. Markera allt som står i rutan och radera det. På Mac: klicka i rutan,
   tryck cmd+A och sedan backsteg.
5. Öppna `export/style.css` från paketet i en textredigerare, markera allt,
   kopiera.
6. Klistra in i rutan på GitHub.
7. Klicka på den gröna knappen **Commit changes** uppe till höger, och sedan
   **Commit changes** i rutan som dyker upp.

Nu börjar roboten jobba. Det märks inte än.

---

## Steg 3. Lägg in den nya sidmallen

Samma sak en gång till, men med en annan fil.

1. Gå tillbaka till mappen **scripts**.
2. Klicka på **bygg-sajt.py**, klicka på pennan.
3. Radera allt, klistra in innehållet i `export/bygg-sajt.py`.
4. **Commit changes** två gånger.

Den här filen bestämmer hur sidorna är uppbyggda: fotot bredvid rubriken på
startsidan, korten på verktygs- och kundcasesidan.

---

## Steg 4. Lägg in de tre fotona

1. Klicka på mappen **bilder**.
2. Uppe till höger: **Add file** och sedan **Upload files**.
3. Dra in de tre bilderna ur `export/bilder` i rutan:
   maria-kaffe.jpg, maria-klipper.jpg och maria-nara.jpg.
4. **Commit changes**.

Filnamnen måste vara precis dessa. Mallen letar efter dem vid namn.

---

## Steg 5. Lägg in de fyra verktygen

1. Klicka på mappen **verktyg**.
2. **Add file**, **Upload files**.
3. Dra in flaskhalstestet.html, veckomotet.html, nyckeltal.html och
   introduktion.html.
4. Rutan säger att filerna redan finns och kommer att skrivas över. Det är
   meningen.
5. **Commit changes**.

---

## Steg 6. Se att det gick bra

Klicka på fliken **Actions** högst upp i projektet. Där ligger en rad med
namnet på din senaste ändring.

- Snurrande gul cirkel: roboten jobbar. Vänta någon minut.
- Grön bock: klart. Sajten är uppdaterad.
- Rött kryss: något gick fel. Klicka in på raden, ta en skärmbild och skicka
  till mig, så säger jag vad det är.

När bocken är grön går du till **salongsledarskap.se** och laddar om sidan.
Ser den gammal ut, tryck cmd+shift+R (Mac) eller ctrl+F5 (Windows). Då hämtas
sidan på nytt i stället för ur webbläsarens minne.

---

## Om något ser fel ut

Ingenting är förlorat. GitHub sparar varje version. Skicka en skärmbild på det
som ser konstigt ut, så rättar vi det och du gör om steg 2 med en ny fil.

## Nästa gång

När du vill ändra en text i en artikel behöver du inte gå den här vägen. Texten
ligger i en fil som slutar på `.md` i mappen `artiklar`. Öppna den, klicka på
pennan, ändra, commit. Roboten bygger om sajten på ett par minuter.
