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

## 2026-07-15 — Myndskreytingar, framsetningarreglur, kort og Tungl

- **Teiknaðar myndir eru alltaf kaflaskil á sléttum dökkum fleti, aldrei
  lagðar ofan á ljósmynd.** Tilraun til að nota `storurridi.png` sem
  hetju-mynd ofan á `hero-sunset.png` var hafnað sem „mjög skrítið" — brýtur
  sjónræna málið sem restin af myndunum fylgir.
- **Engin talnasett flettitól (01/37, 01/08) á síðunni.** Numeric counters
  gefa ranglega til kynna að röð/framvinda skipti máli. Notum í staðinn
  annaðhvort enga vísbendingu, hlutfallslega framvindurák (Stillur), eða
  greinilega merkta hnappa (Þemu nafnalisti). Aðgengi (skjálesarar) er samt
  haldið með `sr-only`/`aria-live` texta.
- **Flipar eru forðaðir þar sem allt efnið er lítið og notandinn á að sjá
  allt í fljótu bragði** (t.d. „Leggðu verkefninu lið"). Notum þess í stað
  alltaf-sýnileg spjöld/kort. Flipar eru enn í lagi þar sem efnið er
  raunverulega stórt og fyrirferðamikið (var ekki notað annars staðar).
- **Örnefnalýsingatextar frá þriðja aðila (t.d. ChatGPT) þarf að
  yfirfara handvirkt fyrir mun á „raunverulegur punktur á korti" og
  „flokkunarhaus/samheiti"** — fyrsta atlagan blandaði þessu saman
  (Lambhagi/Tóftir/Nes/Arnarfell fengu fulla lýsingu þótt þau séu ekki
  eiginlegir kortpunktar). Sá texti var ekki notaður.
- **Myndir sem koma inn með „gagnsæjum" bakgrunni þarf að athuga hvort
  gagnsæið er alvöru alpha-gagnsæi eða bara bakað köflótt mynstur.** Allar
  AI-teiknuðu myndirnar í þessu verkefni reyndust vera það síðarnefnda og
  þurftu sjálfvirka bakgrunnsfjarlægingu (flóðfylling) áður en þær nýttust.
- **Myndir sem eru klipptar í hringlaga tákn þurfa að vera forklipptar að
  myndefninu sjálfu, ekki treysta á að upprunalega myndin fylli rammann.**
  `moon.jpg` hafði svarta spássíu í kringum tunglskífuna sem birtist sem
  auka hringur við smækkun — löguð með því að klippa mynd að mældri
  jaðarlínu myndefnisins (`moon-tight.jpg`).
- **`window.ASSET_BASE` verður að vera notað fyrir allar eigna-slóðir í
  `script.js`** sem keyra bæði á `index.html` og `veidimenn/index.html` —
  a.m.k. eitt tilvik (gamla tunglmyndin) gleymdi þessu og var því líklega
  götótt (404) á undirsíðunni í langan tíma áður en það uppgötvaðist.
- **Kort-hópar með undirliði kalla líka `updateMapInfo()` þegar smellt er á
  þá**, ekki bara víxla `aria-expanded`, svo hópar án eigin kortpunkts eru
  samt aðgengilegir úr hliðarlistanum.

## 2026-07-15 — Íslensk dagsetninga-/tímasnið eru byggð handvirkt, ekki með `is-IS` locale

- **Aldrei nota `toLocaleDateString`/`toLocaleString("is-IS", ...)` fyrir
  dagur/mánuður-röðun eða 12/24 klst val.** Vatnshita-línuritið, „mælt {tími}"
  merkið, tunglrás-/sest-tímar og veðurspárkortin sýndu öll mánuð á undan degi
  og AM/PM fyrir notandann þrátt fyrir að nota `"is-IS"` — ófullkomin ICU-gögn
  fyrir is-IS í sumum vöfrum/Node-útgáfum falla hljóðlaust til baka í
  sjálfgefið (amerískt) snið, án villu.
- **Lagað með handvirkum föllum** (`formatDayMonthDot`, `formatDayMonthNameLong`,
  `formatWeekdayDayMonth` í `script.js`) sem byggja strenginn úr
  `getUTCDate()`/`getUTCMonth()+1`/`getUTCDay()` milliliðalaust, og
  `hour12: false` explicit alls staðar sem tími er birtur.
- **Almenn regla (á við um öll verkefni, ekki bara þetta), sjá
  `Learnings/islensk-dagsetninga-og-timasnid-i-kodi.md` í vaultinu** fyrir
  fulla útskýringu og kóðadæmi.

## 2026-07-16 — Frammistaða, aðgengi, efnisfrágangur og endurskipulagning

- **Allar stórar myndir (bakgrunnur, borðar, þemu, myndasafn) breyttar í
  WebP með `<picture>`/JPG-PNG fallback.** Minnkaði heildarstærð
  `assets/images/` um u.þ.b. 78%. Notaðar `<source srcset type="image/webp">`
  innan `<picture>`, ekki bara skipt út `src`, svo eldri vafrar fái samt mynd.
- **Veðurspá frá `api.blika.is` er ekki lengur sótt beint úr vafra.** Óopinbert
  API sem gæti breyst/horfið hvenær sem er án viðvörunar, svo GitHub Action
  (`vedurspa.yml` + `scripts/fetch_vedurspa.py`) sækir og cachear spána á
  fasta tímafresti í staðinn. Vefsíðan reynir cache-skrána fyrst, svo beina
  API-kallið sem varaleið, svo núverandi villuskilaboð ef hvorugt virkar.
- **CLS-lagfæring (`width`/`height` á `<img>`) var eingöngu bætt við þar sem
  CSS hafði enga fasta `aspect-ratio`.** Almenn breyting á öllum myndum var
  ekki gerð, bara þar sem hún hafði raunveruleg áhrif. Þar sem þetta var gert
  án skýrs `height` í CSS (bara `width`) toguðust myndir úr lagi (sjá
  `.support-card-fill`/`.author-photo` atvikin) — þarf alltaf `height: auto`
  eða `aspect-ratio` samhliða.
- **Bakgrunnsmyndbandið í hero er algjörlega óvirkt fyrir notendur með
  `prefers-reduced-motion: reduce`** — engin `data-src` er sett virk, núll
  bæti eru sótt, ekki bara falið eftir á. Sama hugsun almennt: markmiðið er
  núll-óþarfa-hreyfing, ekki bara falin hreyfing.
- **„Staða verkefnisins" tímalínan notar eina framvindurák og eitt tákn
  (himbrimi) við núverandi skref, ekki punkt við hvert skref.** Táknið er
  `position: absolute` svo nærvera/fjarvera þess haggar ekki röðun textans í
  hinum skrefunum.
- **Undirsíðutenglar milli `index.html` og `veidimenn/index.html` („Fyrir
  veiðimenn" / „← Heimildamyndin") eru afgerandi óáberandi textatenglar, ekki
  hnappar** — þeir eru sigling milli tveggja hluta sömu herferðar, ekki
  aðalaðgerð síðunnar.
- **„Um myndina" og „Af hverju þetta skiptir máli" voru sameinuð í einn kafla**
  (undirfyrirsögn í stað eigin `<section>`) eftir að textinn skaraðist of
  mikið efnislega. Sami háttur ef fleiri kaflar skarast: sameina frekar en
  að reyna endalaust að aðgreina skörun.
- **Skrautfiskarnir (urriði/bleikja) enduðu í footernum, ekki í neinum
  banner.** Fyrsta tilraun setti þá neðst í „Um myndina" bannerinn, en það
  small illa við mynd sem þegar sýndi alvöru fisk í hendi (of mikið sjónrænt
  áreiti á sama fleti). Í staðinn standa þeir nú sitt hvorum megin við
  footer-innihaldið á báðum síðum, bundnir sama `var(--max-width)` ramma og
  restin af meginefninu (`.footer-frame`) svo þeir reki ekki út í horn á
  mjög breiðum skjám.
- **Verkefnistímalínan var leiðrétt til að endurspegla raunverulegt
  tímaferli** — drög að handriti skrifuð 2024, tökur hófust 2025, eftirvinnsla
  (klipping/hljóðvinnsla) áætluð 2027, frumsýning í lok 2027 eða byrjun 2028.
  Upprunalega orðalagið („í tökum frá sumrinu 2024") gaf ranglega til kynna
  að tökur einar hefðu staðið yfir í mörg ár.
- **Höfundarlýsingin notar „kvikmyndaáhugamaður", ekki „kvikmyndagerðarmaður".**
  Notandinn er ekki fagmaður í kvikmyndagerð, heldur veiðimaður og áhugamaður
  sem hefur haft myndavél við höndina frá barnæsku.
- **Sjálfvirkar aðgengisbætur gerðar eftir ábendingalista frá notanda:**
  `loading="lazy"` á YouTube-iframeið, `:focus-visible` stílar á
  `.site-nav a`/`.partner-logo`, og þemu-hringekjan (crossfade) virðir
  `prefers-reduced-motion` bæði í CSS (`transition: none`) og JS
  (tímastilling samstillt við 0ms í stað 280ms).
- **Git-commit skilaboð í þessu (og öllum) verkefnum eiga ekki að innihalda
  „Co-Authored-By: Claude"-línu.** Notandinn lítur á commitin sem sína eigin
  vinnu. Sjá `Learnings/verklagsreglur-fyrir-claude.md` fyrir varanlegu
  regluna, nú framfylgt með `includeCoAuthoredBy: false` í Claude-stillingum.
