#!/usr/bin/env python3
"""Hämtar hem Montserrat och Playfair Display till repot.

Kör:  python3 scripts/hamta-typsnitt.py

Sajten hämtade tidigare typsnitten från Google när sidan laddades. Då fick
Google besökarens ip-adress. Nu ligger filerna i typsnitt/ och laddas från din
egen sajt i stället. Sidan blir också något snabbare.

Skriptet behöver internet. Det körs en gång, och sedan bara om du vill byta
typsnitt eller vikt. Filerna som laddas ner ska checkas in i repot.

Typsnitten är licensierade under SIL Open Font License, som tillåter att de
används och distribueras så här. Licenstexten hamnar i typsnitt/LICENSE.txt.
"""

import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UT = os.path.join(ROOT, "typsnitt")

ADRESS = ("https://fonts.googleapis.com/css2?"
          "family=Montserrat:wght@400;500;600;700&"
          "family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap")

# Google delar upp varje typsnitt i tecken-uppsättningar. Svenska klarar sig på
# de två latinska, resten är kyrilliska och vietnamesiska och kan hoppas över.
BEHALL = ("latin", "latin-ext")

WEBBLASARE = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

LICENSER = {
    "OFL-montserrat.txt":
        "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt",
    "OFL-playfair-display.txt":
        "https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/OFL.txt",
}


def hamta(adress, ua=WEBBLASARE):
    beg = urllib.request.Request(adress, headers={"User-Agent": ua})
    with urllib.request.urlopen(beg, timeout=60) as svar:
        return svar.read()


def blocken(css):
    """Delar upp Googles stilmall i (teckenuppsattning, block)."""
    delar = re.split(r"/\* ([a-z-]+) \*/", css)
    return list(zip(delar[1::2], delar[2::2]))


def namn(block, uppsattning):
    familj = re.search(r"font-family: '([^']+)'", block).group(1)
    vikt = re.search(r"font-weight: (\d+)", block).group(1)
    stil = re.search(r"font-style: (\w+)", block).group(1)
    kort = familj.lower().replace(" ", "-")
    lutning = "-italic" if stil == "italic" else ""
    return "%s-%s%s-%s.woff2" % (kort, vikt, lutning, uppsattning)


if __name__ == "__main__":
    os.makedirs(UT, exist_ok=True)
    css = hamta(ADRESS).decode("utf-8")

    rader, hamtade = [], 0
    for uppsattning, block in blocken(css):
        if uppsattning not in BEHALL:
            continue
        fil = namn(block, uppsattning)
        kalla = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        vag = os.path.join(UT, fil)
        if not os.path.exists(vag):
            open(vag, "wb").write(hamta(kalla))
            hamtade += 1
        rader.append(block.strip().replace(kalla, fil))
        print("%-46s %6d kB" % (fil, os.path.getsize(vag) // 1024))

    stilmall = ("/* Typsnitt som ligger på sajten själv. Skapad av\n"
                "   scripts/hamta-typsnitt.py, redigera inte för hand. */\n\n"
                + "\n\n".join(rader) + "\n")
    open(os.path.join(UT, "typsnitt.css"), "w", encoding="utf-8").write(stilmall)

    for fil, adress in LICENSER.items():
        if not os.path.exists(os.path.join(UT, fil)):
            open(os.path.join(UT, fil), "wb").write(hamta(adress))

    print("\n%d filer hämtade, %d @font-face i typsnitt/typsnitt.css"
          % (hamtade, len(rader)))
