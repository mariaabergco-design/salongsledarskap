#!/usr/bin/env python3
"""Gör sajtens logotypfiler ur originalet i bilder/original.

Kör:  python3 scripts/logotyp.py

Originalet är den liggande logotypen med tagline. Skriptet klipper ut bara
ordbilden till sidhuvudet, behåller hela lockupen till sidfoten, och gör en
ljus variant av båda till mörkt läge. Grå ÅBERG blir ljus, bärnstenen i &CO
står kvar, den syns bra mot mörkt.

Antikaliseringen ligger i alfakanalen och inte i färgen, så färgbytet blir rent.

Vill du någon gång ha logotypen som svg går den att göra ur eps-filerna i
ÅbergCO Logo.zip med Illustrator eller Inkscape. Då byter du bara ut filerna
här och behåller namnen.
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KALLA = os.path.join(ROOT, "bilder", "original", "aberg-co-logotyp.png")
UT = os.path.join(ROOT, "bilder")

# manualens accentgrå, den färg ÅBERG och taglinen är satta i
GRA = (135, 135, 135)
# ersättningsfärg i mörkt läge, samma som textfärgen där
LJUS = (242, 235, 225)


def gragrans(p):
    """Sant för en pixel som hör till den grå delen av logotypen."""
    r, g, b, a = p
    return a > 0 and max(abs(r - GRA[0]), abs(g - GRA[1]), abs(b - GRA[2])) < 40


def ljus_variant(bild):
    ut = bild.copy()
    px = ut.load()
    b, h = ut.size
    for y in range(h):
        for x in range(b):
            p = px[x, y]
            if gragrans(p):
                px[x, y] = (LJUS[0], LJUS[1], LJUS[2], p[3])
    return ut


def spara(bild, namn):
    bild.save(os.path.join(UT, namn + ".png"), "PNG", optimize=True)
    bild.save(os.path.join(UT, namn + ".webp"), "WEBP", quality=92, method=6)
    return bild.size, os.path.getsize(os.path.join(UT, namn + ".png"))


def rader_med_innehall(bild):
    """Ger listan över y-värden där något är ritat."""
    px = bild.load()
    b, h = bild.size
    return [y for y in range(h)
            if any(px[x, y][3] > 40 for x in range(0, b, 2))]


if __name__ == "__main__":
    hel = Image.open(KALLA).convert("RGBA")
    fyllda = rader_med_innehall(hel)

    # taglinen sitter efter den största luckan i höjdled
    luckor = [(fyllda[i + 1] - fyllda[i], i) for i in range(len(fyllda) - 1)]
    storsta, index = max(luckor)
    if storsta < 4:
        raise SystemExit("Hittar ingen lucka mellan ordbild och tagline")
    ordbild = hel.crop(hel.crop((0, 0, hel.width, fyllda[index] + 1)).getbbox())
    hela = hel.crop(hel.getbbox())

    for namn, bild in [("aberg-co", ordbild),
                       ("aberg-co-morkt", ljus_variant(ordbild)),
                       ("aberg-co-tagline", hela),
                       ("aberg-co-tagline-morkt", ljus_variant(hela))]:
        matt, storlek = spara(bild, namn)
        print("%-24s %4dx%-4d %5d B" % (namn, matt[0], matt[1], storlek))
