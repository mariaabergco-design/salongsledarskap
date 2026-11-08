#!/usr/bin/env python3
"""Bygger kalenderfilen för Startskottet-sidan från tabellen i startskottet/index.html.

Kör efter varje ändring av datum:  python3 scripts/bygg-startskottet-kalender.py
"""
import os
import re
import importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("mm", os.path.join(ROOT, "scripts", "bygg-mastermind-kalender.py"))
mm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mm)

SIDA = os.path.join(ROOT, "startskottet", "index.html")
UT = os.path.join(ROOT, "startskottet", "kalender")
ADRESS = "https://startskottet.vercel.app"


def main():
    s = open(SIDA, encoding="utf-8").read()
    datum = re.findall(r'<tr data-date="(\d{4}-\d{2}-\d{2})">', s)
    h = []
    for i, d in enumerate(datum, 1):
        dag = d.replace("-", "")
        h.append(["BEGIN:VEVENT", f"UID:startskottet-{d}@startskottet", f"DTSTAMP:{mm.STAMP}",
                  f"DTSTART;TZID=Europe/Stockholm:{dag}T123000",
                  f"DTEND;TZID=Europe/Stockholm:{dag}T140000",
                  "SUMMARY:" + mm.esc(f"Startskottet: gruppcoaching {i} av {len(datum)} · Åberg & Co"),
                  "DESCRIPTION:" + mm.esc("Gruppcoaching på Zoom. Zoom-länken får du när du har anmält dig.\nProgrammet: " + ADRESS),
                  "LOCATION:Zoom", "END:VEVENT"])
    os.makedirs(UT, exist_ok=True)
    open(os.path.join(UT, "startskottet.ics"), "w", encoding="utf-8", newline="").write(
        mm.kalender("Startskottet som ledare · Åberg & Co", h))
    print(f"startskottet.ics: {len(h)} tillfällen")


if __name__ == "__main__":
    main()
