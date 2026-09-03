# Så byter du utseende på hela sajten

Sajten byggs av `scripts/bygg-sajt.py` ur markdown-filerna, och allt utseende
ligger i `scripts/style.css`. Därför behöver inga artiklar, verktyg eller
kundcase skrivas om. Byt stilmallen, kör bygget, klart.

## 1. Byt stilmall

Kopiera `export/style.css` över `scripts/style.css` i repot.

## 2. Typsnitt

Inget att göra. Sajten behåller Montserrat och Playfair Display, som redan
ligger i `typsnitt/` och laddas från din egen sajt.

## 3. Verktygen

De fyra verktygen har egna stilmallar inbakade i sina html-filer och följer
alltså inte med `style.css`. Byt ut `:root`-blocket och de två mörka blocken
högst upp i varje fil mot innehållet i `export/verktyg-tokens.css`. Då får de
samma färger, typsnitt och rundade hörn som resten av sajten, utan att
räknandet eller sparandet i webbläsaren påverkas.

## 4. Sidmallar och nya foton

Kopiera `export/bygg-sajt.py` över `scripts/bygg-sajt.py`. Den bygger nu
startsidan med foto bredvid rubriken, artikellistan med foto, och verktyg och
kundcase som kort i stället för listor.

Lägg de tre bilderna i `export/bilder/` i repots `bilder/`-mapp. Namnen
måste vara maria-kaffe.jpg, maria-klipper.jpg och maria-nara.jpg, eftersom
mallen letar efter dem. Kör gärna `python3 scripts/komprimera.py` efteråt om
det skriptet gör webp-varianter.

## 5. Bygg och publicera

    python3 scripts/bygg-sajt.py

Ladda sedan upp innehållet i `site/` till Loopia.
