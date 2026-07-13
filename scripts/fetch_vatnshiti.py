#!/usr/bin/env python3
"""Fetch Þingvallavatn water temperature from Landsvirkjun and write to JSON.

Stores the latest reading plus a 14-day daily-average history so the static
site can render a temperature chart without any server-side processing.
"""

import json
import re
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone

URL = "https://www.landsvirkjun.is/rauntimavoktun/vatnshiti-thingvallavatns"
OUT_PATH = "site/assets/data/vatnshiti.json"
HISTORY_DAYS = 14


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8")

    match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not match:
        raise SystemExit("Could not find __NEXT_DATA__ in page")

    data = json.loads(match.group(1))
    body = data["props"]["pageProps"]["page"]["body"]

    series = None
    for item in body:
        if item.get("type") == "graph":
            graph = json.loads(item["primary"]["data"])
            series = graph["series"][0]["data"]
            break

    if not series:
        raise SystemExit("Could not find water temperature series")

    # Latest reading
    timestamp_ms, temp = series[-1]
    updated = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)

    # Build daily averages from all readings
    daily = defaultdict(list)
    for ts_ms, t in series:
        dt = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc)
        daily[dt.strftime("%Y-%m-%d")].append(t)

    sorted_dates = sorted(daily.keys())[-HISTORY_DAYS:]
    history = [
        {"date": d, "temp": round(sum(daily[d]) / len(daily[d]), 1)}
        for d in sorted_dates
    ]

    out = {
        "temp": temp,
        "updated": updated.isoformat().replace("+00:00", "Z"),
        "source": URL,
        "history": history,
    }

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Latest: {temp}°C at {updated}. History: {len(history)} days.")


if __name__ == "__main__":
    main()
