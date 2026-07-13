// forecast-engine.js
// Útreikningseiningar veiðispárinnar.
// Fer eftir FORECAST_CONFIG (forecast-config.js) og SunCalc (CDN).

'use strict';

// ── Hjálparföll ─────────────────────────────────────────────────────────────

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** Athugar hvort dagsetning sé á milli tveggja daga/mánaðar markanna (0-indexed mánuðir) */
function dateInRange(date, startMonth, startDay, endMonth, endDay) {
  const m = date.getMonth();
  const d = date.getDate();
  const afterStart = m > startMonth || (m === startMonth && d >= startDay);
  const beforeEnd  = m < endMonth   || (m === endMonth   && d <= endDay);
  return afterStart && beforeEnd;
}

/** Breytir vindáttgráðum (0–360) yfir í íslenska texta */
function degreesToWindDir(deg) {
  const dirs = ['n', 'na', 'a', 'sa', 's', 'sv', 'v', 'nv'];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

/** Sækir Íslandsklukku (UTC = Íslandstími árið um kring) */
function icelandHour(date) {
  return date.getUTCHours();
}

// ── Veiðitímabil ────────────────────────────────────────────────────────────

function isFishingSeason(date) {
  const { openMonth, openDay, closeMonth, closeDay } = FORECAST_CONFIG.season;
  return dateInRange(date, openMonth, openDay, closeMonth, closeDay);
}

// ── Sólgögn ──────────────────────────────────────────────────────────────────

/**
 * Skilar { sunrise, sunset, solarElevationDeg } fyrir gefna dagsetningu.
 * Notar SunCalc.
 */
function calculateSolarTiming(date) {
  const { lat, lon } = FORECAST_CONFIG.location;
  const times = SunCalc.getTimes(date, lat, lon);
  const pos   = SunCalc.getPosition(date, lat, lon);
  return {
    sunrise:          times.sunrise,
    sunset:           times.sunset,
    solarElevationDeg: pos.altitude * (180 / Math.PI),
  };
}

// ── Tunglagögn ───────────────────────────────────────────────────────────────

/**
 * Skilar { illumination, phase, elevationDeg, isAboveHorizon, rise, set }
 */
function calculateMoonlightExposure(date) {
  const { lat, lon } = FORECAST_CONFIG.location;
  const illum = SunCalc.getMoonIllumination(date);
  const pos   = SunCalc.getMoonPosition(date, lat, lon);
  const mt    = SunCalc.getMoonTimes(date, lat, lon);
  return {
    illumination:   illum.fraction,
    phase:          illum.phase,
    elevationDeg:   pos.altitude * (180 / Math.PI),
    isAboveHorizon: pos.altitude > 0,
    rise:           mt.rise  || null,
    set:            mt.set   || null,
  };
}

// ── Yfirborðsástand ──────────────────────────────────────────────────────────

/**
 * Reiknar yfirborðsástand (spegilslétt / gára / almennt).
 * windSpeed: m/s | null
 * windDir: 'n','na','a',... | null
 * Skilar { state: 'mirror'|'ripple'|'normal'|'unknown', charBonus, flyPenalty, label }
 */
function calculateSurfaceCondition(windSpeed, windDir) {
  const cfg = FORECAST_CONFIG.char.surface;

  if (windSpeed == null || windDir == null) {
    return { state: 'unknown', charBonus: 0, flyPenalty: 0, label: null };
  }

  const isNorth = windDir === 'n';

  const mirrorMax   = isNorth ? cfg.mirrorNorthWindMax : cfg.mirrorOtherWindMax;
  const rippleMin   = isNorth ? cfg.rippleNorthWindMin : cfg.rippleOtherWindMin;
  const rippleMax   = isNorth ? cfg.rippleNorthWindMax : cfg.rippleOtherWindMax;

  if (windSpeed <= mirrorMax) {
    return {
      state:      'mirror',
      charBonus:  cfg.mirrorPenalty,
      flyPenalty: FORECAST_CONFIG.fly.mirrorPenalty,
      label:      'Spegilslétt vatn',
    };
  }
  if (windSpeed >= rippleMin && windSpeed <= rippleMax) {
    return {
      state:      'ripple',
      charBonus:  cfg.rippleBonus,
      flyPenalty: 0,
      label:      'Létt gára',
    };
  }
  return { state: 'normal', charBonus: 0, flyPenalty: 0, label: null };
}

// ── Urriðagluggi ─────────────────────────────────────────────────────────────

/**
 * Ákvarðar hvaða "timeslot" núverandi tími er í miðað við sólsetur/sólarupprás.
 * Meðhöndlar tímabil yfir miðnætti.
 * Skilar: 'peak' | 'midNight' | 'preRise' | 'postRise' | 'outOfWindow'
 * og { refSunset, refSunrise } sem voru notuð.
 */
function getTroutTimeSlot(now) {
  const { lat, lon } = FORECAST_CONFIG.location;
  const win = FORECAST_CONFIG.trout.window;
  const MS  = 60 * 1000;

  const dayOf   = SunCalc.getTimes(now, lat, lon);
  const dayPrev = SunCalc.getTimes(new Date(+now - 86400000), lat, lon);
  const dayNext = SunCalc.getTimes(new Date(+now + 86400000), lat, lon);

  // Athugar hvort 'now' falli innan tiltekins gluggapars
  function checkWindow(sunset, sunrise) {
    const open    = +sunset  - win.openBeforeSunset * MS;
    const close   = +sunrise + win.closeAfterSunrise * MS;
    if (+now < open || +now > close) return null;

    const peakEnd      = +sunset  + win.peakEnd * MS;
    const declineStart = +sunrise - win.declineStartBeforeSunrise * MS;
    const riseEnd      = +sunrise + win.closeAfterSunrise * MS;

    if (+now >= +sunset - win.openBeforeSunset * MS && +now < peakEnd) return 'peak';
    if (+now >= peakEnd && +now < declineStart)                          return 'midNight';
    if (+now >= declineStart && +now < +sunrise)                         return 'preRise';
    if (+now >= +sunrise && +now <= riseEnd)                             return 'postRise';
    return 'peak'; // fallback
  }

  // Prófar bæði gærdagur-glugga og dagurinn-glugga
  const slotPrev = checkWindow(dayPrev.sunset, dayOf.sunrise);
  if (slotPrev) return { slot: slotPrev, refSunset: dayPrev.sunset, refSunrise: dayOf.sunrise };

  const slotCurr = checkWindow(dayOf.sunset, dayNext.sunrise);
  if (slotCurr) return { slot: slotCurr, refSunset: dayOf.sunset, refSunrise: dayNext.sunrise };

  return { slot: 'outOfWindow', refSunset: dayOf.sunset, refSunrise: dayNext.sunrise };
}

// ── Söguleg tunglgögn (fyrri bjartar nætur) ─────────────────────────────────

/**
 * Reiknar fjölda bjartra tunglnaeta síðustu 72 klst.
 * historicalHourlyCloud: [{ utcHour: Date, cloudCover: number }] | null
 * Skilar: { brightNights: number } — 0, 1, eða 2+
 */
function calculateHistoricalMoonNights(now, historicalHourlyCloud) {
  if (!historicalHourlyCloud || historicalHourlyCloud.length === 0) {
    return { brightNights: 0, dataAvailable: false };
  }

  const { lat, lon } = FORECAST_CONFIG.location;
  const mcfg = FORECAST_CONFIG.trout.moon;

  let brightCount = 0;

  // Athugar gærdagsins-nótt, í gær-í-fyrradag-nótt, og tvær-daga-aftur-nótt
  for (let daysBack = 1; daysBack <= 3; daysBack++) {
    const nightDate = new Date(+now - daysBack * 86400000);
    const solar     = SunCalc.getTimes(nightDate, lat, lon);
    const nextSolar = SunCalc.getTimes(new Date(+nightDate + 86400000), lat, lon);

    const illum     = SunCalc.getMoonIllumination(nightDate);
    if (illum.fraction < mcfg.brightNightMinMoon) continue;

    // Athugar hvort tunglið hafi verið yfir sjóndeildarhringi í fæðuglugga
    const feedStart = new Date(nightDate);
    feedStart.setUTCHours(mcfg.feedingWindowStartH, 0, 0, 0);
    const feedEnd = new Date(nightDate);
    feedEnd.setUTCHours(0, 0, 0, 0);
    feedEnd.setTime(+feedEnd + 86400000);
    feedEnd.setUTCHours(mcfg.feedingWindowEndH, 0, 0, 0);

    const moonTimes  = SunCalc.getMoonTimes(nightDate, lat, lon);
    const moonAbove = moonTimes.rise && moonTimes.set &&
      (+moonTimes.rise < +feedEnd) && (+moonTimes.set > +feedStart);
    if (!moonAbove) continue;

    // Meðal skýjahula á fæðugluggatíma þessarar nætur
    const relevant = historicalHourlyCloud.filter(h => {
      const t = +h.utcHour;
      return t >= +feedStart && t < +feedEnd;
    });
    if (relevant.length === 0) continue;

    const avgCloud = relevant.reduce((s, h) => s + h.cloudCover, 0) / relevant.length;
    if (avgCloud < mcfg.brightNightMaxCloud) {
      brightCount++;
    }
  }

  return { brightNights: Math.min(brightCount, 2), dataAvailable: true };
}

// ── Urriðamat ────────────────────────────────────────────────────────────────

/**
 * inputs:
 *   now             Date
 *   moon            { illumination, isAboveHorizon, ... }   (calculateMoonlightExposure)
 *   cloudCover      number | null   (0–100)
 *   historicalMoon  { brightNights, dataAvailable }
 *
 * Skilar: { score: 0–4, reasons: string[], provisional: boolean }
 */
function calculateTroutScore(inputs) {
  const { now, moon, cloudCover, historicalMoon } = inputs;
  const cfg  = FORECAST_CONFIG.trout;
  const mcfg = cfg.moon;

  if (!isFishingSeason(now)) return null;

  const isSpring    = dateInRange(now, cfg.springSeason.startMonth, cfg.springSeason.startDay,
                                       cfg.springSeason.endMonth,   cfg.springSeason.endDay);
  const scores      = isSpring ? cfg.springScores : cfg.postSpringScores;
  const provisional = isSpring ? false : cfg.postSpringScores.isProvisional;

  const { slot } = getTroutTimeSlot(now);
  const base = scores[slot] ?? scores.outOfWindow;

  const reasons = [];
  const provisionalReasons = [];

  // Skýring á grunnmati
  switch (slot) {
    case 'peak':        reasons.push('Bestu tökulíkur á nóttu — rétt í kringum sólsetur'); break;
    case 'midNight':    reasons.push('Góðar aðstæður miðnæturinnar'); break;
    case 'preRise':     reasons.push('Birta fær er að koma — aðstæður að lagast'); break;
    case 'postRise':    reasons.push('Nýlokið sólarupprás — aðstæður á niðurleið'); break;
    case 'outOfWindow': reasons.push(isSpring ? 'Utan virkasta veiðigluggans' : 'Utan næturveiðigluggans'); break;
  }
  if (isSpring && slot !== 'outOfWindow') {
    reasons.push('Vorveiðitímabil — eitt besta tímabil ársins');
  }
  if (provisional) {
    provisionalReasons.push('Grunnmat eftir 20. maí er bráðabirgðaviðmið');
  }

  // ── Tunglviðurlög ────────────────────────────────────────────────────────
  let moonPenalty    = 0;
  let priorPenalty   = 0;
  let darknessPenalty = 0;

  const cloudKnown    = cloudCover != null;
  const overcast      = cloudKnown && cloudCover >= mcfg.overcastMin;
  const clearSky      = cloudKnown && cloudCover <= mcfg.clearSkyMax;
  const moonVisible   = moon.isAboveHorizon && !overcast;
  const moonBright70  = moon.illumination >= mcfg.lowThreshold;
  const moonBright90  = moon.illumination >= mcfg.highThreshold;

  if (moonVisible && moonBright90 && clearSky) {
    moonPenalty = mcfg.highPenalty;
    reasons.push(`Tungl ${Math.round(moon.illumination * 100)}% birt og heiðskírt — erfiðara að blekkja urriðann`);
  } else if (moonVisible && moonBright70 && clearSky) {
    moonPenalty = mcfg.midPenalty;
    reasons.push(`Tungl ${Math.round(moon.illumination * 100)}% birt — nokkur áhrif á tökulíkur`);
  } else if (!cloudKnown && moonBright70 && moon.isAboveHorizon) {
    moonPenalty = mcfg.midPenalty;
    reasons.push(`Tungl ${Math.round(moon.illumination * 100)}% birt — skýjahula óþekkt, gert ráð fyrir nokkrum áhrifum`);
  }

  // Kolniðamyrkur
  const veryDark = moon.illumination < mcfg.darknessMaxMoon &&
                   cloudKnown && cloudCover > mcfg.darknessMinCloud;
  if (veryDark) {
    darknessPenalty = mcfg.totalDarknessPenalty;
    reasons.push('Mjög lítil heildarbirta — nýmáni og þykk skýjahula geta gert veiðina erfiðari');
  }

  // Fyrri bjartar nætur
  if (historicalMoon?.dataAvailable) {
    if (historicalMoon.brightNights >= 2) {
      priorPenalty = mcfg.priorTwoPlusPenalty;
      reasons.push('Tvær eða fleiri bjartar tunglnætur nýlega — urriðinn gæti verið saddur');
    } else if (historicalMoon.brightNights === 1) {
      priorPenalty = mcfg.priorOnePenalty;
      reasons.push('Ein björt tunglnótt nýlega — urriðinn gæti verið á meltingunni');
    }
  }

  // Hámarksmörk samanlagðra viðurlaga
  const totalMoonPenalty = clamp(moonPenalty + priorPenalty + darknessPenalty,
                                 mcfg.maxCombinedPenalty, 0);

  const finalScore = clamp(base + totalMoonPenalty, 0, 4);

  return {
    score:      finalScore,
    slot,
    reasons:    [...reasons, ...provisionalReasons].slice(0, 3),
    provisional,
  };
}

// ── Bleikjumat ───────────────────────────────────────────────────────────────

/**
 * inputs:
 *   now         Date
 *   waterTemp   number | null   (°C)
 *   cloudCover  number | null
 *   surface     { state, charBonus, label }
 *
 * Skilar: { score: 0–4, reasons: string[], activeModel: 'large'|'small'|'both'|'none' }
 */
function calculateCharScore(inputs) {
  const { now, waterTemp, cloudCover, surface } = inputs;
  const cfg = FORECAST_CONFIG.char;

  if (!isFishingSeason(now)) return null;

  const h = icelandHour(now);

  function scoreFromHours(table) {
    for (const [from, to, sc] of table) {
      if (h >= from && h < to) return sc;
    }
    return 0;
  }

  // ── Stórbleikja ────────────────────────────────────────────────────────
  const lc = cfg.largeChar;
  const largeCharStarted = waterTemp != null && waterTemp >= lc.waterTempTrigger
    ? true
    : dateInRange(now, lc.defaultStartMonth, lc.defaultStartDay,
                       FORECAST_CONFIG.season.closeMonth, FORECAST_CONFIG.season.closeDay);

  let largeScore  = largeCharStarted ? scoreFromHours(lc.hourScores) : -1;
  const largeReasons = [];

  if (largeCharStarted) {
    largeReasons.push('Stórbleikjutímabilið er í gangi');
  }

  // ── Smábleikja ─────────────────────────────────────────────────────────
  const sc = cfg.smallChar;
  const inPeak = dateInRange(now, sc.peakStartMonth, sc.peakStartDay,
                                   sc.peakEndMonth,   sc.peakEndDay);
  const inLate = dateInRange(now, sc.lateCapStartMonth, sc.lateCapStartDay,
                                   FORECAST_CONFIG.season.closeMonth, FORECAST_CONFIG.season.closeDay);

  let smallScore  = -1;
  const smallReasons = [];

  if (inPeak) {
    smallScore = scoreFromHours(sc.hourScores);
    smallReasons.push('Meginbleikjutímabilið (20. júní – 10. ágúst) er í fullum gangi');
  } else if (inLate) {
    smallScore = Math.min(scoreFromHours(sc.hourScores), sc.lateCapMaxScore);
    smallReasons.push('Seintímabili bleikju (eftir 10. ágúst) — hrygningarhegðun dregur úr tökulíkum');
  }

  // ── Sameiginlegar leiðréttingar (gilda fyrir bæði líkön) ─────────────
  const adjReasons = [];
  let tempPenalty = 0;
  if (waterTemp == null) {
    adjReasons.push('Vatnshiti ekki tiltækur — hitamat sleppt');
  } else if (waterTemp < cfg.waterTemp.coldPenalty2Below) {
    tempPenalty = -2;
    adjReasons.push(`Kaldur vatnshiti (${waterTemp.toFixed(1)}°C) — bleikja hefur lítinn hug á að taka`);
  } else if (waterTemp < cfg.waterTemp.coldPenalty1Below) {
    tempPenalty = -1;
    adjReasons.push(`Fremur kaldur vatnshiti (${waterTemp.toFixed(1)}°C)`);
  }

  let solarBonus = 0;
  if (cloudCover != null && cloudCover <= cfg.solar.sunnyCloudMax) {
    solarBonus = cfg.solar.sunnyBonus;
    adjReasons.push('Sólskin og lítil skýjahula — bleikjan er virk');
  }

  const surfaceAdj = surface?.charBonus ?? 0;
  if (surfaceAdj > 0) adjReasons.push(`${surface.label} hjálpar til við að fela flugulínuna`);
  if (surfaceAdj < 0) adjReasons.push(`${surface.label} — sjáanlegri lína getur dregið úr tökulíkum`);

  // ── Lokamat hvers líkans — inLate gildir fyrir bæði (hrygning hefst) ──
  function applyAdj(baseScore) {
    if (baseScore < 0) return null;
    let s = clamp(baseScore + tempPenalty + solarBonus + surfaceAdj, 0, 4);
    if (inLate) s = Math.min(s, sc.lateCapMaxScore);
    return s;
  }

  const largeFinalScore = applyAdj(largeScore);
  const smallFinalScore = applyAdj(smallScore);

  // ── Velja hærra líkanið til yfirlit ────────────────────────────────────
  let finalScore, activeModel, baseReasons;

  if (largeFinalScore !== null && (smallFinalScore === null || largeFinalScore >= smallFinalScore)) {
    finalScore  = largeFinalScore;
    activeModel = smallFinalScore !== null ? 'both' : 'large';
    baseReasons = largeReasons;
  } else if (smallFinalScore !== null) {
    finalScore  = smallFinalScore;
    activeModel = 'small';
    baseReasons = smallReasons;
  } else {
    return {
      score: 0, largeFinalScore: null, smallFinalScore: null,
      reasons: ['Engin bleikjulíkön virk á þessum tíma'], activeModel: 'none',
    };
  }

  return {
    score:           finalScore,
    largeFinalScore,
    smallFinalScore,
    reasons:         [...baseReasons, ...adjReasons].slice(0, 3),
    activeModel,
  };
}

// ── Fluguveiðiaðstæður ───────────────────────────────────────────────────────

/**
 * inputs:
 *   windSpeed   number | null
 *   windDir     string | null   ('n','na','a','sa','s','sv','v','nv')
 *   surface     { state, flyPenalty, label }
 *
 * Skilar: { score: 0–4, reasons: string[] }
 */
function calculateFlyFishingConditions(inputs) {
  const { windSpeed, windDir, surface } = inputs;
  const cfg = FORECAST_CONFIG.fly;

  if (windSpeed == null || windDir == null) {
    return { score: 2, reasons: ['Vindgögn ekki tiltæk — mat óáreiðanlegt'] };
  }

  const isSouth = cfg.southDirs.includes(windDir);
  const limit   = isSouth ? cfg.southLimit : cfg.otherLimit;

  const reasons = [];

  // Yfir mörkum
  if (windSpeed > limit) {
    const score = cfg.directDrop ? 0 : 1;
    reasons.push(`${isSouth ? 'Sunnanátt' : 'Sterkur vindur'} ${Math.round(windSpeed)} m/s — of mikið fyrir örugg köst`);
    return { score, reasons };
  }

  // Undir mörkum — reikna grunnmat úr vindhraðatöflu
  const table = cfg.windScore;
  let windScore = 0;
  for (const [max, sc] of table) {
    if (windSpeed <= max) { windScore = sc; break; }
    windScore = sc; // tekur lægsta ef yfir öllum
  }

  if (windScore >= 4) {
    reasons.push(`Lítill vindur (${Math.round(windSpeed)} m/s) — auðveld köst`);
  } else if (windScore === 3) {
    reasons.push(`Þægilegur vindur (${Math.round(windSpeed)} m/s)`);
  } else if (windScore <= 2) {
    reasons.push(`Fremur mikill vindur (${Math.round(windSpeed)} m/s) — köst krefjandi`);
  }

  // Yfirborðsviðurlög
  const surfPenalty = surface?.flyPenalty ?? 0;
  if (surfPenalty < 0) {
    reasons.push(`${surface.label} — lína og taumur sýnilegri, jafnvel þótt köst séu auðveld`);
  }

  const finalScore = clamp(windScore + surfPenalty, 0, 4);
  return { score: finalScore, reasons: reasons.slice(0, 3) };
}

// ── Skýring ─────────────────────────────────────────────────────────────────

/**
 * Byggir lesanlega texta-skýringu úr reasons-lista.
 */
function buildForecastExplanation(reasons) {
  if (!reasons || reasons.length === 0) return '';
  return reasons.join('. ') + '.';
}

// ── Aðalfall ─────────────────────────────────────────────────────────────────

/**
 * Keyrir alla spána og skilar ForecastResult.
 *
 * rawInputs: {
 *   cloudCover:           number | null
 *   windSpeedMs:          number | null
 *   windDirDeg:           number | null     (degrees 0–360)
 *   windDirText:          string | null     (Blika text, yfirskrifar windDirDeg)
 *   waterTemp:            number | null
 *   historicalHourlyCloud: [{ utcHour: Date, cloudCover: number }] | null
 *   dataWarnings:         string[]
 * }
 */
function runForecast(rawInputs, nowOverride) {
  const now = nowOverride instanceof Date ? nowOverride : new Date();

  if (!isFishingSeason(now)) {
    return { inSeason: false, trout: null, char: null, fly: null,
             dataWarnings: rawInputs.dataWarnings || [] };
  }

  // Reikna sól/tungl
  const moon    = calculateMoonlightExposure(now);
  const surface = calculateSurfaceCondition(rawInputs.windSpeedMs,
                    rawInputs.windDirText ?? (rawInputs.windDirDeg != null
                      ? degreesToWindDir(rawInputs.windDirDeg) : null));

  const historicalMoon = calculateHistoricalMoonNights(now, rawInputs.historicalHourlyCloud);

  const trout = calculateTroutScore({
    now, moon,
    cloudCover:     rawInputs.cloudCover,
    historicalMoon,
  });

  const char = calculateCharScore({
    now,
    waterTemp:  rawInputs.waterTemp,
    cloudCover: rawInputs.cloudCover,
    surface,
  });

  const fly = calculateFlyFishingConditions({
    windSpeed: rawInputs.windSpeedMs,
    windDir:   rawInputs.windDirText ?? (rawInputs.windDirDeg != null
                 ? degreesToWindDir(rawInputs.windDirDeg) : null),
    surface,
  });

  return {
    inSeason: true,
    trout, char, fly,
    surface,
    dataWarnings: rawInputs.dataWarnings || [],
  };
}

// Gera aðgengilegt utan skrárinnar
if (typeof module !== 'undefined') {
  module.exports = {
    isFishingSeason, calculateSolarTiming, calculateMoonlightExposure,
    calculateSurfaceCondition, getTroutTimeSlot, calculateHistoricalMoonNights,
    calculateTroutScore, calculateCharScore, calculateFlyFishingConditions,
    buildForecastExplanation, runForecast, degreesToWindDir, clamp, dateInRange,
  };
}
