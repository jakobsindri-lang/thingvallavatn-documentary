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
  items.forEach((item) => galleryScroll.appendChild(item));
}

if (galleryScroll && galleryPrev && galleryNext) {
  const scrollStep = () => {
    const item = galleryScroll.querySelector(".gallery-item");
    const gap = parseFloat(getComputedStyle(galleryScroll).gap) || 0;
    return item.getBoundingClientRect().width + gap;
  };

  galleryPrev.addEventListener("click", () => {
    galleryScroll.scrollBy({ left: -scrollStep(), behavior: "smooth" });
  });

  galleryNext.addEventListener("click", () => {
    galleryScroll.scrollBy({ left: scrollStep(), behavior: "smooth" });
  });

  galleryScroll.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      galleryScroll.scrollLeft += event.deltaY;
    }
  });
}

const weatherGrid = document.getElementById("weather-grid");
const anglerCard = document.getElementById("angler-card");
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
  fetch("assets/data/vatnshiti.json")
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
        const month = now.getMonth();
        const date = now.getDate();
        const inSeason =
          (month > 3 || (month === 3 && date >= 20)) &&
          (month < 8 || (month === 8 && date <= 15));

        const verdict = inSeason
          ? "Það er gott að fara að veiða núna!"
          : "Það er gott að fara að veiða núna, en því miður er ekki veiðitími akkúrat núna.";

        const rainText = today.r > 0 ? `, úrkoma ${today.r} mm` : "";

        anglerCard.innerHTML = `
          <p class="angler-verdict">${verdict}</p>
          <p class="angler-detail">
            Í dag í Vatnskoti: ${weatherIcons[today.merki] || "🌡️"} ${Math.round(today.t2)}°,
            vindur ${Math.round(today.f10)} m/s ${windDirections[today.dtexti] || today.dtexti.toUpperCase()}${rainText}.
          </p>
          <p class="angler-note">Veiðitímabil í þjóðgarðinum í Þingvallavatni er 20. apríl til 15. september.</p>
        `;
      }
    })
    .catch(() => {
      if (weatherGrid) weatherGrid.innerHTML = errorMessage;
      if (anglerCard) anglerCard.innerHTML = errorMessage;
    });
}
