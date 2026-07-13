// forecast-config.js
// Allar stillanlegar breytur veiðispárinnar.
// Breyttu hér — ekki í engine eða UI-skránum.

const FORECAST_CONFIG = {

  location: {
    lat: 64.2559,
    lon: -21.1179,
    timezone: 'Atlantic/Reykjavik',
  },

  season: {
    // Veiðitímabil: 20. apríl til 15. september
    openMonth:  3,  openDay:  20,   // April  (JS 0-indexed)
    closeMonth: 8,  closeDay: 15,   // September
  },

  scoreLabels: {
    take: ['Mjög litlar', 'Litlar', 'Sæmilegar', 'Góðar', 'Mjög góðar'],
    fly:  ['Mjög erfiðar', 'Erfiðar', 'Sæmilegar', 'Góðar', 'Mjög góðar'],
  },

  // ── URRIÐI ──────────────────────────────────────────────────────────────
  trout: {

    // Vorveiðitímabil: 20. apríl – 20. maí
    springSeason: {
      startMonth: 3, startDay: 20,
      endMonth:   4, endDay:   20,
    },

    // Virkur gluggi (mínútur frá sólseti / sólarupprás)
    window: {
      openBeforeSunset:        30,   // Gluggi opnast 30 mín fyrir sólsetur
      closeAfterSunrise:       30,   // Gluggi lokar 30 mín eftir sólarupprás
      peakEnd:                 60,   // Topptímabil endar 60 mín eftir sólsetur
      declineStartBeforeSunrise: 60, // Mat byrjar að lækka 60 mín fyrir sólarupprás
    },

    // Grunnmat innan gluggans — vorveiðitímabil (Apr 20 – Maí 20)
    springScores: {
      peak:        4,  // Sólsetur-30 mín til sólsetur+60 mín
      midNight:    3,  // Eftir topptímabil þar til 60 mín eru í sólarupprás
      preRise:     2,  // Síðustu 60 mín fyrir sólarupprás
      postRise:    1,  // Sólarupprás til +30 mín
      outOfWindow: 1,  // BRÁÐABIRGÐAMAT — þarfnast staðfestingar sérfræðings
    },

    // Grunnmat eftir 20. maí — BRÁÐABIRGÐAMAT
    // ATHUGASEMD: Þessi gildi eru bráðabirgðaviðmið sem hafa ekki verið staðfest
    // með vettvangsrannsóknum. Uppfærðu þegar nákvæmari gögn liggja fyrir.
    postSpringScores: {
      peak:        3,
      midNight:    3,
      preRise:     1,
      postRise:    1,
      outOfWindow: 0,
      isProvisional: true,
    },

    moon: {
      lowThreshold:   0.70,   // Undir þessu: engin sjálfvirk lækkun
      highThreshold:  0.90,   // Yfir þessu: -2 (ef sýnilegt og heiðskírt)

      midPenalty:   -1,       // 70–89% + sýnilegt + lítil skýjahula
      highPenalty:  -2,       // 90%+ + sýnilegt + heiðskírt

      clearSkyMax:   30,      // Skýjahula ≤ 30% = "lítil skýjahula"
      overcastMin:   80,      // Skýjahula ≥ 80% = alskýjað → engin bein lækkun

      // Kolniðamyrkur (totalDarknessPenalty)
      totalDarknessPenalty: -1,
      darknessMaxMoon:       0.15,   // Tunglfasi < 15%
      darknessMinCloud:      70,     // Skýjahula > 70%

      // Fyrri bjartar nætur (síðustu 72 klst)
      priorOnePenalty:  -1,
      priorTwoPlusPenalty: -2,
      priorLookbackHours:  72,

      // Björt nótt skilgreind sem:
      brightNightMinMoon:   0.70,
      brightNightMaxCloud:  50,
      // Tunglið verður að vera yfir sjóndeildarhringi í fæðuglugga urriðans
      feedingWindowStartH: 20,   // 20:00
      feedingWindowEndH:    5,   // 05:00 (næsta dag)

      // Hámark samanlagðra tungla- og myrkurviðurlaga
      maxCombinedPenalty: -2,
    },
  },

  // ── BLEIKJA ─────────────────────────────────────────────────────────────
  char: {

    largeChar: {
      defaultStartMonth: 4,  defaultStartDay: 1,   // 1. maí
      waterTempTrigger:  4.0,                        // °C — hefst fyrr ef vatn ≥ 4°C

      // [fromH, toH, score]  (toH er ekki innifalinn)
      hourScores: [
        [0,  4,  1],   // 00–04: Litlar (nótt)
        [4,  10, 4],   // 04–10: Mjög góðar (morgunn)
        [10, 18, 2],   // 10–18: Sæmilegar (dagur)
        [18, 23, 3],   // 18–23: Góðar (kvöld)
        [23, 24, 1],   // 23–24: Litlar (nótt)
      ],
    },

    smallChar: {
      peakStartMonth: 5, peakStartDay: 20,   // 20. júní
      peakEndMonth:   7, peakEndDay:   10,   // 10. ágúst

      lateCapStartMonth: 7, lateCapStartDay: 11,   // 11. ágúst
      lateCapMaxScore: 2,                            // Hámark: Sæmilegar

      hourScores: [
        [0,  3,  1],   // 00–03: Litlar (nótt)
        [3,  4,  2],   // 03–04: Sæmilegar (dögun)
        [4,  10, 4],   // 04–10: Mjög góðar (morgunn)
        [10, 18, 2],   // 10–18: Sæmilegar (dagur)
        [18, 23, 3],   // 18–23: Góðar (kvöld)
        [23, 24, 1],   // 23–24: Litlar (nótt)
      ],
    },

    waterTemp: {
      coldPenalty2Below: 3.5,   // < 3,5°C → -2
      coldPenalty1Below: 4.0,   // 3,5–4,0°C → -1
    },

    solar: {
      sunnyBonus:    1,
      sunnyCloudMax: 30,   // Skýjahula ≤ 30% = sólskin
    },

    // BRÁÐABIRGÐAVIÐMIÐ — þarfnast staðfestingar
    surface: {
      mirrorNorthWindMax:  4,    // Norðanátt ≤ 4 m/s → spegilslétt
      mirrorOtherWindMax:  2,    // Aðrar áttir ≤ 2 m/s → spegilslétt
      mirrorPenalty:      -1,

      rippleNorthWindMin:  5,    // Norðanátt 5–10 m/s → gára
      rippleNorthWindMax: 10,
      rippleOtherWindMin:  3,    // Aðrar áttir 3–10 m/s → gára
      rippleOtherWindMax: 10,
      rippleBonus:         1,
    },
  },

  // ── FLUGUVEIÐIAÐSTÆÐUR ──────────────────────────────────────────────────
  fly: {
    southDirs: ['s', 'sa', 'sv'],

    southLimit: 8,    // Sunnanátt > 8 m/s → of mikill
    otherLimit: 10,   // Aðrar áttir > 10 m/s → of mikill

    directDrop: true, // true = fer beint í Mjög erfiðar yfir mörkum

    // Grunnmat eftir vindhraða þegar UNDIR mörkum
    // [maxSpeed (innifalinn), score]
    windScore: [
      [2,  4],
      [5,  3],
      [8,  2],
      [10, 1],
    ],

    // Spegilslétt vatn: -1 á fluguveiðiaðstæður
    mirrorPenalty: -1,
  },

  api: {
    blikaForecast: 'https://api.blika.is/GetCorrdiffForecast24klst/8553/',
    openMeteoCurrent: 'https://api.open-meteo.com/v1/forecast',
    openMeteoArchive: 'https://archive-api.open-meteo.com/v1/archive',
  },
};
