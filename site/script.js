console.log("Þingvallavatn — kynningar- og stuðningssíða er keyrð.");

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
  Hallvík: {
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

if (mapSvgMount && mapInfo) {
  const mapNameAliases = {
    Langatangi: "Langitangi",
  };
  const placeNames = Object.keys(mapPlaces);
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

    mapKicker.textContent = place.kicker;
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

  if (mapPlaceList) {
    placeNames.forEach((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-place-button";
      button.dataset.mapPlace = name;
      button.textContent = name;
      button.addEventListener("click", () => updateMapInfo(name));
      mapPlaceList.appendChild(button);
    });
  }

  fetch("assets/Map/veidisvaedi_thingvallavatni.svg")
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
      mapSvgMount.replaceChildren(document.importNode(svg, true));

      const inlineSvg = mapSvgMount.querySelector("svg");
      const pointLayer = document.createElementNS(svgNamespace, "g");
      pointLayer.setAttribute("id", "map-points");

      mapSvgMount.querySelectorAll(".ornefni, .ornefni-halo").forEach((label) => {
        label.setAttribute("aria-hidden", "true");
      });

      mapSvgMount.querySelectorAll(".ornefni").forEach((label) => {
        const sourceName = label.dataset.nafn || label.textContent.trim();
        const name = normalizeMapName(sourceName);
        const x = label.getAttribute("x");
        const y = label.getAttribute("y");

        if (!x || !y) return;

        const point = document.createElementNS(svgNamespace, "circle");
        point.classList.add("map-point");
        if (mapPlaces[name]) point.classList.add("map-point-featured");
        point.dataset.nafn = name;
        point.setAttribute("cx", x);
        point.setAttribute("cy", y);
        point.setAttribute("r", mapPlaces[name] ? "5.5" : "3.8");
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

      inlineSvg.appendChild(pointLayer);

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

const waterTempEl = document.getElementById("water-temp");

if (waterTempEl) {
  fetch(`assets/data/vatnshiti.json?v=${Date.now()}`, { cache: "no-store" })
    .then((response) => response.json())
    .then((data) => {
      const updated = new Date(data.updated);
      const timeLabel = updated.toLocaleString("is-IS", {
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const tempLabel = data.temp.toFixed(1).replace(".", ",");
      waterTempEl.innerHTML = `Vatnshiti í Þingvallavatni er <strong>${tempLabel}°C</strong> (mælt ${timeLabel}).`;
    })
    .catch(() => {
      waterTempEl.textContent = "";
    });
}

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
      const first3 = days.slice(0, 3);
      if (!first3.length) { weatherGrid.innerHTML = blikaError; return; }
      weatherGrid.innerHTML = "";
      first3.forEach((day) => {
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
  { key: "morgunn", repHour:  9 },
  { key: "dagur",   repHour: 15 },
  { key: "kvold",   repHour: 20 },
  { key: "nott",    repHour: 23 },
];

function getCurrentSlotKey() {
  const h = new Date().getUTCHours();
  if (h >=  6 && h < 12) return "morgunn";
  if (h >= 12 && h < 18) return "dagur";
  if (h >= 18 && h < 22) return "kvold";
  return "nott";
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
    fetch(`assets/data/vatnshiti.json?v=${Date.now()}`, { cache: "no-store" })
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
  const slotResults    = VSP_SLOTS.map((s) => runForecast(rawInputs, slotNow(s.repHour)));

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

  const cloudOp = cloudCover != null && cloudCover > 5
    ? (cloudCover / 100 * 0.72).toFixed(2)
    : "0";
  const showCloud = parseFloat(cloudOp) > 0;

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
    ${showCloud ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(175,190,210,${cloudOp})"/>` : ""}
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
  const svgContainer = document.getElementById("moon-svg-container");
  const phaseNameEl = document.getElementById("moon-phase-name");
  const illuminationEl = document.getElementById("moon-illumination");
  const timesEl = document.getElementById("moon-times");
  const cloudsEl = document.getElementById("moon-clouds");
  const noteEl = document.getElementById("moon-note");

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

  svgContainer.innerHTML = moonPhaseSVG(phase, fraction, null);
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
    svgContainer.innerHTML = moonPhaseSVG(phase, fraction, cc);
    if (cc != null) {
      cloudsEl.textContent = `Skýjahula: ${cc}% — ${cloudCoverLabel(cc)}`;
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
