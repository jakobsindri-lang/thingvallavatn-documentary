#!/usr/bin/env python3
"""Fetch Bliku's Þingvallavatn (Vatnskot) forecast and write to JSON.

Runs server-side on a schedule so the static site can use a cached copy
first, instead of every visitor's browser calling the unofficial Bliku
API directly.
"""

import json
import urllib.request
from datetime import datetime, timezone

URL = "https://api.blika.is/GetCorrdiffForecast24klst/8553/"
OUT_PATH = "site/assets/data/vedurspa.json"


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        days = json.loads(resp.read().decode("utf-8"))

    out = {
        "fetched": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": URL,
        "days": days,
    }

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Fetched {len(days)} day(s) of forecast data.")


if __name__ == "__main__":
    main()
