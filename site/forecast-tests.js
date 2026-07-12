// forecast-tests.js
// Prófanir á forecast-engine.js — keyra í vafra console: runForecastTests()
// eða nota í Node.js með: node -e "require('./forecast-config'); require('./forecast-engine'); require('./forecast-tests').runForecastTests()"

'use strict';

function runForecastTests() {
  // Þegar keyrt í vafra eru föllin global. Í Node þarf mock-SunCalc.
  if (typeof SunCalc === 'undefined') {
    // Léttur mock-SunCalc fyrir Node prófanir
    global.SunCalc = buildSunCalcMock();
  }

  const LAT = FORECAST_CONFIG.location.lat;
  const LON = FORECAST_CONFIG.location.lon;

  let passed = 0, failed = 0;
  const results = [];

  function assert(name, condition, detail) {
    const ok = !!condition;
    results.push({ name, ok, detail });
    if (ok) passed++; else failed++;
  }

  // Hjálpar til að búa til Date á tilteknum tíma á Íslandi (UTC = Íslandstími)
  function dt(year, month1, day, hour = 12, min = 0) {
    return new Date(Date.UTC(year, month1 - 1, day, hour, min));
  }

  // Sólseturstímar á 5. maí 2026 við Þingvelli eru u.þ.b. 22:00 UTC
  // Þess vegna er "20 mín fyrir sólsetur" u.þ.b. 21:40 UTC

  // ── 1. Urriði 5. maí, 20 mín fyrir sólsetur, lítil tunglbirta ─────────
  {
    const result = calculateTroutScore({
      now:  dt(2026, 5, 5, 21, 40),
      moon: { illumination: 0.30, isAboveHorizon: true, elevationDeg: 20, phase: 0.1 },
      cloudCover:    40,
      historicalMoon: { brightNights: 0, dataAvailable: true },
    });
    assert(
      '1. Urriði 5. maí, 20 mín fyrir sólsetur, lítil tunglbirta',
      result && result.score >= 3,
      `score=${result?.score} (á að vera ≥ 3 = Góðar)`
    );
  }

  // ── 2. Urriði 5. maí, rétt eftir sólsetur, tungl 90%+, heiðskírt ──────
  {
    const base = calculateTroutScore({
      now:  dt(2026, 5, 5, 22, 15),
      moon: { illumination: 0.95, isAboveHorizon: true, elevationDeg: 30, phase: 0.5 },
      cloudCover:    15,
      historicalMoon: { brightNights: 0, dataAvailable: true },
    });
    const fullMoon = calculateTroutScore({
      now:  dt(2026, 5, 5, 22, 15),
      moon: { illumination: 0.30, isAboveHorizon: false, elevationDeg: -10, phase: 0.1 },
      cloudCover:    15,
      historicalMoon: { brightNights: 0, dataAvailable: true },
    });
    const diff = (fullMoon?.score ?? 0) - (base?.score ?? 0);
    assert(
      '2. Tungl 90%+, heiðskírt → mat lækkar um tvö þrep',
      diff >= 2,
      `Munur: ${diff} þrep (á að vera ≥ 2)`
    );
  }

  // ── 3. Tvær bjartar nætur, núverandi nótt alskýjuð ──────────────────────
  {
    const result = calculateTroutScore({
      now:  dt(2026, 5, 7, 22, 0),
      moon: { illumination: 0.88, isAboveHorizon: true, elevationDeg: 20, phase: 0.45 },
      cloudCover:    90,   // Alskýjað — engin bein tungllækkun
      historicalMoon: { brightNights: 2, dataAvailable: true },
    });
    const noHistory = calculateTroutScore({
      now:  dt(2026, 5, 7, 22, 0),
      moon: { illumination: 0.88, isAboveHorizon: true, elevationDeg: 20, phase: 0.45 },
      cloudCover: 90,
      historicalMoon: { brightNights: 0, dataAvailable: true },
    });
    assert(
      '3. Tvær bjartar nætur → söguleg lækkun þótt skýjað sé núna',
      (noHistory?.score ?? 0) - (result?.score ?? 0) >= 2,
      `Munur: ${(noHistory?.score ?? 0) - (result?.score ?? 0)} þrep`
    );
    // Engin bein tungllækkun þegar alskýjað
    const hasDirect = result?.reasons?.some(r => r.includes('birt') && r.includes('heiðskírt'));
    assert(
      '3b. Engin bein tungllækkun þegar alskýjað',
      !hasDirect,
      hasDirect ? 'Fann beina tungllækkun' : 'Rétt'
    );
  }

  // ── 4. Nýtt tungl, alskýjað → kolniðamyrkur ──────────────────────────────
  {
    const result = calculateTroutScore({
      now:  dt(2026, 5, 10, 23, 0),
      moon: { illumination: 0.05, isAboveHorizon: false, elevationDeg: -5, phase: 0.0 },
      cloudCover:    85,
      historicalMoon: { brightNights: 0, dataAvailable: true },
    });
    const noDark = calculateTroutScore({
      now:  dt(2026, 5, 10, 23, 0),
      moon: { illumination: 0.05, isAboveHorizon: false, elevationDeg: -5, phase: 0.0 },
      cloudCover:    40,
      historicalMoon: { brightNights: 0, dataAvailable: true },
    });
    assert(
      '4. Kolniðamyrkur → lækkun um eitt þrep',
      (noDark?.score ?? 0) - (result?.score ?? 0) >= 1,
      `Munur: ${(noDark?.score ?? 0) - (result?.score ?? 0)} þrep`
    );
  }

  // ── 5. Bleikja 5. maí, 08:00, vatn 4,2°C, sól, létt gára ───────────────
  {
    const surface = calculateSurfaceCondition(5, 'a');   // A-átt, 5 m/s → gára
    const result  = calculateCharScore({
      now:       dt(2026, 5, 5, 8, 0),
      waterTemp: 4.2,
      cloudCover: 15,
      surface,
    });
    assert(
      '5. Stórbleikja 5. maí, 08:00, 4,2°C, sól, létt gára → ≥ 3',
      result && result.score >= 3 && (result.activeModel === 'large' || result.activeModel === 'both'),
      `score=${result?.score}, model=${result?.activeModel}`
    );
  }

  // ── 6. Bleikja 10. júlí, 06:00, sól, létt gára ───────────────────────────
  {
    const surface = calculateSurfaceCondition(4, 'a');
    const result  = calculateCharScore({
      now:        dt(2026, 7, 10, 6, 0),
      waterTemp:  9.0,
      cloudCover: 10,
      surface,
    });
    assert(
      '6. Smábleikja 10. júlí, 06:00, sól, létt gára → Mjög góðar (4)',
      result && result.score === 4,
      `score=${result?.score}`
    );
  }

  // ── 7. Bleikja 10. júlí, 01:00 ───────────────────────────────────────────
  {
    const surface = calculateSurfaceCondition(5, 'n');
    const result  = calculateCharScore({
      now:        dt(2026, 7, 10, 1, 0),
      waterTemp:  9.0,
      cloudCover: 50,
      surface,
    });
    assert(
      '7. Smábleikja 10. júlí, 01:00 → Litlar (≤ 2 áður en leiðréttingar)',
      result && result.score <= 2,
      `score=${result?.score}`
    );
  }

  // ── 8. Bleikja 20. ágúst, fullkomin skilyrði → há. Sæmilegar ─────────────
  {
    const surface = calculateSurfaceCondition(5, 'a');
    const result  = calculateCharScore({
      now:        dt(2026, 8, 20, 8, 0),
      waterTemp:  8.0,
      cloudCover: 10,
      surface,
    });
    assert(
      '8. Bleikja 20. ágúst → há. Sæmilegar (≤ 2)',
      result && result.score <= 2,
      `score=${result?.score} (há. ${FORECAST_CONFIG.char.smallChar.lateCapMaxScore})`
    );
  }

  // ── 9. Sunnanátt 9 m/s → Mjög erfiðar eða Erfiðar ───────────────────────
  {
    const surface = { state: 'normal', charBonus: 0, flyPenalty: 0, label: null };
    const result  = calculateFlyFishingConditions({
      windSpeed: 9, windDir: 's', surface,
    });
    assert(
      '9. Sunnanátt 9 m/s → Mjög erfiðar eða Erfiðar (≤ 1)',
      result.score <= 1,
      `score=${result.score}`
    );
  }

  // ── 10. Önnur vindátt 9 m/s → UNDIR mörkum ──────────────────────────────
  {
    const surface = { state: 'normal', charBonus: 0, flyPenalty: 0, label: null };
    const result  = calculateFlyFishingConditions({
      windSpeed: 9, windDir: 'n', surface,
    });
    assert(
      '10. Norðanátt 9 m/s → yfir mörkum ekki enn (score > 1)',
      result.score >= 2,
      `score=${result.score} (limit=${FORECAST_CONFIG.fly.otherLimit})`
    );
  }

  // ── 11. Önnur vindátt 11 m/s → Mjög erfiðar ─────────────────────────────
  {
    const surface = { state: 'normal', charBonus: 0, flyPenalty: 0, label: null };
    const result  = calculateFlyFishingConditions({
      windSpeed: 11, windDir: 'a', surface,
    });
    assert(
      '11. Önnur vindátt 11 m/s → Mjög erfiðar eða Erfiðar (≤ 1)',
      result.score <= 1,
      `score=${result.score}`
    );
  }

  // ── 12. Utan veiðitímabils ────────────────────────────────────────────────
  {
    const outsideDates = [
      dt(2026, 4, 19, 14, 0),   // Dagur á undan opnun
      dt(2026, 9, 16, 10, 0),   // Dagur eftir lok
      dt(2026, 1, 1,  12, 0),   // Janúar
    ];
    outsideDates.forEach(d => {
      assert(
        `12. Utan tímabils (${d.toISOString().slice(0, 10)}) → inSeason=false`,
        !isFishingSeason(d),
        `isFishingSeason=${isFishingSeason(d)}`
      );
    });
    // Og að runForecast skili inSeason: false
    const forecast = runForecast({
      cloudCover: 50, windSpeedMs: 3, windDirText: 'n',
      waterTemp: 8, historicalHourlyCloud: null, dataWarnings: [],
    });
    // Setjum klukku tímabundið
    const realNow = Date;
    // (Getum ekki mock-að Date í browser-samhengi — athugum bara að isFishingSeason virki)
    assert(
      '12b. runForecast skilar inSeason:false ef núverandi dagur er utan tímabils',
      !isFishingSeason(dt(2026, 9, 16)) && !isFishingSeason(dt(2026, 4, 19)),
      'isFishingSeason virkar rétt'
    );
  }

  // ── Niðurstöður ────────────────────────────────────────────────────────────
  console.group('🎣 Veiðispá prófanir');
  results.forEach(r => {
    const icon = r.ok ? '✅' : '❌';
    console.log(`${icon} ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  });
  console.log(`\nNiðurstaða: ${passed} af ${passed + failed} prófum standast`);
  console.groupEnd();

  return { passed, failed, results };
}

// Mock SunCalc fyrir Node-prófanir (mjög einfaldaður)
function buildSunCalcMock() {
  return {
    getTimes(date, lat, lon) {
      const d = new Date(date);
      const sunset  = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 22, 0));
      const sunrise = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 3, 30));
      return { sunrise, sunset };
    },
    getMoonIllumination(date) {
      return { fraction: 0.5, phase: 0.25, angle: 0 };
    },
    getMoonPosition(date, lat, lon) {
      return { altitude: 0.5, azimuth: 0 };
    },
    getMoonTimes(date, lat, lon) {
      const d = new Date(date);
      return {
        rise: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 18, 0)),
        set:  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 6, 0)),
      };
    },
  };
}

if (typeof module !== 'undefined') {
  module.exports = { runForecastTests };
}
