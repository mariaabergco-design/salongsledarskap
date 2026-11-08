#!/usr/bin/env python3
"""Bygger kalenderfilerna för Mastermind-sidan.

Läser tillfällena ur tabellerna i mastermind/index.html (raderna med
data-date, data-typ, data-start, data-slut och data-titel) och skriver en
.ics-fil per program plus en med allt till mastermind/kalender/.

Deltagarna prenumererar på filerna via sidan, så en ändring i tabellerna
slår igenom i deras kalendrar när filerna byggts om och pushats.

Kör efter varje ändring av datum:  python3 scripts/bygg-mastermind-kalender.py
"""
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIDA = os.path.join(ROOT, "mastermind", "index.html")
UT = os.path.join(ROOT, "mastermind", "kalender")
ADRESS = "https://mastermind-varen27.vercel.app"
STAMP = "20261029T120000Z"

PROGRAM = {
    "Mastermind": ("mastermind", "Mastermind 2027"),
    "Mastermind Advanced": ("advanced", "Mastermind Advanced 2027"),
    "Rådgivningstimme": ("radgivningstimme", "Rådgivningstimme 2027"),
    "Gruppcoaching": ("gruppcoaching", "Gruppcoaching våren 2027"),
}

# Boot Camp har inga klockslag än och ligger därför som heldagar i filen med allt
BOOTCAMP = ("20270228", "20270303", "Boot Camp · Sankt Jörgen, Göteborg",
            "Söndag kväll: enklare middag för dig som vill sova över. "
            "Måndag: konferens hela dagen och middag på kvällen. "
            "Tisdag förmiddag: ni arbetar självständigt med er plan, Maria finns på plats och stöttar.")

TZ = """BEGIN:VTIMEZONE
TZID:Europe/Stockholm
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE""".split("\n")


def esc(s):
    return s.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")


def fold(line):
    """Radbryter enligt standarden: högst 75 byte per rad."""
    b = line.encode("utf-8")
    if len(b) <= 75:
        return line
    out, cur = [], b""
    for ch in line:
        e = ch.encode("utf-8")
        if len(cur) + len(e) > (75 if not out else 74):
            out.append(cur.decode("utf-8"))
            cur = b""
        cur += e
    out.append(cur.decode("utf-8"))
    return "\r\n ".join(out)


def las_sidan():
    s = open(SIDA, encoding="utf-8").read()
    zoom = dict(re.findall(r'"(Mastermind Advanced|Mastermind|Rådgivningstimme|Gruppcoaching)": "(https://[^"]+)"', s))
    rader = []
    for m in re.finditer(r"<tr ([^>]*data-date[^>]*)>", s):
        a = dict(re.findall(r'data-(\w+)="([^"]*)"', m.group(1)))
        a["titel"] = html.unescape(a["titel"])
        rader.append(a)
    return rader, zoom


def kalender(namn, handelser):
    L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Åberg & Co//Mastermind//SV",
         "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
         "X-WR-CALNAME:" + esc(namn), "X-WR-TIMEZONE:Europe/Stockholm",
         "REFRESH-INTERVAL;VALUE=DURATION:PT12H", "X-PUBLISHED-TTL:PT12H"] + TZ
    for h in handelser:
        L += h
    L.append("END:VCALENDAR")
    return "\r\n".join(fold(x) for x in L) + "\r\n"


# Program som inte ingår i alla.ics (Advanced är bara för inbjudna)
EGNA = {"Mastermind Advanced"}


def handelse(r, zoom):
    slug = PROGRAM[r["typ"]][0]
    dag = r["date"].replace("-", "")
    link = zoom.get(r["typ"])
    if link:
        text = f"Zoom: {link}\nLösenkod: mastermind\nProgrammet: {ADRESS}"
        plats = [("LOCATION:" + esc(link)), "URL:" + link]
    else:
        text = f"Zoom-länken skickas till dig som är med.\nProgrammet: {ADRESS}/#{slug}"
        plats = ["LOCATION:Zoom"]
    return ["BEGIN:VEVENT",
            f"UID:{slug}-{r['date']}@mastermind-varen27",
            f"DTSTAMP:{STAMP}",
            f"DTSTART;TZID=Europe/Stockholm:{dag}T{r['start'].replace(':', '')}00",
            f"DTEND;TZID=Europe/Stockholm:{dag}T{r['slut'].replace(':', '')}00",
            "SUMMARY:" + esc(r["titel"] + " · Åberg & Co"),
            "DESCRIPTION:" + esc(text)] + plats + ["END:VEVENT"]


# Bokstäver för kalenderväljaren på sidan: en fil per kombination i kalender/val/
KOD = {"Mastermind": "m", "Gruppcoaching": "g", "Rådgivningstimme": "r",
       "Boot Camp": "b", "Mastermind Advanced": "a", "Boot Camp oktober": "o"}
ORDNING = ["Mastermind", "Gruppcoaching", "Rådgivningstimme", "Boot Camp", "Mastermind Advanced",
           "Boot Camp oktober"]
VISNING = {"Boot Camp oktober": "Save the date: Boot Camp i oktober"}


def bootcamp():
    start, slut, titel, text = BOOTCAMP
    return ["BEGIN:VEVENT", "UID:bootcamp-2027-02-28@mastermind-varen27", f"DTSTAMP:{STAMP}",
            f"DTSTART;VALUE=DATE:{start}", f"DTEND;VALUE=DATE:{slut}",
            "SUMMARY:" + esc(titel), "DESCRIPTION:" + esc(text + "\n" + ADRESS + "/#bootcamp"),
            "LOCATION:" + esc("Sankt Jörgen, Göteborg"), "END:VEVENT"]


def main():
    rader, zoom = las_sidan()
    os.makedirs(UT, exist_ok=True)
    per_typ = {}
    for typ, (slug, namn) in PROGRAM.items():
        h = [handelse(r, zoom) for r in rader if r["typ"] == typ]
        per_typ[typ] = h
        open(os.path.join(UT, slug + ".ics"), "w", encoding="utf-8", newline="").write(kalender(namn, h))
        print(f"{slug}.ics: {len(h)} tillfällen")
    per_typ["Boot Camp"] = [bootcamp()]
    per_typ["Boot Camp oktober"] = [[
        "BEGIN:VEVENT", "UID:bootcamp-2027-10-13@mastermind-varen27", f"DTSTAMP:{STAMP}",
        "DTSTART;VALUE=DATE:20271013", "DTEND;VALUE=DATE:20271016",
        "SUMMARY:" + esc("Save the date: Boot Camp · Åberg & Co"),
        "DESCRIPTION:" + esc("Höstens Boot Camp, tre dagar onsdag till fredag. Öppen för alla. "
                             "Mer information kommer.\n" + ADRESS + "/#bootcamp"),
        "END:VEVENT"]]
    open(os.path.join(UT, "bootcamp.ics"), "w", encoding="utf-8", newline="").write(
        kalender("Boot Camp 2027 · Åberg & Co", per_typ["Boot Camp"] + per_typ["Boot Camp oktober"]))
    print("bootcamp.ics: 2 tillfällen")

    alla = [h for typ in ORDNING if typ not in EGNA for h in per_typ[typ]]
    open(os.path.join(UT, "alla.ics"), "w", encoding="utf-8", newline="").write(
        kalender("Mastermind 2027 · Åberg & Co", alla))
    print(f"alla.ics: {len(alla)} tillfällen")

    # Alla kombinationer för kalenderväljaren
    val = os.path.join(UT, "val")
    os.makedirs(val, exist_ok=True)
    for f in os.listdir(val):
        os.remove(os.path.join(val, f))
    antal = 0
    for mask in range(1, 2 ** len(ORDNING)):
        valda = [typ for i, typ in enumerate(ORDNING) if mask >> i & 1]
        kod = "".join(KOD[typ] for typ in valda)
        h = [x for typ in valda for x in per_typ[typ]]
        namn = "Åberg & Co · " + ", ".join(VISNING.get(x, x) for x in valda) if len(valda) < len(ORDNING) else "Åberg & Co · Alla tillfällen 2027"
        open(os.path.join(val, kod + ".ics"), "w", encoding="utf-8", newline="").write(kalender(namn, h))
        antal += 1
    print(f"val/: {antal} kombinationer")


if __name__ == "__main__":
    main()
