console.log("Þingvallavatn — kynningar- og stuðningssíða er keyrð.");

const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");
  }
}

const previewButton = document.getElementById("preview-button");
const supportButton = document.getElementById("support-button");

if (previewButton) {
  previewButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("sneak-peek").scrollIntoView({ behavior: "smooth" });
  });
}

if (supportButton) {
  supportButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("leggja-lid").scrollIntoView({ behavior: "smooth" });
  });
}

const mapSvgMount = document.getElementById("interactive-map-svg");
const mapInfo = document.getElementById("map-info");
const mapKicker = document.getElementById("map-kicker");
const mapTitle = document.getElementById("map-title");
const mapDescription = document.getElementById("map-description");
const mapRole = document.getElementById("map-role");
const mapTheme = document.getElementById("map-theme");
const mapPlaceList = document.getElementById("map-place-list");

const mapPlaces = {
  Vatnskot: {
    kicker: "Veiðisvæði þjóðgarðsins",
    description:
      "Miðpunktur veiðinnar í þessari fyrstu útgáfu kortsins. Héðan tengist sagan veiðiaðstæðum, aðgengi og lestri vatnsins.",
    role: "Veiðistaður og viðmiðunarstaður",
    theme: "Veiði, veður, aðgengi",
  },
  Garðsendavík: {
    kicker: "Víkur og grunnsævi",
    description:
      "Ein af víkunum sem hjálpar til við að setja veiðina í samhengi við strandlínu, birtu og vind.",
    role: "Örnefni við veiðisvæði",
    theme: "Lestur vatnsins, landslag",
  },
  Vörðuvík: {
    kicker: "Víkur og aðstæður",
    description:
      "Staður sem getur nýst vel í kortinu til að sýna hvernig smærri víkur og tangar móta aðstæður við vatnið.",
    role: "Örnefni við veiðisvæði",
    theme: "Veiðiaðferðir, aðstæður",
  },
  Öfugsnáði: {
    kicker: "Örnefni við vatnið",
    description:
      "Sérkennilegt örnefni sem gefur kortinu staðbundinn karakter og minnir á hve náið fólk hefur lesið vatnið í gegnum tíðina.",
    role: "Kennileiti",
    theme: "Saga, staðarþekking",
  },
  Davíðsgjá: {
    kicker: "Gjásvæði",
    description:
      "Gjáin tengir veiðikortið við jarðsögu Þingvalla og sjónrænan heim myndarinnar: hraun, dýpi og tæran vatnsheim.",
    role: "Gjásvæði og kennileiti",
    theme: "Jarðsaga, neðansjávarstemning",
  },
  Hallvik: {
    kicker: "Víkur og veiði",
    description:
      "Víkin er góður punktur fyrir umfjöllun um hvernig form strandarinnar, vindur og birta breyta lestri vatnsins.",
    role: "Örnefni við veiðisvæði",
    theme: "Veiði, birta, vindur",
  },
  Gjáarendar: {
    kicker: "Gjásvæði",
    description:
      "Staður sem getur brúað saman kortið, þjóðgarðinn og jarðfræðina sem gerir Þingvallavatn einstakt.",
    role: "Kennileiti við gjár",
    theme: "Þjóðgarðurinn, jarðsaga",
  },
  Ólafsdráttur: {
    kicker: "Veiðistaður",
    description:
      "Örnefni sem hentar vel til að tengja kortið við hefðir, staðarþekkingu og sögur veiðimanna við vatnið.",
    role: "Örnefni við veiðisvæði",
    theme: "Veiðimenning, staðarþekking",
  },
  Langitangi: {
    kicker: "Tangi við vatnið",
    description:
      "Tangi sem sýnir vel hvernig nes, víkur og opið vatn skapa ólíkar aðstæður eftir vindátt og árstíma.",
    role: "Kennileiti og veiðisamhengi",
    theme: "Vindur, dýpi, aðgengi",
  },
};

const MAP_GROUPS = [
  { label: "Lambhagi",     children: ["Garðsendavík", "Lambhagatá", "Leirutá", "Presthólmi"] },
  { label: "Vatnskot",     children: ["Murtusker", "Veiðitangi"] },
  { label: "Tóftir",      children: ["Murtutangi", "Vörðuvík"] },
  { label: "Öfugsnáði" },
  { label: "Nes",         children: ["Nautatangar", "Vatnsvik"] },
  { label: "Vellankatla" },
  { label: "Hallvik",     children: ["Davíðsgjá", "Gjáarendar", "Hallvik"] },
  { label: "Ólafsdráttur", children: ["Búr", "Einbúi", "Fornasel", "Þvotta"] },
  { label: "Arnarfell",   children: ["Arnarnes", "Arnarsetur", "Klofhóll", "Langatangagjár", "Langitangi", "Sandskörð", "Sláttulág"] },
];

if (mapSvgMount && mapInfo) {
  const mapNameAliases = {
    Langatangi: "Langitangi",
  };
  let activeMapElement = null;
  let activeMapButton = null;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const escapeSelectorValue = (value) => {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return value.replace(/["\\]/g, "\\$&");
  };

  const normalizeMapName = (name) => mapNameAliases[name] || name;

  const updateMapInfo = (rawName) => {
    const name = normalizeMapName(rawName);
    const place = mapPlaces[name] || {
      kicker: "Örnefni við Þingvallavatn",
      description:
        "Þessi staður er hluti af veiðisvæðinu og verður hægt að tengja við nánari upplýsingar síðar.",
      role: "Örnefni",
      theme: "Veiði, landslag",
    };

    mapKicker.textContent = "Veiðisvæði";
    mapTitle.textContent = name;
    mapDescription.textContent = place.description;
    mapRole.textContent = place.role;
    mapTheme.textContent = place.theme;

    if (activeMapElement) activeMapElement.classList.remove("is-active");
    activeMapElement = mapSvgMount.querySelector(
      `.map-point[data-nafn="${escapeSelectorValue(name)}"]`
    );
    if (activeMapElement) activeMapElement.classList.add("is-active");

    if (activeMapButton) activeMapButton.classList.remove("is-active");
    activeMapButton = mapPlaceList?.querySelector(
      `[data-map-place="${escapeSelectorValue(name)}"]`
    );
    if (activeMapButton) activeMapButton.classList.add("is-active");
  };

  fetch(`${window.ASSET_BASE ?? ""}assets/Map/veidisvaedi_thingvallavatni.svg`)
    .then((response) => {
      if (!response.ok) throw new Error("Map SVG not found");
      return response.text();
    })
    .then((svgText) => {
      const parser = new DOMParser();
      const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
      const svg = svgDocument.documentElement;
      if (svg.nodeName.toLowerCase() === "parsererror") throw new Error("Invalid SVG");

      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("role", "img");
      svg.setAttribute("focusable", "false");
      svg.setAttribute("overflow", "hidden");
      mapSvgMount.replaceChildren(document.importNode(svg, true));

      const inlineSvg = mapSvgMount.querySelector("svg");
      const pointLayer = document.createElementNS(svgNamespace, "g");
      pointLayer.setAttribute("id", "map-points");

      mapSvgMount.querySelectorAll(".ornefni, .ornefni-halo").forEach((label) => {
        label.setAttribute("aria-hidden", "true");
      });

      mapSvgMount.querySelectorAll(".ornefni").forEach((label) => {
        const sourceName = label.textContent.trim() || label.dataset.nafn;
        const name = normalizeMapName(sourceName);
        const cx = label.dataset.cx || label.getAttribute("x");
        const cy = label.dataset.cy || label.getAttribute("y");

        if (!cx || !cy) return;

        const point = document.createElementNS(svgNamespace, "circle");
        point.classList.add("map-point");
        if (mapPlaces[name]) point.classList.add("map-point-featured");
        point.dataset.nafn = name;
        point.setAttribute("cx", cx);
        point.setAttribute("cy", cy);
        point.setAttribute("r", "3.5");
        point.setAttribute("tabindex", "0");
        point.setAttribute("role", "button");
        point.setAttribute("aria-label", name);
        point.addEventListener("click", () => updateMapInfo(name));
        point.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            updateMapInfo(name);
          }
        });
        pointLayer.appendChild(point);
      });

      const ornefniGroup = inlineSvg.querySelector("#ornefni-group");
      (ornefniGroup || inlineSvg).appendChild(pointLayer);

      if (mapPlaceList) {
        mapPlaceList.replaceChildren();

        const groupsRow = document.createElement("div");
        groupsRow.className = "map-place-groups-row";

        const childrenRow = document.createElement("div");
        childrenRow.className = "map-place-children-row";
        childrenRow.hidden = true;

        let activeToggle = null;

        MAP_GROUPS.forEach((group) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "map-place-button";

          if (!group.children) {
            btn.dataset.mapPlace = normalizeMapName(group.label);
            btn.textContent = group.label;
            btn.addEventListener("click", () => {
              if (activeToggle) {
                activeToggle.setAttribute("aria-expanded", "false");
                activeToggle = null;
                childrenRow.hidden = true;
              }
              updateMapInfo(group.label);
            });
          } else {
            btn.classList.add("map-place-group-toggle");
            btn.setAttribute("aria-expanded", "false");
            btn.innerHTML = `${group.label} <span class="map-group-chevron" aria-hidden="true">›</span>`;

            btn.addEventListener("click", () => {
              const isOpen = btn.getAttribute("aria-expanded") === "true";
              if (activeToggle && activeToggle !== btn) {
                activeToggle.setAttribute("aria-expanded", "false");
              }
              if (isOpen) {
                btn.setAttribute("aria-expanded", "false");
                childrenRow.hidden = true;
                activeToggle = null;
              } else {
                btn.setAttribute("aria-expanded", "true");
                activeToggle = btn;
                childrenRow.replaceChildren();
                group.children.forEach((childName) => {
                  const childBtn = document.createElement("button");
                  childBtn.type = "button";
                  childBtn.className = "map-place-button map-place-child";
                  childBtn.dataset.mapPlace = normalizeMapName(childName);
                  childBtn.textContent = childName;
                  childBtn.addEventListener("click", () => updateMapInfo(childName));
                  childrenRow.appendChild(childBtn);
                });
                childrenRow.hidden = false;
              }
            });
          }

          groupsRow.appendChild(btn);
        });

        mapPlaceList.appendChild(groupsRow);
        mapPlaceList.appendChild(childrenRow);
      }

      updateMapInfo("Vatnskot");
    })
    .catch(() => {
      mapSvgMount.innerHTML =
        '<p class="map-status">Ekki tókst að hlaða kortinu í þessari lotu.</p>';
      updateMapInfo("Vatnskot");
    });
}

const galleryScroll = document.querySelector(".gallery-scroll");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");

if (galleryScroll) {
  const items = Array.from(galleryScroll.children);
  const firstIndex = items.findIndex((item) =>
    item.querySelector("img").src.includes("stillur-ur-lofti-1.jpg")
  );
  const first = firstIndex >= 0 ? items.splice(firstIndex, 1)[0] : null;

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  if (first) items.unshift(first);

  const totalReal = items.length;
  const cloneCount = 3; // must match max items-per-view (desktop = 3)

  const prepend = items.slice(-cloneCount).map((el) => {
    const c = el.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  });
  const append = items.slice(0, cloneCount).map((el) => {
    const c = el.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  });

  galleryScroll.innerHTML = "";
  [...prepend, ...items, ...append].forEach((el) => galleryScroll.appendChild(el));

  let currentIndex = cloneCount;
  let transitioning = false;
  let transitionFallback;

  const getItemsPerView = () => {
    if (window.innerWidth >= 1800) return 3;
    if (window.innerWidth >= 1000) return 2;
    return 1;
  };

  const updatePosition = (animate) => {
    const wrapWidth = galleryScroll.parentElement.offsetWidth;
    const itemWidth = wrapWidth / getItemsPerView();
    galleryScroll.style.transition = animate ? "transform 0.4s ease" : "none";
    galleryScroll.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
  };

  galleryScroll.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;
    clearTimeout(transitionFallback);
    let wrapped = false;
    if (currentIndex < cloneCount) {
      currentIndex += totalReal;
      wrapped = true;
    } else if (currentIndex >= cloneCount + totalReal) {
      currentIndex -= totalReal;
      wrapped = true;
    }
    if (wrapped) {
      updatePosition(false);
      void galleryScroll.offsetHeight;
    }
    transitioning = false;
  });

  const goTo = (newIndex) => {
    if (transitioning) return;
    transitioning = true;
    clearTimeout(transitionFallback);
    currentIndex = newIndex;
    updatePosition(true);
    transitionFallback = setTimeout(() => {
      transitioning = false;
    }, 600);
  };

  if (galleryPrev) galleryPrev.addEventListener("click", () => goTo(currentIndex - 1));
  if (galleryNext) galleryNext.addEventListener("click", () => goTo(currentIndex + 1));

  updatePosition(false);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updatePosition(false), 100);
  });

  let wheelLocked = false;
  galleryScroll.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        if (wheelLocked) return;
        wheelLocked = true;
        goTo(currentIndex + (event.deltaY > 0 ? 1 : -1));
        setTimeout(() => {
          wheelLocked = false;
        }, 500);
      }
    },
    { passive: false }
  );
}

const weatherGrid = document.getElementById("weather-grid");
const weatherTabs = document.querySelectorAll(".weather-tab");
const weatherPanels = document.querySelectorAll(".weather-panel");

if (weatherTabs.length) {
  weatherTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      weatherTabs.forEach((t) => t.classList.remove("active"));
      weatherPanels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
      tab.classList.add("active");
    });
  });
}

function waterTempChartSVG(history) {
  if (!history || history.length < 2) return "";
  const W = 600, H = 150;
  const padL = 34, padR = 12, padT = 22, padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const temps = history.map((d) => d.temp);
  const minT = Math.min(...temps) - 0.3;
  const maxT = Math.max(...temps) + 0.3;
  const range = maxT - minT || 1;
  const n = history.length;
  const toX = (i) => padL + (i / (n - 1)) * plotW;
  const toY = (t) => padT + plotH - ((t - minT) / range) * plotH;
  const pts = history.map((d, i) => `${toX(i).toFixed(1)},${toY(d.temp).toFixed(1)}`);
  const line = `M ${pts.join(" L ")}`;
  const area = `M ${toX(0).toFixed(1)},${(padT + plotH).toFixed(1)} L ${pts.join(" L ")} L ${toX(n - 1).toFixed(1)},${(padT + plotH).toFixed(1)} Z`;
  const step = n <= 7 ? 1 : 2;
  const xLabels = history.map((d, i) => {
    if (i % step !== 0 && i !== n - 1) return "";
    const dt = new Date(d.date + "T12:00:00Z");
    const lbl = dt.toLocaleDateString("is-IS", { day: "numeric", month: "numeric" });
    return `<text x="${toX(i).toFixed(1)}" y="${H - 5}" text-anchor="middle" font-size="9.5" fill="rgba(200,215,220,0.55)">${lbl}</text>`;
  }).join("");
  const yMin = `${minT.toFixed(1)}°`;
  const yMax = `${maxT.toFixed(1)}°`;

  const lastIdx = n - 1;
  const lastX = toX(lastIdx);
  const lastY = toY(history[lastIdx].temp);
  const lastDt = new Date(history[lastIdx].date + "T12:00:00Z");
  const lastDateLabel = lastDt.toLocaleDateString("is-IS", { day: "numeric", month: "long" });

  const regularPoints = history.map((d, i) => {
    if (i === lastIdx) return "";
    const dt = new Date(d.date + "T12:00:00Z");
    const dl = dt.toLocaleDateString("is-IS", { day: "numeric", month: "long" });
    return `<circle class="wt-point" cx="${toX(i).toFixed(1)}" cy="${toY(d.temp).toFixed(1)}" r="2.8" fill="#8fd9e8" data-temp="${d.temp}" data-date="${dl}"/>`;
  }).join("");

  const labelY = lastY > padT + plotH / 2 ? lastY - 12 : lastY + 18;
  const currentPoint = `
    <circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="9" fill="rgba(143,217,232,0.1)"/>
    <circle class="wt-point" cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="4" fill="#c8f0f8" stroke="#8fd9e8" stroke-width="1.2" data-temp="${history[lastIdx].temp}" data-date="${lastDateLabel}"/>
    <text x="${(lastX - 14).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="end" font-size="8.5" fill="rgba(200,220,230,0.55)">Nýjasta gildi</text>`;

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="water-temp-chart" style="overflow:visible" aria-hidden="true">
    <defs>
      <linearGradient id="wtGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(143,217,232,0.22)"/>
        <stop offset="100%" stop-color="rgba(143,217,232,0.01)"/>
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#wtGrad)"/>
    <path d="${line}" fill="none" stroke="#8fd9e8" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
    ${regularPoints}
    ${currentPoint}
    ${xLabels}
    <text x="${padL - 4}" y="${(toY(maxT - 0.3) + 4).toFixed(1)}" text-anchor="end" font-size="9.5" fill="rgba(200,215,220,0.45)">${yMax}</text>
    <text x="${padL - 4}" y="${(toY(minT + 0.3) + 4).toFixed(1)}" text-anchor="end" font-size="9.5" fill="rgba(200,215,220,0.45)">${yMin}</text>
  </svg>`;
}

function initWaterTemp() {
  const widget = document.getElementById("water-temp-widget");
  if (!widget) return;
  fetch(`${window.ASSET_BASE ?? ""}assets/data/vatnshiti.json?v=${Date.now()}`, { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => {
      const tempLabel = data.temp.toFixed(1).replace(".", ",");
      const updated = new Date(data.updated);
      const timeLabel = updated.toLocaleString("is-IS", {
        day: "numeric", month: "numeric",
        hour: "2-digit", minute: "2-digit",
        timeZone: "Atlantic/Reykjavik",
      });
      const chart = waterTempChartSVG(data.history);
      widget.innerHTML = `
        <div class="water-temp-current">
          <span class="water-temp-label">Nýjasta gildi</span>
          <span class="water-temp-value">${tempLabel}°C</span>
          <span class="water-temp-time">mælt ${timeLabel}</span>
        </div>
        ${chart ? `<div class="water-temp-chart-wrap">${chart}</div>` : ""}
      `;
      const chartWrap = widget.querySelector(".water-temp-chart-wrap");
      if (chartWrap) {
        const svg = chartWrap.querySelector("svg");
        const tip = document.createElement("div");
        tip.className = "wt-tooltip";
        tip.hidden = true;
        chartWrap.appendChild(tip);
        svg.addEventListener("mousemove", (e) => {
          const points = [...svg.querySelectorAll(".wt-point")];
          const rect = svg.getBoundingClientRect();
          const scaleX = rect.width / 600;
          const scaleY = rect.height / 150;
          const mx = e.clientX - rect.left;
          let nearest = null, minDist = Infinity;
          points.forEach((p) => {
            const dist = Math.abs(parseFloat(p.getAttribute("cx")) * scaleX - mx);
            if (dist < minDist) { minDist = dist; nearest = p; }
          });
          if (nearest && minDist < 40) {
            const temp = parseFloat(nearest.getAttribute("data-temp")).toFixed(1).replace(".", ",");
            tip.textContent = `${nearest.getAttribute("data-date")} · ${temp}°C`;
            tip.hidden = false;
            tip.style.left = `${parseFloat(nearest.getAttribute("cx")) * scaleX}px`;
            tip.style.top = `${Math.max(0, parseFloat(nearest.getAttribute("cy")) * scaleY - 40)}px`;
          } else {
            tip.hidden = true;
          }
        });
        svg.addEventListener("mouseleave", () => { tip.hidden = true; });
      }
    })
    .catch(() => {
      widget.innerHTML = '<p class="weather-status">Ekki tókst að sækja vatnshita.</p>';
    });
}

initWaterTemp();

if (weatherGrid) {
  const weatherIcons = {
    clear:"☀️", partlycloudy:"🌤️", mostlycloudy:"⛅", cloudy:"☁️",
    fog:"🌫️", drizzle:"🌦️",
    rain:"🌧️", showers:"🌦️", sleet:"🌨️", snow:"❄️",
    chanceflurries:"🌨️", thunder:"⛈️", hail:"🌨️",
  };
  const blikaError = '<p class="weather-status">Ekki tókst að sækja veðurspá núna. <a href="https://www.blika.is/spa/8553" target="_blank" rel="noopener">Skoða spá á Bliku</a>.</p>';

  fetch(FORECAST_CONFIG.api.blikaForecast)
    .then((r) => r.json())
    .then((days) => {
      const first7 = days.slice(0, 7);
      if (!first7.length) { weatherGrid.innerHTML = blikaError; return; }
      weatherGrid.innerHTML = "";
      first7.forEach((day) => {
        const date      = new Date(day.dags_spar.slice(0, 10) + "T12:00:00Z");
        const dateLabel = date.toLocaleDateString("is-IS", { weekday: "short", day: "numeric", month: "numeric" });
        const item = document.createElement("div");
        item.className = "weather-day";
        item.innerHTML = `
          <div class="weather-date">${dateLabel}</div>
          <div class="weather-icon">${weatherIcons[day.merki] || "🌡️"}</div>
          <div class="weather-temp">${Math.round(day.t2)}°</div>
          <div class="weather-wind">${Math.round(day.f10)} m/s ${(day.dtexti || "").toUpperCase()}</div>
        `;
        weatherGrid.appendChild(item);
      });
    })
    .catch(() => { weatherGrid.innerHTML = blikaError; });
}

// ── Veiðispá ─────────────────────────────────────────────────────────────────

async function fetchHistoricalCloud() {
  const { lat, lon } = FORECAST_CONFIG.location;
  const now   = new Date();
  const end   = new Date(+now - 86400000);
  const start = new Date(+now - 4 * 86400000);
  const fmt   = (d) => d.toISOString().slice(0, 10);
  const url   = `${FORECAST_CONFIG.api.openMeteoArchive}?latitude=${lat}&longitude=${lon}` +
                `&hourly=cloud_cover&start_date=${fmt(start)}&end_date=${fmt(end)}&timezone=UTC`;
  const data  = await fetch(url).then((r) => r.json());
  if (!data.hourly?.time?.length) return null;
  return data.hourly.time.map((t, i) => ({
    utcHour:    new Date(t.endsWith("Z") ? t : t + "Z"),
    cloudCover: data.hourly.cloud_cover[i],
  }));
}

const VSP_SLOTS = [
  { key: "morgunn", repHour:  7, fromH:  4, toH: 10 },
  { key: "dagur",   repHour: 14, fromH: 10, toH: 18 },
  { key: "kvold",   repHour: 20, fromH: 18, toH: 23 },
  { key: "nott",    repHour: 23, fromH: 23, toH: 28 },  // toH=28 → 04:00 næsta dag
];

function getCurrentSlotKey() {
  const h = new Date().getUTCHours();
  if (h >=  4 && h < 10) return "morgunn";
  if (h >= 10 && h < 18) return "dagur";
  if (h >= 18 && h < 23) return "kvold";
  return "nott";
}

// Finnur besta urriðamat á tilteknum tímagluggum (30 mín skref).
// toH getur verið > 23 (t.d. 28 = 04:00 næsta dag) — Date() meðhöndlar yfirfall.
function bestTroutScoreInSlot(rawInputs, fromH, toH) {
  const base = new Date();
  base.setUTCHours(0, 0, 0, 0);
  let best = null;
  for (let mins = fromH * 60; mins <= toH * 60; mins += 30) {
    const t = new Date(+base + mins * 60000);
    const r = runForecast(rawInputs, t);
    if (!r.inSeason || !r.trout) continue;
    if (best === null || r.trout.score > best.score) best = r.trout;
  }
  return best;
}

function slotNow(repHour) {
  const d = new Date();
  d.setUTCHours(repHour, 0, 0, 0);
  return d;
}

function fishHTML(score) {
  const n = (score === null || score === undefined) ? -1 : score;
  const brightCount = n < 0 ? 0 : Math.min(n + 1, 5);
  const colorCls    = n >= 0 ? (n <= 1 ? "fish-red" : n === 2 ? "fish-yellow" : "fish-green") : "";
  let out = "";
  for (let i = 0; i < brightCount; i++) out += `<span class="fish bright ${colorCls}">🐟</span>`;
  for (let i = 0; i < (5 - brightCount); i++) out += `<span class="fish dull">🐟</span>`;
  return out;
}

function condLabel(flyScore) {
  if (flyScore <= 1) return { text: "Slæmar",     cls: "cond-bad" };
  if (flyScore === 2) return { text: "Fínar",     cls: "cond-ok" };
  return               { text: "Mjög fínar",      cls: "cond-good" };
}

const merkiToCloud = {
  clear: 5, partlycloudy: 25, mostlycloudy: 65, cloudy: 90,
  fog: 95, drizzle: 80, rain: 90, showers: 80, sleet: 90, snow: 90,
  chanceflurries: 70, thunder: 95, hail: 90,
};

async function initForecast() {
  const dataWarnings = [];

  const [blikaRes, archiveRes, waterRes] = await Promise.allSettled([
    fetch(FORECAST_CONFIG.api.blikaForecast).then((r) => r.json()),
    fetchHistoricalCloud(),
    fetch(`${window.ASSET_BASE ?? ""}assets/data/vatnshiti.json?v=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .catch(() => null),
  ]);

  if (blikaRes.status   === "rejected") dataWarnings.push("Veðurgögn ekki tiltæk");
  if (archiveRes.status === "rejected") dataWarnings.push("Söguleg skýjahulugögn ekki tiltæk — áhrif fyrri bjartra nátta ekki reiknuð");

  const blikaData   = blikaRes.value   ?? null;
  const archiveData = archiveRes.value ?? null;
  const waterData   = waterRes.value   ?? null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const today    = Array.isArray(blikaData)
    ? (blikaData.find(d => d.dags_spar.slice(0, 10) === todayStr) ?? blikaData[0] ?? null)
    : null;

  const rawInputs = {
    cloudCover:            today ? (merkiToCloud[today.merki] ?? 50) : null,
    windSpeedMs:           today?.f10  ?? null,
    windDirDeg:            null,
    windDirText:           today?.dtexti ?? null,
    waterTemp:             waterData?.temp ?? null,
    historicalHourlyCloud: archiveData,
    dataWarnings,
  };

  const currentSlotKey = getCurrentSlotKey();
  const slotResults = VSP_SLOTS.map((s) => {
    const r = runForecast(rawInputs, slotNow(s.repHour));
    const bestTrout = bestTroutScoreInSlot(rawInputs, s.fromH, s.toH);
    if (bestTrout) r.trout = bestTrout;
    return r;
  });

  renderForecast(slotResults, currentSlotKey);
}

function renderForecast(slotResults, currentSlotKey) {
  const loadingEl = document.getElementById("forecast-loading");
  const closedEl  = document.getElementById("forecast-closed");
  const resultEl  = document.getElementById("forecast-result");

  if (loadingEl) loadingEl.hidden = true;

  if (!slotResults[0].inSeason) {
    if (closedEl) closedEl.hidden = false;
    return;
  }
  if (resultEl) resultEl.hidden = false;

  VSP_SLOTS.forEach((s) => {
    const th = document.getElementById(`th-${s.key}`);
    if (th) th.classList.toggle("is-current", s.key === currentSlotKey);
  });

  slotResults.forEach((r, i) => {
    const key     = VSP_SLOTS[i].key;
    const isCurr  = key === currentSlotKey;

    const tc = document.getElementById(`trout-${key}`);
    if (tc) { tc.innerHTML = fishHTML(r.trout?.score ?? null); tc.classList.toggle("is-current", isCurr); }

    const lc = document.getElementById(`largechar-${key}`);
    if (lc) { lc.innerHTML = fishHTML(r.char?.largeFinalScore ?? null); lc.classList.toggle("is-current", isCurr); }

    const cc = document.getElementById(`char-${key}`);
    if (cc) { cc.innerHTML = fishHTML(r.char?.smallFinalScore ?? null); cc.classList.toggle("is-current", isCurr); }

    const condEl = document.getElementById(`cond-${key}`);
    if (condEl) {
      const { text, cls } = condLabel(r.fly?.score ?? 2);
      condEl.textContent = text;
      condEl.className   = `vsp-cell vsp-cell-cond ${cls}${isCurr ? " is-current" : ""}`;
    }
  });

  const noteEl = document.getElementById("forecast-data-note");
  if (noteEl) noteEl.textContent = (slotResults[0].dataWarnings || []).join(" · ");
}

if (typeof runForecast === "function") {
  initForecast();
}

// --- Moon widget ---

function moonPhaseSVG(phase, fraction, cloudCover) {
  const size = 160;
  const r    = 72;
  const cx   = size / 2;
  const cy   = size / 2;
  const ix   = cx - r;
  const iy   = cy - r;
  const id   = r * 2;
  const top  = `${cx} ${cy - r}`;
  const bot  = `${cx} ${cy + r}`;

  let litClip = "";
  if (fraction > 0.995) {
    litClip = `<clipPath id="moonLit"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`;
  } else if (fraction > 0.005) {
    let rx, outerSweep;
    if (phase < 0.5) {
      rx = r * Math.cos(2 * Math.PI * phase);
      outerSweep = 1;
    } else {
      rx = r * Math.cos(2 * Math.PI * (phase - 0.5));
      outerSweep = 0;
    }
    const absRx = Math.abs(rx);
    const tSweep = rx >= 0 ? 0 : 1;
    const d = absRx < 0.5
      ? `M ${top} A ${r} ${r} 0 0 ${outerSweep} ${bot} L ${top} Z`
      : `M ${top} A ${r} ${r} 0 0 ${outerSweep} ${bot} A ${absRx} ${r} 0 0 ${tSweep} ${top} Z`;
    litClip = `<clipPath id="moonLit"><path d="${d}"/></clipPath>`;
  }

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="moonCircle"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      ${litClip}
      <radialGradient id="limbDark" cx="50%" cy="50%" r="50%">
        <stop offset="65%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.60)"/>
      </radialGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#06080c"/>
    <image href="assets/images/web/moon.jpg" x="${ix}" y="${iy}" width="${id}" height="${id}"
           clip-path="url(#moonCircle)" opacity="0.09" preserveAspectRatio="xMidYMid slice"/>
    ${fraction > 0.005 ? `
    <image href="assets/images/web/moon.jpg" x="${ix}" y="${iy}" width="${id}" height="${id}"
           clip-path="url(#moonLit)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#limbDark)" clip-path="url(#moonLit)"/>` : ""}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(245,230,176,0.07)" stroke-width="1"/>
  </svg>`;
}

function cloudCoverSVG(pct) {
  const size = 160;
  const r    = 68;
  const cx   = size / 2;
  const cy   = size / 2;
  const p    = pct ?? 0;

  const starOp = Math.max(0, (35 - p) / 35);
  const stars = starOp > 0 ? [
    [55,38],[95,32],[112,55],[38,62],[68,28],[105,78],[42,95],[118,92]
  ].map(([x,y]) =>
    `<circle cx="${x}" cy="${y}" r="1.4" fill="rgba(255,248,220,${(starOp * 0.65).toFixed(2)})"/>`
  ).join("") : "";

  const c1Op = Math.max(0, Math.min(1, (p -  5) / 25)).toFixed(2);
  const c2Op = Math.max(0, Math.min(1, (p - 30) / 25)).toFixed(2);
  const c3Op = Math.max(0, Math.min(1, (p - 60) / 25)).toFixed(2);
  const ovOp = Math.max(0, Math.min(0.45, (p - 80) / 40)).toFixed(2);

  const cloud1 = +c1Op > 0 ? `<g opacity="${c1Op}">
      <ellipse cx="96" cy="52" rx="22" ry="11" fill="#c8d4e0"/>
      <ellipse cx="80" cy="57" rx="17" ry="10" fill="#ccd7e3"/>
      <ellipse cx="110" cy="56" rx="15" ry="9"  fill="#c4d0dc"/>
      <ellipse cx="96" cy="63" rx="24" ry="8"   fill="#d0dbe7"/>
    </g>` : "";

  const cloud2 = +c2Op > 0 ? `<g opacity="${c2Op}">
      <ellipse cx="56" cy="78" rx="20" ry="11" fill="#bcc8d4"/>
      <ellipse cx="40" cy="83" rx="15" ry="9"  fill="#c0ccd8"/>
      <ellipse cx="70" cy="82" rx="17" ry="9"  fill="#b9c5d1"/>
      <ellipse cx="56" cy="88" rx="22" ry="7"  fill="#c4d0dc"/>
    </g>` : "";

  const cloud3 = +c3Op > 0 ? `<g opacity="${c3Op}">
      <ellipse cx="82" cy="108" rx="28" ry="13" fill="#b0bcc8"/>
      <ellipse cx="60" cy="105" rx="20" ry="12" fill="#b8c4d0"/>
      <ellipse cx="104" cy="104" rx="21" ry="11" fill="#aebac6"/>
      <ellipse cx="82" cy="96"  rx="30" ry="10" fill="#bcc8d4"/>
    </g>` : "";

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="skyCircle"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <radialGradient id="skyGrad" cx="50%" cy="40%" r="65%">
        <stop offset="0%"   stop-color="#0d1520"/>
        <stop offset="100%" stop-color="#060a10"/>
      </radialGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#skyGrad)"/>
    <g clip-path="url(#skyCircle)">
      ${stars}
      ${cloud1}
      ${cloud2}
      ${cloud3}
      ${+ovOp > 0 ? `<rect x="0" y="0" width="${size}" height="${size}" fill="rgba(145,160,175,${ovOp})"/>` : ""}
    </g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(245,230,176,0.07)" stroke-width="1"/>
  </svg>`;
}

function moonPhaseName(phase) {
  if (phase < 0.03 || phase > 0.97) return "Nýmáni";
  if (phase < 0.22) return "Vaxandi gormáni";
  if (phase < 0.28) return "Fyrsti kvartill";
  if (phase < 0.47) return "Vaxandi máni";
  if (phase < 0.53) return "Fullmáni";
  if (phase < 0.72) return "Minnkandi máni";
  if (phase < 0.78) return "Síðasti kvartill";
  return "Minnkandi gormáni";
}

function cloudCoverLabel(pct) {
  if (pct < 15) return "skýlaust";
  if (pct < 35) return "lítil ský";
  if (pct < 65) return "nokkur ský";
  if (pct < 85) return "að mestu skýjað";
  return "alskýjað";
}

function moonFishingNote(phase, fraction, cloudCover) {
  const isWaxing = phase < 0.5;
  const dirLabel = isWaxing ? "Vaxandi" : "Minnkandi";
  const pct = Math.round(fraction * 100);
  const effective = cloudCover != null ? fraction * (1 - cloudCover / 100) : fraction;

  if (cloudCover != null && cloudCover > 85) {
    return `Þykk skýjahula (${cloudCover}%) dregur verulega úr birtu tungls — næturnar líkjast nýmána aðstæðum.`;
  }
  if (fraction > 0.9) {
    return "Fullt tungl. Urriðar eru oft virkir við yfirborð í kvöldroðanum, en björtu næturnar geta gert þá varfærnari.";
  }
  if (fraction < 0.1) {
    return "Nýmáni — myrkrar nætur. Stórir urriðar þora frekar að koma upp við yfirborð þegar myrkt er.";
  }
  if (effective > 0.55) {
    return `${dirLabel} tungl, ${pct}% birt. Gott að nota ljósar flugur snemma á kvöldið.`;
  }
  if (effective < 0.15) {
    return `${dirLabel} tungl, ${pct}% birt${cloudCover != null ? ` en skýjahula ${cloudCover}%` : ""}. Dökkar aðstæður — henta vel fyrir stórar flugur.`;
  }
  return `${dirLabel} tungl, ${pct}% birt.`;
}

function formatMoonTime(date) {
  return date.toLocaleTimeString("is-IS", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Atlantic/Reykjavik",
  });
}

function initMoonWidget() {
  const svgContainer   = document.getElementById("moon-svg-container");
  const cloudContainer = document.getElementById("moon-cloud-container");
  const phaseNameEl    = document.getElementById("moon-phase-name");
  const cloudLabelEl   = document.getElementById("moon-cloud-label");
  const illuminationEl = document.getElementById("moon-illumination");
  const timesEl        = document.getElementById("moon-times");
  const noteEl         = document.getElementById("moon-note");

  if (!svgContainer) return;

  if (typeof SunCalc === "undefined") {
    phaseNameEl.textContent = "Ekki tókst að hlaða tunglagögnum.";
    return;
  }

  const now = new Date();
  const LAT = 64.2559;
  const LON = -21.1179;

  const illum = SunCalc.getMoonIllumination(now);
  const phase = illum.phase;
  const fraction = illum.fraction;

  svgContainer.innerHTML = moonPhaseSVG(phase, fraction);
  if (cloudContainer) cloudContainer.innerHTML = cloudCoverSVG(null);
  phaseNameEl.textContent = moonPhaseName(phase);

  const pct = Math.round(fraction * 100);
  illuminationEl.innerHTML = `
    <span>${pct}% birt</span>
    <span class="moon-illum-bar" role="presentation">
      <span class="moon-illum-fill" style="width:${pct}%"></span>
    </span>
  `;

  const mt = SunCalc.getMoonTimes(now, LAT, LON);
  const parts = [];
  if (mt.rise) parts.push(`Rís ${formatMoonTime(mt.rise)}`);
  if (mt.set) parts.push(`Sest ${formatMoonTime(mt.set)}`);
  timesEl.textContent = parts.length ? parts.join(" · ") : "Gengur ekki niður í nótt";

  const renderNote = (cc) => {
    if (cloudContainer) cloudContainer.innerHTML = cloudCoverSVG(cc);
    if (cloudLabelEl) {
      cloudLabelEl.textContent = cc != null
        ? `${cc}% — ${cloudCoverLabel(cc)}`
        : "Óþekkt";
    }
    noteEl.textContent = moonFishingNote(phase, fraction, cc);
  };

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=cloud_cover&timezone=Atlantic%2FReykjavik`
  )
    .then((r) => r.json())
    .then((data) => renderNote(data?.current?.cloud_cover ?? null))
    .catch(() => renderNote(null));
}

initMoonWidget();
