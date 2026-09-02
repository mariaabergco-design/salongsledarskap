#!/usr/bin/env python3
"""Komprimerar sajtens bilder från bilder/original till bilder/.

Kör:  python3 scripts/komprimera.py

Varje bild sparas i tre format: en vanlig jpeg, en mindre webp för moderna
webbläsare, och för porträttet dessutom en liten kvadratisk avatar som används
vid bylinen i varje artikel.

Originalen rörs aldrig.
"""

import os

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KALLA = os.path.join(ROOT, "bilder", "original")
UT = os.path.join(ROOT, "bilder")

# källfil, målnamn, längsta sida i pixlar
BILDER = [
    ("Louise_ernerhav_foto-6421.jpg", "maria-portratt", 1600),
    ("Louise_ernerhav_foto-6430.jpg", "maria-pa-golvet", 1400),
    ("Louise_ernerhav_foto-6437.jpg", "maria-skoljning", 1400),
]

# porträttet blir dessutom en liten rund avatar
AVATAR = ("Louise_ernerhav_foto-6421.jpg", "maria-avatar", 160)


def spara(kalla, namn, langsta, kvalitet=78):
    bild = Image.open(os.path.join(KALLA, kalla))
    bild = ImageOps.exif_transpose(bild).convert("RGB")
    bild.thumbnail((langsta, langsta), Image.LANCZOS)

    jpg = os.path.join(UT, namn + ".jpg")
    bild.save(jpg, "JPEG", quality=kvalitet, optimize=True, progressive=True)

    webp = os.path.join(UT, namn + ".webp")
    bild.save(webp, "WEBP", quality=kvalitet - 6, method=6)

    return bild.size, os.path.getsize(jpg), os.path.getsize(webp)


def avatar(kalla, namn, sida):
    """Kvadratisk beskärning runt övre delen av bilden, där ansiktet sitter."""
    bild = Image.open(os.path.join(KALLA, kalla))
    bild = ImageOps.exif_transpose(bild).convert("RGB")
    b, h = bild.size
    kant = min(b, h)
    vanster = (b - kant) // 2
    ovre = max(0, int(h * 0.06))
    bild = bild.crop((vanster, ovre, vanster + kant, min(h, ovre + kant)))
    bild = bild.resize((sida, sida), Image.LANCZOS)
    bild.save(os.path.join(UT, namn + ".jpg"), "JPEG", quality=82, optimize=True)
    bild.save(os.path.join(UT, namn + ".webp"), "WEBP", quality=76, method=6)
    return os.path.getsize(os.path.join(UT, namn + ".jpg"))


if __name__ == "__main__":
    print(f"{'bild':22} {'mått':>12} {'jpeg':>9} {'webp':>9}  före")
    totalt_fore = totalt_efter = 0
    for kalla, namn, langsta in BILDER:
        fore = os.path.getsize(os.path.join(KALLA, kalla))
        matt, jpg, webp = spara(kalla, namn, langsta)
        totalt_fore += fore
        totalt_efter += jpg
        print(f"{namn:22} {matt[0]:>5}x{matt[1]:<6} {jpg//1024:>6} kB {webp//1024:>6} kB  "
              f"{fore//1024} kB")

    a = avatar(*AVATAR)
    print(f"{'maria-avatar':22} {160:>5}x{160:<6} {a//1024:>6} kB")
    print(f"\nTotalt {totalt_fore//1024} kB före, {totalt_efter//1024} kB efter "
          f"({100 - round(100 * totalt_efter / totalt_fore)} procent mindre)")
