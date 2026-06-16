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
    if (window.innerWidth >= 1200) return 2;
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
const anglerCard = document.getElementById("angler-card");
const conditionsTableBody = document.getElementById("conditions-table-body");
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

const waterTemp = document.getElementById("water-temp");

if (waterTemp) {
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
      waterTemp.innerHTML = `Vatnshiti í Þingvallavatni er <strong>${tempLabel}°C</strong> (mælt ${timeLabel}).`;
    })
    .catch(() => {
      waterTemp.textContent = "";
    });
}

if (weatherGrid || anglerCard) {
  const weatherIcons = {
    clear: "☀️",
    partlycloudy: "🌤️",
    mostlycloudy: "⛅",
    cloudy: "☁️",
    rain: "🌧️",
    showers: "🌦️",
    sleet: "🌨️",
    snow: "❄️",
    chanceflurries: "🌨️",
    thunder: "⛈️",
  };

  const windDirections = {
    n: "N",
    na: "NA",
    a: "A",
    sa: "SA",
    s: "S",
    sv: "SV",
    v: "V",
    nv: "NV",
  };

  const errorMessage =
    '<p class="weather-status">Ekki tókst að sækja veðurspá núna. <a href="https://gamli.blika.is/spa/8553" target="_blank" rel="noopener">Skoða spá á Bliku</a>.</p>';

  const fishingSeason = {
    opens: { month: 3, date: 20 },
    closes: { month: 8, date: 15 },
    label: "20. apríl til 15. september",
  };

  const timeSlots = [
    { label: "Morgunn", trout: 2, char: 1 },
    { label: "Dagur", trout: -1, char: 0 },
    { label: "Kvöld", trout: 2, char: 2 },
    { label: "Nótt", trout: 1, char: -1 },
  ];

  const isFishingSeason = (date) => {
    const month = date.getMonth();
    const day = date.getDate();
    return (
      (month > fishingSeason.opens.month ||
        (month === fishingSeason.opens.month && day >= fishingSeason.opens.date)) &&
      (month < fishingSeason.closes.month ||
        (month === fishingSeason.closes.month && day <= fishingSeason.closes.date))
    );
  };

  const scoreWeather = (day) => {
    let score = 0;
    const wind = Number(day.f10) || 0;
    const rain = Number(day.r) || 0;

    if (wind >= 2 && wind <= 8) score += 1;
    if (wind >= 12) score -= 2;
    if (rain > 0 && rain <= 4) score += 1;
    if (rain > 8) score -= 1;
    if (["clear", "partlycloudy", "mostlycloudy"].includes(day.merki)) score += 1;

    return score;
  };

  const conditionFromScore = (score, inSeason) => {
    if (!inSeason) {
      return { label: "Utan tímabils", className: "condition-closed" };
    }
    if (score >= 3) return { label: "Góðar", className: "condition-good" };
    if (score >= 1) return { label: "Sæmilegar", className: "condition-fair" };
    return { label: "Litlar", className: "condition-poor" };
  };

  const renderCondition = (condition) =>
    `<span class="condition ${condition.className}">${condition.label}</span>`;

  const renderConditionsTable = (today, inSeason) => {
    if (!conditionsTableBody) return;
    const weatherScore = scoreWeather(today);
    conditionsTableBody.innerHTML = timeSlots
      .map((slot) => {
        const trout = conditionFromScore(weatherScore + slot.trout, inSeason);
        const char = conditionFromScore(weatherScore + slot.char, inSeason);
        return `
          <tr>
            <td>${slot.label}</td>
            <td>${renderCondition(trout)}</td>
            <td>${renderCondition(char)}</td>
          </tr>
        `;
      })
      .join("");
  };

  fetch("https://api.blika.is/GetBlikaForecast24klst/8553/")
    .then((response) => response.json())
    .then((days) => {
      if (weatherGrid) {
        weatherGrid.innerHTML = "";
        days.slice(0, 7).forEach((day) => {
          const date = new Date(day.dags_spar);
          const dateLabel = date.toLocaleDateString("is-IS", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
          });

          const item = document.createElement("div");
          item.className = "weather-day";
          item.innerHTML = `
            <div class="weather-date">${dateLabel}</div>
            <div class="weather-icon">${weatherIcons[day.merki] || "🌡️"}</div>
            <div class="weather-temp">${Math.round(day.t2)}°</div>
            <div class="weather-wind">${Math.round(day.f10)} m/s ${windDirections[day.dtexti] || day.dtexti.toUpperCase()}</div>
          `;
          weatherGrid.appendChild(item);
        });
      }

      if (anglerCard && days.length) {
        const today = days[0];
        const now = new Date();
        const inSeason = isFishingSeason(now);
        const weatherScore = scoreWeather(today);

        const overallCondition = conditionFromScore(weatherScore + 1, inSeason);
        const verdict = inSeason
          ? overallCondition.label === "Góðar"
            ? "Aðstæður líta vel út fyrir veiði í dag."
            : "Aðstæður eru veiðilegar, en ekki endilega í toppi."
          : "Veiðitímabilið er ekki opið akkúrat núna.";

        const rainText = today.r > 0 ? `, úrkoma ${today.r} mm` : "";

        anglerCard.innerHTML = `
          <p class="angler-verdict">${verdict}</p>
          <p class="angler-detail">
            Í dag í Vatnskoti: ${weatherIcons[today.merki] || "🌡️"} ${Math.round(today.t2)}°,
            vindur ${Math.round(today.f10)} m/s ${windDirections[today.dtexti] || today.dtexti.toUpperCase()}${rainText}.
          </p>
          <p class="angler-note">Veiðitímabil í þjóðgarðinum í Þingvallavatni er ${fishingSeason.label}.</p>
        `;

        renderConditionsTable(today, inSeason);
      } else if (conditionsTableBody) {
        conditionsTableBody.innerHTML = `
          <tr>
            <td colspan="3">Engin veðurspá fannst til að reikna aðstæður.</td>
          </tr>
        `;
      }
    })
    .catch(() => {
      if (weatherGrid) weatherGrid.innerHTML = errorMessage;
      if (anglerCard) anglerCard.innerHTML = errorMessage;
      if (conditionsTableBody) {
        conditionsTableBody.innerHTML = `
          <tr>
            <td colspan="3">Ekki tókst að reikna aðstæður núna.</td>
          </tr>
        `;
      }
    });
}
