# Ákvarðanir — Þingvallavatn heimildarmynd

## 2026-06-11

- **Static website fyrst** — vefsíðan er byggð sem static HTML/CSS/JS síða, ekkert
  bakendaforrit í fyrstu útgáfu.
- **Engin framework í fyrstu útgáfu** — ekki notað React, Vue eða annað. Hreint HTML,
  CSS og JavaScript.
- **Cinematic, náttúrulegur og einfaldur stíll** — sjónræn hönnun á að endurspegla
  yfirbragð heimildarmyndarinnar: dökkir tónar, vatnsblár bakgrunnur og rólegt yfirbragð.
- **Obsidian vaultið er verkefnamiðstöð** — allar nótur, ákvarðanir, efnisplan og
  framleiðslunótur eru geymdar í þessu vaulti undir `projects/thingvallavatn-documentary/`.

## 2026-06-11 — Public kynningar- og stuðningssíða

- **Síðan verður public-facing kynningar- og stuðningssíða** — ekki innri
  vinnuvefsíða, heldur opin síða fyrir almenning, veiðimenn, vísindafólk, fjölmiðla
  og mögulega styrktaraðila.
- **Vinnuheitið „Veiði í þjóðgarðinum á Þingvöllum“ er notað sem context**, en public
  titill síðunnar er „Þingvallavatn“.
- **Veiðin er sett fram sem leið inn í stærri sögu** um vatnið, lífríkið, vísindin og
  náttúruna — ekki sem aðalefni síðunnar.
- **Greiðslukerfi verður ekki samþætt í fyrstu útgáfu.** Fyrst verða placeholder
  hnappar fyrir hópfjármögnun, beinan stuðning og samstarf.
- **Sneak peek efni (myndbönd, stillur) verður sett inn sem local assets síðar**,
  undir `site/assets/images/` og `site/assets/video/`.

## 2026-06-13 — Hosting og deployment

- **Verkefnið er hýst í public GitHub repo**:
  `https://github.com/jakobsindri-lang/thingvallavatn-documentary`. Public repo
  var valið m.a. til að nýta frítt GitHub Pages hosting og því innihaldið
  (efnisplan, ákvarðanir, todo) er ekki viðkvæmt fyrir þetta public
  kynningarverkefni.
- **Vefsíðan er birt með GitHub Pages í gegnum GitHub Actions** —
  `.github/workflows/pages.yml` byggir og birtir `site/` mappuna sjálfkrafa
  við hvert push á `master`.
- **Live URL**: https://jakobsindri-lang.github.io/thingvallavatn-documentary/

## 2026-06-16 — Gagnvirkt kort og vatnshiti

- **Gagnvirkt kort er komið inn sem vinnuútgáfa** — SVG-kortið
  `site/assets/Map/veidisvaedi_thingvallavatni.svg` er hlaðið inn á síðuna og birt
  sem kafli eftir `Stillur` og á undan `Aðstæður til veiða`.
- **Kortið notar punkta frekar en örnefna-texta á kortinu** — textarnir í SVG-inu
  eru faldir í fyrstu útgáfu og JavaScript býr til smellanlega punkta úr
  staðsetningum örnefnanna. Nafn og lýsing birtast í upplýsingaspjaldi.
- **Kortið er merkt sem vinnuútgáfa** — punktastaðsetningar og textar þurfa
  fínstillingu síðar. `Langatangi` er birt sem `Langitangi` í UI.
- **Vatnshiti er sóttur með cache-buster** — síðan biður um ferskt
  `assets/data/vatnshiti.json` með `cache: "no-store"` og workflow fyrir
  vatnshita deploy-ar Pages eftir uppfærslu.
