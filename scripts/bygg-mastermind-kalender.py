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
    "Mastermind": ("mastermind", "Mastermind våren 2027"),
    "Rådgivningstimme": ("radgivningstimme", "Rådgivningstimme våren 2027"),
    "Gruppcoaching": ("gruppcoaching", "Gruppcoaching våren 2027"),
}

# Boot Camp har inga klockslag än och ligger därför som heldagar i filen med allt
BOOTCAMP = ("20270228", "20270302", "Boot Camp · Sankt Jörgen, Göteborg",
            "Söndag kväll: enklare middag för dig som vill sova över. "
            "Måndag: konferens hela dagen och middag på kvällen.")

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
    zoom = dict(re.findall(r'"(Mastermind|Rådgivningstimme|Gruppcoaching)": "(https://[^"]+)"', s))
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


def handelse(r, zoom):
    slug = PROGRAM[r["typ"]][0]
    dag = r["date"].replace("-", "")
    link = zoom[r["typ"]]
    return ["BEGIN:VEVENT",
            f"UID:{slug}-{r['date']}@mastermind-varen27",
            f"DTSTAMP:{STAMP}",
            f"DTSTART;TZID=Europe/Stockholm:{dag}T{r['start'].replace(':', '')}00",
            f"DTEND;TZID=Europe/Stockholm:{dag}T{r['slut'].replace(':', '')}00",
            "SUMMARY:" + esc(r["titel"] + " · Åberg & Co"),
            "DESCRIPTION:" + esc(f"Zoom: {link}\nLösenkod: mastermind\nProgrammet: {ADRESS}"),
            "LOCATION:" + esc(link),
            "URL:" + link,
            "END:VEVENT"]


def main():
    rader, zoom = las_sidan()
    os.makedirs(UT, exist_ok=True)
    alla = []
    for typ, (slug, namn) in PROGRAM.items():
        h = [handelse(r, zoom) for r in rader if r["typ"] == typ]
        alla += h
        open(os.path.join(UT, slug + ".ics"), "w", encoding="utf-8", newline="").write(kalender(namn, h))
        print(f"{slug}.ics: {len(h)} tillfällen")
    start, slut, titel, text = BOOTCAMP
    alla.append(["BEGIN:VEVENT", "UID:bootcamp-2027-02-28@mastermind-varen27", f"DTSTAMP:{STAMP}",
                 f"DTSTART;VALUE=DATE:{start}", f"DTEND;VALUE=DATE:{slut}",
                 "SUMMARY:" + esc(titel), "DESCRIPTION:" + esc(text + "\n" + ADRESS + "/#bootcamp"),
                 "LOCATION:" + esc("Sankt Jörgen, Göteborg"), "END:VEVENT"])
    open(os.path.join(UT, "alla.ics"), "w", encoding="utf-8", newline="").write(
        kalender("Mastermind våren 2027 · Åberg & Co", alla))
    print(f"alla.ics: {len(alla)} tillfällen")


if __name__ == "__main__":
    main()
