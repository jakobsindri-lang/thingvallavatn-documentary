console.log("Þingvallavatn: kynningar- og stuðningssíða er keyrð.");

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
const mapMeta = document.getElementById("map-meta");
const mapPlaceList = document.getElementById("map-place-list");

// Hagnýtar upplýsingar (veiðileyfi, reglur, merktir urriðar) birtast í sama
// upplýsingaspjaldi og staðirnir, valdar með hnöppunum í #map-topics-row.
const mapTopics = {
  "Veiðileyfi": `
    <p>Veiðikortið gildir fyrir landi þjóðgarðsins, frá Langatanga til og með Leirutá (land Kárastaða er undanskilið).</p>
    <p>Dagsleyfi er keypt í <a href="https://vefverslun.veidikortid.is/product/thingvallavatn/" target="_blank" rel="noopener">vefverslun Veiðikortsins ↗</a>. Börn yngri en 14 ára veiða frítt í fylgd með korthafa.</p>
    <p><a href="https://veidikortid.is/veidisvaedi/thingvallavatn/" target="_blank" rel="noopener">Veiðikortið – upplýsingasíða um Þingvallavatn ↗</a></p>
    <p><a href="https://veidikortid.is/wp-content/uploads/2021/11/ThingvellirBaeklingur.pdf" target="_blank" rel="noopener">Bæklingur um veiðar í Þingvallavatni (PDF) ↗</a></p>
  `,
  "Tímabil og reglur": `
    <p>Fluguveiðitímabil er frá 20. apríl til 31. maí. Þá má eingöngu veiða á flugu með flugustöng og öllum urriða skal sleppt. Almenna veiðitímabilið er frá 1. júní til 15. september, og þá er leyfilegt agn fluga, spónn og maðkur.</p>
    <ul>
      <li>Veiðibann er í <button type="button" class="map-inline-link" data-map-jump="Ólafsdráttur">Ólafsdrætti</button> frá 1. júlí til 31. ágúst vegna hrygningar kuðungableikjunnar.</li>
      <li>Öll veiði í Öxarárósi er bönnuð.</li>
      <li>Veiði úr bátum er bönnuð korthöfum Veiðikortsins.</li>
      <li>Heimilt er að veiða allan sólarhringinn.</li>
    </ul>
  `,
  "Merktir urriðar": `
    <p>Vegna rannsókna eru sumir urriðar merktir neðan við bakugga með slöngumerki eða rafeindamerki. Veiðimenn eru beðnir að skrá númer merkis áður en fiski er sleppt og koma upplýsingunum til þjónustumiðstöðvarinnar á Þingvöllum eða <a href="https://laxfiskar.is/index.php?option=com_content&amp;view=article&amp;id=64&amp;Itemid=133&amp;lang=is" target="_blank" rel="noopener">Laxfiska ↗</a>. Þessar upplýsingar nýtast beint í rannsóknum á fiskistofnum vatnsins.</p>
  `,
};

const mapPlaces = {
  Vatnskot: {
    kicker: "Gamalt býli",
    description:
      "Vatnskot er gamalt býli við norðanvert Þingvallavatn og var lengst af hjáleiga frá Þingvöllum. Búið var þar með hléum frá því um 1600 og fram til ársins 1966.",
    role: "Veiðistaður og viðmiðunarstaður",
    theme:
      "Lífsafkoma heimilisfólksins byggðist að verulegu leyti á vatninu og veiðum. Í dag er Vatnskot vinsæll áningarstaður með bryggju og tjaldsvæði á gamla túninu.",
  },
  Garðsendavík: {
    kicker: "Víkur og grunnsævi",
    description:
      "Garðsendavík er vík norðaustan við Lambhaga. Hún dregur nafn sitt af grjótgarðinum sem liggur yfir hagann og endar við víkina.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Sunnan víkurinnar er Garðsendasker. Þar mættust áður veiðimið sem tilheyrðu Þingvöllum og Vatnskoti.",
  },
  Breiðitangi: {
    kicker: "Tangar og vogar",
    description:
      "Breiðitangi er breið og vogskorin landspilda rúmum 400 metrum vestan við Vatnskot. Tanginn er um 175 metra breiður og við hann eru margir smærri vogar og tangar.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Vestan tangans er Breiðavík og lítið ónefnt sker liggur skammt undan suðvesturhluta hans.",
  },
  Vörðuvík: {
    kicker: "Víkur og aðstæður",
    description: "Vörðuvík er vík á strandlengjunni austan Vatnskots og Tófta.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Hægt er að komast niður að víkinni um afleggjara frá Vallavegi. Örnefnasíðan skráir nafnið en birtir takmarkaðar upplýsingar um uppruna þess.",
  },
  Öfugsnáði: {
    kicker: "Örnefni við vatnið",
    description:
      "Öfugsnáði er strand- og veiðisvæði á norðaustanverðu Þingvallavatni, milli Vörðuvíkur og Ness.",
    role: "Kennileiti",
    theme:
      "Afleggjari frá Vallavegi liggur niður að svæðinu. Öfugsnáðavík er skráð sem sérstakt örnefni innan sama strandsvæðis.",
  },
  Nautatangar: {
    kicker: "Tangar við Nes",
    description:
      "Nautatangar, einnig nefndir Nautatangi, eru fremst á Nesi við norðaustanvert Þingvallavatn.",
    role: "Örnefni við veiðisvæði",
    theme: "Austan tanganna opnast Vatnsvik, stór og breið vík sem nær að Gjáarendum.",
  },
  Vatnsvik: {
    kicker: "Vík og uppsprettur",
    description:
      "Vatnsvik er stór og breið vík í norðausturenda Þingvallavatns. Nes afmarkar víkina að vestan og Gjáarendar að austan.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Fjölmargar kaldar uppsprettur og vatnsfylltar gjár eru í víkinni. Vellankatla er þekktust þeirra en Davíðsgjá flytur einnig mikið grunnvatn út í vatnið.",
  },
  Vellankatla: {
    kicker: "Uppsprettulind",
    description:
      "Vellankatla er uppsprettulind og vík innst í Vatnsviki. Nafnið er talið vísa til þess hvernig vatnið vellur upp úr lindinni líkt og úr katli.",
    role: "Kennileiti",
    theme:
      "Vatnið kemur með grunnvatnsstraumum frá Langjökli og er aðeins um 2,8 gráður. Örnefnið er fornt og tengist meðal annars frásögnum af kristnitökunni árið 1000.",
  },
  Davíðsgjá: {
    kicker: "Gjásvæði",
    description:
      "Davíðsgjá er stór vatnsfyllt sprunga sem liggur meðfram austurbakka Vatnsviks og nær að Gjáarendum.",
    role: "Gjásvæði og kennileiti",
    theme:
      "Stærsti samfelldi hluti gjárinnar er um 200 metra langur og allt að 15 metra breiður. Ekki er vitað með vissu við hvaða Davíð gjáin er kennd.",
  },
  Hallvik: {
    kicker: "Víkur og veiði",
    description:
      "Hallvik er vík sunnan Gjáarenda í norðausturhorni Þingvallavatns. Nafnið er dregið af Halli, lægri barmi Hrafnagjár sem gengur þar niður að vatninu.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Örnefnið er skráð Hallvik, án broddstafs, til aðgreiningar frá Hallvík við Almannagjá. Tveir litlir hólmar, Gjáarendahólmar, eru rétt norðan við víkina.",
  },
  Gjáarendar: {
    kicker: "Gjásvæði",
    description:
      "Gjáarendar eru hraunflatir við vatnsbakkann þar sem Hrafnagjá og tengdar sprungur ganga niður að Þingvallavatni.",
    role: "Kennileiti við gjár",
    theme:
      "Davíðsgjá er stærsta sprungan á svæðinu. Gamlar leiðir milli Þingvalla og byggðanna austan vatns lágu um Gjáarenda og enn má sjá ummerki þeirra.",
  },
  Ólafsdráttur: {
    kicker: "Veiðistaður",
    description:
      "Ólafsdráttur er vatnasvæðið undir Halli á Hrafnagjá, milli Hallviks og Arnarfellsenda. Nafnið er talið tengjast Ólafi helga Noregskonungi.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Þar eru mikilvægustu hrygningarsvæði kuðungableikjunnar í Þingvallavatni. Veiðibann er samkvæmt upplýsingum þjóðgarðsins frá 1. júlí til og með 31. ágúst, frá Gjáarendahólmum að Einbúa.",
  },
  Búr: {
    kicker: "Vík við Arnarfell",
    description:
      "Búr er um 100 metra breið vík við norðurenda Arnarfells. Brattir tangar afmarka víkina og Einbúi stendur á vestari tanganum.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Búr var áður þekktur veiðistaður en liggur innan hins viðkvæma hrygningarsvæðis kuðungableikjunnar í Ólafsdrætti.",
  },
  Einbúi: {
    kicker: "Móbergsklettur",
    description:
      "Einbúi er um 22 metra hár móbergsklettur sem stendur á litlum tanga við norðurenda Arnarfells. Kletturinn er brattur á alla vegu en gróinn að ofan.",
    role: "Kennileiti",
    theme:
      "Einbúi afmarkar suðurenda tímabundna veiðibannsvæðisins í Ólafsdrætti. Búr er austan við klettinn og Arnarsetur ofar í fjallinu.",
  },
  Fornasel: {
    kicker: "Fornar tóftir",
    description:
      "Fornasel eru tóftir í lítilli gróinni laut við norðurenda Arnarfells, skammt frá vatnsbakkanum. Tóftirnar eru taldar vera af gömlu seli, líklega frá Þingvallabæ.",
    role: "Kennileiti",
    theme:
      "Tóftirnar eru grónar og erfitt getur verið að greina þær. Djúpar gjár eru beggja vegna svæðisins og því þarf að fara varlega.",
  },
  Þvotta: {
    kicker: "Vík undir Hrafnagjá",
    description:
      "Þvotta, einnig nefnd Þvottuvík eða Þvottá, er lítil og grunn vík undir Hallstíg á Hrafnagjá.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Nafnið tengist því að bændur frá Gjábakka þvoðu þar ull. Köld uppspretta rennur í víkina og mikill kjarrgróður er við bakkann.",
  },
  Arnarnes: {
    kicker: "Gamalt sumarhús",
    description:
      "Arnarnes var sumarbústaður undir Arnarfelli. Læknirinn Matthías Einarsson og fjölskylda hans reistu húsið árið 1941 og dvöldu þar á sumrin.",
    role: "Kennileiti",
    theme:
      "Húsið var fjarlægt fyrir aldamótin 2000. Trjálundur og leifar matjurtagarðs minna enn á dvöl fjölskyldunnar.",
  },
  Arnarsetur: {
    kicker: "Klettabelti á Arnarfelli",
    description:
      "Arnarsetur er klettur eða klettabelti norðan í Arnarfelli, ofan við Einbúa. Nafnið tengist haförnum sem sagðir eru hafa orpið þar fram yfir aldamótin 1900.",
    role: "Kennileiti",
    theme:
      "Nákvæm staðsetning örnefnisins er ekki fyllilega ljós. Á bandarísku herkorti frá 1949 kemur svipað örnefni fyrir sem Arnarþúfa.",
  },
  Klofhóll: {
    kicker: "Hóll við Arnarfell",
    description:
      "Klofhóll er um 300 metrum suðvestan við Arnarfell. Sprungur Langatangagjáa kljúfa hólinn og þaðan er nafnið líklega dregið.",
    role: "Kennileiti",
    theme:
      "Gamla reiðleiðin milli Arnarfellsbæjar og Mjóaness liggur austan við hólinn. Sauðasteinar og Sauðasteinavíkur eru skammt undan og voru þekktir veiðistaðir.",
  },
  Langatangagjár: {
    kicker: "Sprungusveimur",
    description:
      "Langatangagjár eru um 1,5 kílómetra langur sprungusveimur sunnan Arnarfells. Gjárnar draga nafn sitt af Langatanga þar sem þær ganga niður að vatninu.",
    role: "Gjásvæði og kennileiti",
    theme:
      "Sumar gjárnar eru vatnsfylltar og víða hefur land sigið milli sprungna. Svæðið getur verið varasamt yfirferðar, sérstaklega þar sem gróður hylur gjárnar.",
  },
  Langitangi: {
    kicker: "Tangi við vatnið",
    description:
      "Langitangi gengur út í Þingvallavatn um 1,5 kílómetra suðvestan við Arnarfell. Sauðanes kann að vera eldra heiti á sama svæði.",
    role: "Kennileiti og veiðisamhengi",
    theme:
      "Tanginn markar gömul landamerki Arnarfells og Þingvalla gagnvart Mjóanesi. Langatangagjár liggja frá tanganum í átt að Arnarfelli.",
  },
  Sandskörð: {
    kicker: "Sandvíkur",
    description:
      "Sandskörð eru tvær sandvíkur vestan Arnarfells, Innri-Sandskörð og Syðri-Sandskörð. Lítill klettatangi með helli skilur víkurnar að.",
    role: "Örnefni við veiðisvæði",
    theme:
      "Áður fyrr myndaðist oft stór sprunga í ísinn frá Sandskörðum og þvert yfir vatnið að Rauðukusunesi. Hún var kölluð Sandskarðsbrestur.",
  },
  Sláttulág: {
    kicker: "Brekka við Arnarfell",
    description:
      "Sláttulág er gróin brekka sunnan í Arnarfelli, vestan við Fjallshorn. Nafnið er dregið af því að bændur á Arnarfelli nýttu lágina til heyskapar.",
    role: "Kennileiti",
    theme:
      "Nafnið hefur einnig verið notað um grunna vík neðan við brekkuna. Þar er lítil malarfjara við vatnsbakkann.",
  },
};

const MAP_GROUPS = [
  { label: "Lambhagi",     children: ["Garðsendavík", "Lambhagatá", "Leirutá", "Presthólmi"] },
  { label: "Vatnskot",     children: ["Breiðitangi", "Murtusker", "Veiðitangi"] },
  { label: "Tóftir",      children: ["Murtutangi", "Vörðuvík"] },
  { label: "Öfugsnáði" },
  { label: "Vatnsvik",    children: ["Davíðsgjá", "Nautatangar", "Vellankatla"] },
  { label: "Hallvik",     children: ["Gjáarendar", "Hallvik"] },
  { label: "Ólafsdráttur", children: ["Búr", "Einbúi", "Fornasel", "Þvotta"] },
  { label: "Arnarfell",   children: ["Arnarnes", "Arnarsetur", "Sandskörð", "Sláttulág"] },
  { label: "Langitangi",  children: ["Klofhóll", "Langatangagjár", "Langitangi"] },
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
    const topic = mapTopics[name];

    if (topic) {
      mapKicker.textContent = "Hagnýtt";
      mapTitle.textContent = name;
      mapDescription.innerHTML = topic;
      if (mapMeta) mapMeta.hidden = true;
    } else {
      const place = mapPlaces[name] || {
        description:
          "Þessi staður er hluti af veiðisvæðinu og verður hægt að tengja við nánari upplýsingar síðar.",
        role: "Örnefni",
        theme: "Veiði, landslag",
      };

      mapKicker.textContent = place.kicker || "Veiðisvæði";
      mapTitle.textContent = name;
      mapDescription.innerHTML = place.description;
      mapRole.textContent = place.role;
      mapTheme.textContent = place.theme;
      if (mapMeta) mapMeta.hidden = false;
    }

    if (activeMapElement) activeMapElement.classList.remove("is-active");
    activeMapElement = mapSvgMount.querySelector(
      `.map-point[data-nafn="${escapeSelectorValue(name)}"]`
    );
    if (activeMapElement) {
      activeMapElement.classList.add("is-active");
      // Valinn staður verður tab-stopp kortsins, svo lyklaborðsfókus lendir þar næst
      mapSvgMount.querySelectorAll('.map-point[tabindex="0"]').forEach((p) => p.setAttribute("tabindex", "-1"));
      activeMapElement.setAttribute("tabindex", "0");
    }

    if (activeMapButton) activeMapButton.classList.remove("is-active");
    activeMapButton = mapInfo.querySelector(
      `[data-map-place="${escapeSelectorValue(name)}"]`
    );
    if (activeMapButton) activeMapButton.classList.add("is-active");
  };

  document.querySelectorAll("#map-topics-row .map-place-button").forEach((btn) => {
    btn.addEventListener("click", () => updateMapInfo(btn.dataset.mapPlace));
  });

  mapDescription.addEventListener("click", (event) => {
    const jumpBtn = event.target.closest("[data-map-jump]");
    if (jumpBtn) updateMapInfo(jumpBtn.dataset.mapJump);
  });

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
      // role="group" (ekki "img"): img gerir punktana innan í kortinu ósýnilega skjálesurum
      svg.setAttribute("role", "group");
      svg.setAttribute("aria-label", "Kort af veiðisvæðinu. Örvatakkar færa á milli staða, Enter velur.");
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

        // Ósýnilegur, stærri hringur undir punktinum svo auðveldara sé að hitta hann með fingri
        const hit = document.createElementNS(svgNamespace, "circle");
        hit.classList.add("map-hit");
        hit.setAttribute("cx", cx);
        hit.setAttribute("cy", cy);
        hit.setAttribute("r", "11");
        hit.setAttribute("aria-hidden", "true");
        hit.addEventListener("click", () => updateMapInfo(name));
        pointLayer.appendChild(hit);

        const point = document.createElementNS(svgNamespace, "circle");
        point.classList.add("map-point");
        if (mapPlaces[name]) point.classList.add("map-point-featured");
        point.dataset.nafn = name;
        point.setAttribute("cx", cx);
        point.setAttribute("cy", cy);
        point.setAttribute("r", "3.5");
        point.setAttribute("tabindex", "-1");
        point.setAttribute("role", "button");
        point.setAttribute("aria-label", name);
        point.addEventListener("click", () => updateMapInfo(name));
        pointLayer.appendChild(point);
      });

      // Eitt tab-stopp fyrir allt kortið: örvatakkar færa á milli punkta, Enter/bil velur.
      // Annars þyrfti að tabba í gegnum alla punktana til að komast framhjá kortinu.
      const points = Array.from(pointLayer.querySelectorAll(".map-point"));
      if (points.length) points[0].setAttribute("tabindex", "0");
      points.forEach((point, i) => {
        point.addEventListener("keydown", (event) => {
          let next = null;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") next = points[(i + 1) % points.length];
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = points[(i - 1 + points.length) % points.length];
          if (event.key === "Home") next = points[0];
          if (event.key === "End") next = points[points.length - 1];
          if (next) {
            event.preventDefault();
            point.setAttribute("tabindex", "-1");
            next.setAttribute("tabindex", "0");
            next.focus();
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            updateMapInfo(point.dataset.nafn);
          }
        });
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
            btn.dataset.mapPlace = normalizeMapName(group.label);
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
                const label = document.createElement("span");
                label.className = "map-children-label";
                label.textContent = `Undir ${group.label}:`;
                childrenRow.appendChild(label);
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
              updateMapInfo(group.label);
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

const galleryScroll   = document.querySelector(".gallery-scroll");
const galleryWrap     = document.getElementById("gallery-wrap");
const galleryCounter  = document.getElementById("gallery-counter");
const galleryProgressThumb = document.getElementById("gallery-progress-thumb");

if (galleryScroll) {
  const items     = Array.from(galleryScroll.children);
  const totalReal = items.length;
  const cloneCount = 3;

  // Record image data for lightbox before cloning
  const imageData = items.map((item, i) => {
    const img = item.querySelector("img");
    item.dataset.realIndex = i;
    return { src: img.getAttribute("src"), alt: img.alt };
  });

  const makePrepend = items.slice(-cloneCount).map((el, i) => {
    const c = el.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    c.dataset.realIndex = totalReal - cloneCount + i;
    return c;
  });
  const makeAppend = items.slice(0, cloneCount).map((el, i) => {
    const c = el.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    c.dataset.realIndex = i;
    return c;
  });

  galleryScroll.innerHTML = "";
  [...makePrepend, ...items, ...makeAppend].forEach((el) => galleryScroll.appendChild(el));

  let currentIndex   = cloneCount;
  let transitioning  = false;
  let transitionFallback;
  let resizeTimer;

  const getItemsPerView = () => {
    if (window.innerWidth >= 1800) return 3;
    if (window.innerWidth >= 1000) return 2;
    return 1;
  };

  const updateCounter = () => {
    const real = ((currentIndex - cloneCount) % totalReal + totalReal) % totalReal;
    if (galleryCounter) {
      galleryCounter.textContent = `Mynd ${real + 1} af ${totalReal}`;
    }
    if (galleryProgressThumb) {
      galleryProgressThumb.style.width = `${100 / totalReal}%`;
      galleryProgressThumb.style.left  = `${(real / totalReal) * 100}%`;
    }
  };

  const updatePosition = (animate) => {
    const wrapWidth = galleryScroll.parentElement.offsetWidth;
    const itemWidth = wrapWidth / getItemsPerView();
    galleryScroll.style.transition = animate ? "transform 0.4s ease" : "none";
    galleryScroll.style.transform  = `translateX(${-currentIndex * itemWidth}px)`;
  };

  galleryScroll.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;
    clearTimeout(transitionFallback);
    let wrapped = false;
    if (currentIndex < cloneCount) {
      currentIndex += totalReal; wrapped = true;
    } else if (currentIndex >= cloneCount + totalReal) {
      currentIndex -= totalReal; wrapped = true;
    }
    if (wrapped) { updatePosition(false); void galleryScroll.offsetHeight; }
    transitioning = false;
  });

  const goTo = (newIndex) => {
    if (transitioning) return;
    transitioning = true;
    clearTimeout(transitionFallback);
    currentIndex = newIndex;
    updatePosition(true);
    updateCounter();
    transitionFallback = setTimeout(() => { transitioning = false; }, 600);
  };

  // Raunverulegt númer myndarinnar sem er fremst (afrit í byrjun/enda eru ekki talin)
  const currentRealIndex = () => (((currentIndex - cloneCount) % totalReal) + totalReal) % totalReal;

  if (galleryWrap) {
    galleryWrap.setAttribute("role", "region");
    galleryWrap.setAttribute("aria-label", "Stillur. Örvatakkar fletta, Enter opnar mynd.");
    galleryWrap.addEventListener("keydown", (e) => {
      if (e.target !== galleryWrap) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(currentIndex - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(currentIndex + 1); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lbOpen(currentRealIndex()); }
    });

    // Sýnilegir fletti-hnappar: án þeirra vissu notendur ekki að myndaröðin hreyfist
    const navBtn = (cls, label, glyphPath, step) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `gallery-nav ${cls}`;
      b.setAttribute("aria-label", label);
      b.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${glyphPath}"/></svg>`;
      b.addEventListener("click", (e) => { e.stopPropagation(); goTo(currentIndex + step); });
      b.addEventListener("mousedown", (e) => e.stopPropagation());
      galleryWrap.appendChild(b);
    };
    navBtn("gallery-prev", "Fyrri myndir", "M15 5l-7 7 7 7", -1);
    navBtn("gallery-next", "Næstu myndir", "M9 5l7 7-7 7", 1);
  }

  const galleryProgress      = document.querySelector(".gallery-progress");
  const galleryProgressTrack = document.querySelector(".gallery-progress-track");
  if (galleryProgress && galleryProgressTrack) {
    galleryProgress.addEventListener("click", (e) => {
      const rect = galleryProgressTrack.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const targetReal = Math.min(totalReal - 1, Math.floor(frac * totalReal));
      goTo(cloneCount + targetReal);
    });
  }

  updatePosition(false);
  updateCounter();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updatePosition(false), 100);
  });

  // Touch swipe
  let gTouchX = 0;
  galleryScroll.addEventListener("touchstart", (e) => { gTouchX = e.touches[0].clientX; }, { passive: true });
  galleryScroll.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - gTouchX;
    if (Math.abs(delta) > 48) goTo(currentIndex + (delta < 0 ? 1 : -1));
  });

  // Mouse drag
  let gDragX = 0, gDragging = false, gWasDrag = false;
  galleryScroll.addEventListener("mousedown", (e) => {
    gDragX = e.clientX; gDragging = true; gWasDrag = false;
    galleryScroll.style.cursor = "grabbing";
  });
  document.addEventListener("mouseup", (e) => {
    if (!gDragging) return;
    gDragging = false;
    galleryScroll.style.cursor = "";
    const delta = e.clientX - gDragX;
    if (Math.abs(delta) > 8) gWasDrag = true;
    if (Math.abs(delta) > 48) goTo(currentIndex + (delta < 0 ? 1 : -1));
  });
  galleryScroll.addEventListener("dragstart", (e) => e.preventDefault());

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Stækkuð mynd");
  lb.hidden = true;
  lb.innerHTML = `
    <button class="lb-close" id="lb-close" aria-label="Loka">&#10005;</button>
    <button class="lb-prev"  id="lb-prev"  aria-label="Fyrri mynd">&#8249;</button>
    <figure class="lb-inner">
      <img class="lb-img" id="lb-img" src="" alt="">
      <figcaption class="lb-caption" id="lb-caption"></figcaption>
      <div class="lb-progress" aria-hidden="true">
        <div class="lb-progress-track">
          <div class="lb-progress-thumb" id="lb-progress-thumb"></div>
        </div>
      </div>
      <p class="sr-only" id="lb-counter" aria-live="polite"></p>
    </figure>
    <button class="lb-next" id="lb-next" aria-label="Næsta mynd">&#8250;</button>`;
  document.body.appendChild(lb);

  const lbImg     = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbCounter = document.getElementById("lb-counter");
  const lbProgressThumb = document.getElementById("lb-progress-thumb");
  const lbClose   = document.getElementById("lb-close");
  const lbPrevBtn = document.getElementById("lb-prev");
  const lbNextBtn = document.getElementById("lb-next");
  const lbFocusEls = [lbClose, lbPrevBtn, lbNextBtn];

  let lbIdx = 0, lbLastFocused = null;

  const lbSet = (idx) => {
    lbIdx = ((idx % totalReal) + totalReal) % totalReal;
    lbImg.src = imageData[lbIdx].src;
    lbImg.alt = imageData[lbIdx].alt;
    lbCaption.textContent = imageData[lbIdx].alt;
    lbCounter.textContent = `Mynd ${lbIdx + 1} af ${totalReal}`;
    if (lbProgressThumb) {
      lbProgressThumb.style.width = `${100 / totalReal}%`;
      lbProgressThumb.style.left  = `${(lbIdx / totalReal) * 100}%`;
    }
  };

  const lbOpen = (idx) => {
    lbLastFocused = document.activeElement;
    lbSet(idx);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };

  const closeLb = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lbLastFocused) lbLastFocused.focus();
  };

  lbClose.addEventListener("click", closeLb);
  lbPrevBtn.addEventListener("click", () => lbSet(lbIdx - 1));
  lbNextBtn.addEventListener("click", () => lbSet(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  const lbProgress      = lb.querySelector(".lb-progress");
  const lbProgressTrack = lb.querySelector(".lb-progress-track");
  if (lbProgress && lbProgressTrack) {
    lbProgress.addEventListener("click", (e) => {
      const rect = lbProgressTrack.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      lbSet(Math.min(totalReal - 1, Math.floor(frac * totalReal)));
    });
  }

  lb.addEventListener("keydown", (e) => {
    if (e.key === "Escape")     { closeLb(); return; }
    if (e.key === "ArrowLeft")  { lbSet(lbIdx - 1); return; }
    if (e.key === "ArrowRight") { lbSet(lbIdx + 1); return; }
    if (e.key === "Tab") {
      const first = lbFocusEls[0], last = lbFocusEls[lbFocusEls.length - 1];
      if (e.shiftKey && document.activeElement === first)  { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  let lbTouchX = 0;
  lb.addEventListener("touchstart", (e) => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(delta) > 48) lbSet(lbIdx + (delta < 0 ? 1 : -1));
  });

  // Click on gallery item → open lightbox (blocked if was a drag)
  galleryScroll.addEventListener("click", (e) => {
    if (gWasDrag) { gWasDrag = false; return; }
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    const idx = parseInt(item.dataset.realIndex, 10);
    if (!isNaN(idx)) lbOpen(idx);
  });
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

// „Núna við vatnið“ á veiðisíðunni: hver gagnaveita fyllir sinn reit þegar gögnin berast.
// Ef reitirnir eru ekki á síðunni (t.d. forsíðan) gerir þetta ekkert.
function setNow(key, value, sub) {
  const valueEl = document.getElementById(`now-${key}`);
  const subEl = document.getElementById(`now-${key}-sub`);
  if (valueEl) valueEl.innerHTML = value;
  if (subEl) subEl.textContent = sub ?? "";
}

// „Aðstæður núna“: hver reitur opnar sitt ítarefni (veður, vatnshiti, tungl) beint fyrir neðan.
// Eitt opið í einu; smellt aftur á opinn reit lokar honum. Tenglar á #spa, #vatnshiti og #tungl
// (t.d. gamlir bókamerki eða tenglarnir í lokunarskilaboðunum) opna réttan reit.
(function () {
  const tiles = Array.from(document.querySelectorAll(".now-item[aria-controls]"));
  if (!tiles.length) return;
  const panelFor = (tile) => document.getElementById(tile.getAttribute("aria-controls"));

  const open = (tile) => {
    tiles.forEach((t) => {
      const isThis = t === tile;
      t.setAttribute("aria-expanded", isThis ? "true" : "false");
      const panel = panelFor(t);
      if (panel) panel.hidden = !isThis;
    });
  };
  const closeAll = () => open(null);

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      if (tile.getAttribute("aria-expanded") === "true") closeAll();
      else open(tile);
    });
  });

  const openFromHash = () => {
    const id = location.hash.slice(1);
    const tile = tiles.find((t) => t.getAttribute("aria-controls") === id);
    if (!tile) return;
    open(tile);
    // Fletta að reitunum sjálfum svo bæði yfirlitið og ítarefnið sjáist
    document.getElementById("nuna").scrollIntoView({ block: "start" });
  };
  window.addEventListener("hashchange", openFromHash);
  openFromHash();
})();

// Á veiðitímabilinu (20. apríl – 15. september) er veiðispáin aðalverkfærið og fer efst.
// Utan þess er hún bara lokunarskilaboð, svo „Aðstæður núna“ kemur fyrst.
(function () {
  const nuna = document.getElementById("nuna");
  const vsp = document.getElementById("veidispa");
  if (!nuna || !vsp) return;
  const now = new Date();
  const md = (now.getUTCMonth() + 1) * 100 + now.getUTCDate(); // t.d. 420 = 20. apríl
  if (md >= 420 && md <= 915) nuna.parentNode.insertBefore(vsp, nuna);
})();

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
    const lbl = formatDayMonthDot(dt);
    return `<text x="${toX(i).toFixed(1)}" y="${H - 5}" text-anchor="middle" font-size="9.5" fill="rgba(200,215,220,0.55)">${lbl}</text>`;
  }).join("");
  // Ásmerkingar sýna raunverulegt hæsta og lægsta gildi og sitja við þá punkta.
  // (minT/maxT eru víkkuð um 0,3° til að gefa línunni rými; þau gildi máttu ekki birtast sem tölur.)
  const realMin = Math.min(...temps);
  const realMax = Math.max(...temps);
  const yMin = `${realMin.toFixed(1).replace(".", ",")}°`;
  const yMax = `${realMax.toFixed(1).replace(".", ",")}°`;

  const lastIdx = n - 1;
  const lastX = toX(lastIdx);
  const lastY = toY(history[lastIdx].temp);
  const lastDt = new Date(history[lastIdx].date + "T12:00:00Z");
  const lastDateLabel = formatDayMonthNameLong(lastDt);

  const regularPoints = history.map((d, i) => {
    if (i === lastIdx) return "";
    const dt = new Date(d.date + "T12:00:00Z");
    const dl = formatDayMonthNameLong(dt);
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
    <text x="${padL - 4}" y="${(toY(realMax) + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="rgba(200,215,220,0.75)">${yMax}</text>
    <text x="${padL - 4}" y="${(toY(realMin) + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="rgba(200,215,220,0.75)">${yMin}</text>
  </svg>`;
}

function initWaterTemp() {
  const widget = document.getElementById("water-temp-widget");
  if (!widget) return;
  fetch(`${window.ASSET_BASE ?? ""}assets/data/vatnshiti.json`, { cache: "no-cache" })
    .then((r) => r.json())
    .then((data) => {
      const tempLabel = data.temp.toFixed(1).replace(".", ",");
      const updated = new Date(data.updated);
      // Ísland er alltaf UTC+0 (ekkert sumartími), svo getUTCDate/-Month gefa
      // réttan almanaksdag án tímabeltisumbreytingar.
      const timeLabel = `${formatDayMonthDot(updated)}, ${updated.toLocaleTimeString("is-IS", {
        hour: "2-digit", minute: "2-digit", hour12: false,
        timeZone: "Atlantic/Reykjavik",
      })}`;
      const history = data.history ? [...data.history] : [];
      if (history.length > 0) history[history.length - 1] = { ...history[history.length - 1], temp: data.temp };
      const chart = waterTempChartSVG(history);
      setNow("water", `${tempLabel}°C`, `mælt ${timeLabel}`);
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
      setNow("water", "&ndash;", "Næst ekki í augnablikinu");
      widget.innerHTML = '<p class="weather-status">Ekki tókst að sækja vatnshita núna. <a href="https://www.landsvirkjun.is/rauntimavoktun/vatnshiti-thingvallavatns" target="_blank" rel="noopener">Skoða vatnshita hjá Landsvirkjun</a>.</p>';
    });
}

initWaterTemp();

// Sækir Bliku-veðurspá: staðbundna vedurspa.json (uppfærð reglulega af GitHub
// Action) fyrst ef hún er til og innan við 3 klst gömul, annars beint kall í
// óopinbera api.blika.is sem fallback (CORS/framboð þess API er ótryggt).
const BLIKA_CACHE_MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3 klst

async function fetchBlikaForecast() {
  try {
    const res = await fetch(`${window.ASSET_BASE ?? ""}assets/data/vedurspa.json`, { cache: "no-cache" });
    if (res.ok) {
      const cached = await res.json();
      const age = Date.now() - new Date(cached.fetched).getTime();
      if (Array.isArray(cached.days) && cached.days.length && age <= BLIKA_CACHE_MAX_AGE_MS) {
        return { days: cached.days, fetched: cached.fetched };
      }
    }
  } catch {
    // Staðbundna skráin ekki tiltæk — reynum beina kallið hér að neðan.
  }
  const res = await fetch(FORECAST_CONFIG.api.blikaForecast);
  // Beina API-kallið skilar nýjum gögnum núna, svo „Gögn sótt“ er núverandi tími.
  // (Áður var línunni sleppt, og veðurspáin sýndi þá aldrei hversu nýleg hún var.)
  return { days: await res.json(), fetched: new Date().toISOString() };
}

if (weatherGrid) {
  // Teiknuð línutákn í sama stíl og táknin í valmyndinni (24×24, strik í currentColor).
  // Emoji litu ólíkt út eftir stýrikerfi og stungu í stúf við restina af síðunni.
  const CLOUD = "M7 18a3.5 3.5 0 0 1-.4-6.98A5 5 0 0 1 16.4 9.5a4.25 4.25 0 0 1 .6 8.5z";
  // Skýið er fyllt með lit spjaldsins svo það skyggi á sólina fyrir aftan
  const cloud = (dx = 0, dy = 0) =>
    `<path d="${CLOUD}" transform="translate(${dx} ${dy})" fill="var(--color-bg-card)"/>`;
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>';
  const smallSun = '<circle cx="8" cy="8" r="3"/><path d="M8 2.5v1M2.5 8h1M4.1 4.1l.7.7M11.9 4.1l-.7.7M4.1 11.9l.7-.7"/>';
  const drops = (n) => ["M8.5 16.5 7.5 19.5", "M12.5 16.5l-1 3", "M16.5 16.5l-1 3"].slice(0, n).map((d) => `<path d="${d}"/>`).join("");
  const flakes = (n) => [[8, 18], [16, 18], [12, 20.5]].slice(0, n)
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="currentColor" stroke="none"/>`).join("");
  const svgIcon = (body, label) =>
    `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}" focusable="false"><title>${label}</title>${body}</svg>`;

  const iconKinds = {
    clear:        svgIcon(sun, "Heiðskírt"),
    partlycloudy: svgIcon(smallSun + cloud(2, 2), "Léttskýjað"),
    mostlycloudy: svgIcon('<circle cx="9" cy="8" r="3"/>' + cloud(1, 1.5), "Skýjað að mestu"),
    cloudy:       svgIcon(cloud(0, 1), "Skýjað"),
    fog:          svgIcon('<path d="M4 8h16M6 12h14M4 16h12M9 20h9"/>', "Þoka"),
    showers:      svgIcon(cloud(0, -3) + drops(2), "Skúrir"),
    rain:         svgIcon(cloud(0, -3) + drops(3), "Rigning"),
    sleet:        svgIcon(cloud(0, -3) + '<path d="M8.5 16.5l-1 3"/>' + '<circle cx="15" cy="18.5" r="1.1" fill="currentColor" stroke="none"/>', "Slydda"),
    flurries:     svgIcon(cloud(0, -3) + flakes(2), "Él"),
    snow:         svgIcon(cloud(0, -3) + flakes(3), "Snjókoma"),
    thunder:      svgIcon(cloud(0, -3) + '<path d="M12.5 15.5 10 19.5h3.5L11 23"/>', "Þrumuveður"),
  };
  // Veðurkóðar Bliku (`merki`) → tákn. Óþekktur kóði fær hlutlaust ský.
  const weatherIcons = {
    clear: iconKinds.clear, sunny: iconKinds.clear,
    partlycloudy: iconKinds.partlycloudy, mostlysunny: iconKinds.partlycloudy,
    mostlycloudy: iconKinds.mostlycloudy, partlysunny: iconKinds.mostlycloudy,
    cloudy: iconKinds.cloudy,
    fog: iconKinds.fog, hazy: iconKinds.fog,
    drizzle: iconKinds.showers, showers: iconKinds.showers, chancerain: iconKinds.showers,
    rain: iconKinds.rain,
    sleet: iconKinds.sleet, chancesleet: iconKinds.sleet, hail: iconKinds.sleet,
    chanceflurries: iconKinds.flurries, flurries: iconKinds.flurries, chancesnow: iconKinds.flurries,
    snow: iconKinds.snow,
    thunder: iconKinds.thunder, tstorms: iconKinds.thunder, chancetstorms: iconKinds.thunder,
  };
  const blikaError = '<p class="weather-status">Ekki tókst að sækja veðurspá núna. <a href="https://www.blika.is/spa/8553" target="_blank" rel="noopener">Skoða spá á Bliku</a>.</p>';
  const spaFetchedNote = document.getElementById("spa-fetched-note");

  fetchBlikaForecast()
    .then(({ days, fetched }) => {
      const first7 = days.slice(0, 7);
      if (!first7.length) {
        weatherGrid.innerHTML = blikaError;
        setNow("weather", "&ndash;", "Næst ekki í augnablikinu");
        return;
      }

      // Spá dagsins í yfirlitið efst (fyrsti dagur sem er í dag eða seinna)
      const todayIso = new Date().toISOString().slice(0, 10);
      const today = first7.find((d) => d.dags_spar.slice(0, 10) >= todayIso) || first7[0];
      setNow(
        "weather",
        `<span class="now-icon">${weatherIcons[today.merki] || iconKinds.cloudy}</span>${Math.round(today.t2)}°`,
        `${Math.round(today.f10)} m/s ${(today.dtexti || "").toUpperCase()}`
      );
      weatherGrid.innerHTML = "";
      first7.forEach((day) => {
        const date      = new Date(day.dags_spar.slice(0, 10) + "T12:00:00Z");
        const dateLabel = formatWeekdayDayMonth(date);
        const item = document.createElement("div");
        item.className = "weather-day";
        item.innerHTML = `
          <div class="weather-date">${dateLabel}</div>
          <div class="weather-icon">${weatherIcons[day.merki] || iconKinds.cloudy}</div>
          <div class="weather-temp">${Math.round(day.t2)}°</div>
          <div class="weather-wind">${Math.round(day.f10)} m/s ${(day.dtexti || "").toUpperCase()}</div>
        `;
        weatherGrid.appendChild(item);
      });

      if (spaFetchedNote) {
        const note = formatFetchedNote(fetched);
        spaFetchedNote.textContent = note ?? "";
        spaFetchedNote.hidden = !note;
      }
    })
    .catch(() => {
      weatherGrid.innerHTML = blikaError;
      setNow("weather", "&ndash;", "Næst ekki í augnablikinu");
    });
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
// dayOffset: 0 = í dag, 1 = á morgun, 2 = eftir tvo daga o.s.frv.
function bestTroutScoreInSlot(rawInputs, fromH, toH, dayOffset = 0) {
  const base = new Date();
  base.setUTCDate(base.getUTCDate() + dayOffset);
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

function slotNow(repHour, dayOffset = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + dayOffset);
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

// Hversu marga daga fram í tímann (0 = í dag) veiðispá-dagavelan býður upp á.
const VSP_DAY_OFFSETS = [0, 1, 2];

async function initForecast() {
  const dataWarnings = [];

  // Sögulega skýjahulu-API-ið getur verið mjög hægt (yfir 10 sek). Spáin bíður því í mesta lagi
  // 5 sek eftir því og reiknar annars án þess (sama og ef það bregst; viðvörun birtist þá).
  const withTimeout = (promise, ms) =>
    Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

  const [blikaRes, archiveRes, waterRes] = await Promise.allSettled([
    fetchBlikaForecast(),
    withTimeout(fetchHistoricalCloud(), 5000),
    fetch(`${window.ASSET_BASE ?? ""}assets/data/vatnshiti.json`, { cache: "no-cache" })
      .then((r) => r.json())
      .catch(() => null),
  ]);

  if (blikaRes.status   === "rejected") dataWarnings.push("Veðurgögn ekki tiltæk");
  if (archiveRes.status === "rejected") dataWarnings.push("Söguleg skýjahulugögn ekki tiltæk — áhrif fyrri bjartra nátta ekki reiknuð");

  const blikaData   = blikaRes.value?.days ?? null;
  const archiveData = archiveRes.value ?? null;
  const waterData   = waterRes.value   ?? null;

  const vspFetchedNote = document.getElementById("vsp-fetched-note");
  if (vspFetchedNote) {
    const note = formatFetchedNote(blikaRes.value?.fetched);
    vspFetchedNote.textContent = note ?? "";
    vspFetchedNote.hidden = !note;
  }

  const dayBundles = VSP_DAY_OFFSETS.map((offset) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + offset);
    const dayStr = date.toISOString().slice(0, 10);
    const dayWeather = Array.isArray(blikaData)
      ? (blikaData.find((d) => d.dags_spar.slice(0, 10) === dayStr) ?? null)
      : null;

    const rawInputs = {
      cloudCover:            dayWeather ? (merkiToCloud[dayWeather.merki] ?? 50) : null,
      windSpeedMs:           dayWeather?.f10  ?? null,
      windDirDeg:            null,
      windDirText:           dayWeather?.dtexti ?? null,
      waterTemp:             waterData?.temp ?? null,
      historicalHourlyCloud: archiveData,
      dataWarnings,
    };

    const slotResults = VSP_SLOTS.map((s) => {
      const r = runForecast(rawInputs, slotNow(s.repHour, offset));
      const bestTrout = bestTroutScoreInSlot(rawInputs, s.fromH, s.toH, offset);
      if (bestTrout) r.trout = bestTrout;
      return r;
    });

    return { offset, date, slotResults };
  });

  setupDayTabs(dayBundles);
}

function setupDayTabs(dayBundles) {
  const tabsEl = document.getElementById("vsp-day-tabs");
  // Utan veiðitímabils gera dagahnapparnir ekkert, svo þeir eru faldir og lokunarskilaboðin standa ein
  if (!tabsEl || !dayBundles[0].slotResults[0].inSeason) { renderForecast(dayBundles[0]); return; }

  const buttons = Array.from(tabsEl.querySelectorAll(".vsp-day-tab"));
  buttons.forEach((btn) => {
    const bundle = dayBundles[parseInt(btn.dataset.dayOffset, 10)];
    if (!bundle) return;
    btn.textContent = formatDayMonthDot(bundle.date);
    if (bundle.offset === 0) {
      const srSpan = document.createElement("span");
      srSpan.className = "sr-only";
      srSpan.textContent = " (í dag)";
      btn.appendChild(srSpan);
    }
    btn.addEventListener("click", () => {
      buttons.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderForecast(bundle);
    });
  });

  tabsEl.hidden = false;
  if (buttons[0]) buttons[0].classList.add("is-active");
  renderForecast(dayBundles[0]);
}

// Niðurtalning að næsta veiðitímabili (20. apríl), svo lokaða ástandið segi hvenær má koma aftur.
// Ísland er alltaf UTC+0, svo UTC-dagsetningar gefa réttan almanaksdag.
function renderSeasonCountdown() {
  const el = document.getElementById("forecast-countdown");
  if (!el) return;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  let opening = Date.UTC(now.getUTCFullYear(), 3, 20);
  if (opening < today) opening = Date.UTC(now.getUTCFullYear() + 1, 3, 20);
  const days = Math.round((opening - today) / 86400000);
  if (days <= 0) return;
  el.textContent = days === 1
    ? "Næsta veiðitímabil hefst á morgun."
    : `Næsta veiðitímabil hefst eftir ${days} daga.`;
  el.hidden = false;
}

function renderForecast(bundle) {
  const { slotResults, offset } = bundle;
  const loadingEl = document.getElementById("forecast-loading");
  const closedEl  = document.getElementById("forecast-closed");
  const resultEl  = document.getElementById("forecast-result");

  if (loadingEl) loadingEl.hidden = true;

  if (!slotResults[0].inSeason) {
    if (closedEl) closedEl.hidden = false;
    if (resultEl) resultEl.hidden = true;
    renderSeasonCountdown();
    return;
  }
  if (closedEl) closedEl.hidden = true;
  if (resultEl) resultEl.hidden = false;

  const currentSlotKey = offset === 0 ? getCurrentSlotKey() : null;

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

const MOON_WHEEL_N = 8;
const MOON_SYN_MONTH = 29.530588853;

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

function formatMoonTime(date) {
  return date.toLocaleTimeString("is-IS", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Atlantic/Reykjavik",
  });
}

// Sama snið og aðrar dagsetningar á síðunni („9.11.“), áður „9/11“ í tunglhjólinu
function formatDayMonth(date) {
  return `${date.getUTCDate()}.${date.getUTCMonth() + 1}.`;
}

// Handvirk íslensk dagsetningasnið. EKKI nota toLocaleDateString/toLocaleString
// með "is-IS" fyrir tölustafaraðir dags/mánaðar — ófullkomin is-IS gögn í sumum
// vöfrum/Node-útgáfum raða þá mánuði á undan degi (t.d. "7.15." í stað "15.7.").
// Sjá grunnleiðbeiningar í Obsidian: reference_icelandic_date_formatting.md
const IS_MONTHS_LONG = [
  "janúar", "febrúar", "mars", "apríl", "maí", "júní",
  "júlí", "ágúst", "september", "október", "nóvember", "desember",
];
const IS_WEEKDAYS_SHORT = ["sun.", "mán.", "þri.", "mið.", "fim.", "fös.", "lau."];

function formatDayMonthDot(date) {
  return `${date.getUTCDate()}.${date.getUTCMonth() + 1}.`;
}
function formatDayMonthNameLong(date) {
  return `${date.getUTCDate()}. ${IS_MONTHS_LONG[date.getUTCMonth()]}`;
}
function formatWeekdayDayMonth(date) {
  return `${IS_WEEKDAYS_SHORT[date.getUTCDay()]} ${formatDayMonthDot(date)}`;
}

// Byggir "Gögn sótt [dagur]. [mánuður] kl. [HH:MM]." úr fetched-tímastimplinum
// í vedurspa.json. Skilar null ef tímastimpillinn vantar eða er ógildur, svo
// kallandinn geti sleppt línunni alveg í stað þess að sýna "Invalid Date".
function formatFetchedNote(fetchedIso) {
  if (!fetchedIso) return null;
  const fetchedDate = new Date(fetchedIso);
  if (isNaN(fetchedDate.getTime())) return null;

  const timeStr = fetchedDate.toLocaleTimeString("is-IS", {
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "Atlantic/Reykjavik",
  });
  let note = `Gögn sótt ${formatDayMonthNameLong(fetchedDate)} kl. ${timeStr}.`;

  const ageHours = (Date.now() - fetchedDate.getTime()) / (60 * 60 * 1000);
  if (ageHours > 48) {
    note += " Athugið að gögnin gætu verið úrelt.";
  }
  return note;
}

function noonUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
}

// Most recent new moon on/before `now`, then the 4 cardinal + 4 intermediate
// phase dates for the rest of that cycle, in forward chronological order.
function moonCycleDates(now) {
  const today = noonUTC(now);
  let newMoonDate = today;
  let bestDiff = Infinity;
  for (let i = 0; i < 40; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const ph = SunCalc.getMoonIllumination(d).phase;
    const diff = Math.min(ph, 1 - ph);
    if (diff < bestDiff) { bestDiff = diff; newMoonDate = d; }
  }

  const dates = [];
  for (let i = 0; i < MOON_WHEEL_N; i++) {
    const guess = new Date(newMoonDate.getTime() + i * (MOON_SYN_MONTH / MOON_WHEEL_N) * 86400000);
    let refined = guess;
    let refDiff = Infinity;
    for (let off = -2; off <= 2; off += 0.5) {
      const d = new Date(guess.getTime() + off * 86400000);
      const ph = SunCalc.getMoonIllumination(d).phase;
      let diff = Math.abs(ph - i / MOON_WHEEL_N);
      diff = Math.min(diff, Math.abs(diff - 1));
      if (diff < refDiff) { refDiff = diff; refined = d; }
    }
    dates.push(noonUTC(refined));
  }
  return dates;
}

function moonLitPathD(size, r, phase, fraction) {
  const cx = size / 2, cy = size / 2;
  const top = `${cx} ${cy - r}`;
  const bot = `${cx} ${cy + r}`;
  if (fraction > 0.995) return `M ${cx} ${cy} m ${-r} 0 a ${r} ${r} 0 1 0 ${r*2} 0 a ${r} ${r} 0 1 0 ${-r*2} 0`;
  if (fraction <= 0.005) return null;
  let rx, outerSweep;
  if (phase < 0.5) { rx = r * Math.cos(2 * Math.PI * phase); outerSweep = 1; }
  else { rx = r * Math.cos(2 * Math.PI * (phase - 0.5)); outerSweep = 0; }
  const absRx = Math.abs(rx);
  const tSweep = rx >= 0 ? 0 : 1;
  return absRx < 0.5
    ? `M ${top} A ${r} ${r} 0 0 ${outerSweep} ${bot} L ${top} Z`
    : `M ${top} A ${r} ${r} 0 0 ${outerSweep} ${bot} A ${absRx} ${r} 0 0 ${tSweep} ${top} Z`;
}

function moonIconMarkup(id, size, phase, fraction, moonHref) {
  const r = size / 2 - 1.5;
  const cx = size / 2, cy = size / 2;
  const d = moonLitPathD(size, r, phase, fraction);
  return `
    <clipPath id="mc-${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    ${d ? `<clipPath id="ml-${id}"><path d="${d}"/></clipPath>` : ""}
    <g>
      <image href="${moonHref}" x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" clip-path="url(#mc-${id})" opacity="0.12" preserveAspectRatio="xMidYMid slice"/>
      ${d ? `<image href="${moonHref}" x="${cx-r}" y="${cy-r}" width="${r*2}" height="${r*2}" clip-path="url(#ml-${id})" preserveAspectRatio="xMidYMid slice"/>` : ""}
    </g>`;
}

// Ring of the 8 cycle phases with the 4 cardinal ones (new/Q1/full/Q3) shown
// as date bubbles on the ring track, and a glowing "comet" trail leading from
// today's true position to (and around) the nearest cardinal bubble.
function moonWheelSVG(now, moonHref) {
  const illum = SunCalc.getMoonIllumination(now);
  const phase = illum.phase;
  const fraction = illum.fraction;
  const refDates = moonCycleDates(now);

  const SIZE = 540;
  const CX = SIZE / 2, CY = SIZE / 2;
  const RING_R = 153;
  const ICON_SIZE = 60;
  // Dagsetningaflipar eru ósnúnir rétthyrningar, svo radíus-plássið sem þeir
  // taka fer eftir breidd þeirra (vinstri/hægri staða) frekar en hæð
  // (efst/neðst staða) — bilið hér þarf að rúma breiðasta mögulega dagsetningu
  // (t.d. "31/12") án þess að skarast við tunglmyndirnar.
  const trackR = RING_R + ICON_SIZE / 2 + 39;
  const pointerAngle = phase * 2 * Math.PI - Math.PI / 2;

  const cardinal = [0, 2, 4, 6];
  const MERGE_THRESH = 1.5 / MOON_SYN_MONTH;
  let nearestCardinal = null, nearestDiff = Infinity, nearestSigned = 0;
  for (const i of cardinal) {
    const target = i / MOON_WHEEL_N;
    let diff = phase - target;
    if (diff > 0.5) diff -= 1;
    if (diff < -0.5) diff += 1;
    if (Math.abs(diff) < nearestDiff) { nearestDiff = Math.abs(diff); nearestCardinal = i; nearestSigned = diff; }
  }
  const merged = nearestDiff <= MERGE_THRESH;

  let ringIcons = "";
  for (let i = 0; i < MOON_WHEEL_N; i++) {
    const p = i / MOON_WHEEL_N;
    const f = (1 - Math.cos(2 * Math.PI * p)) / 2;
    const angle = (i / MOON_WHEEL_N) * 2 * Math.PI - Math.PI / 2;
    const x = CX + RING_R * Math.cos(angle) - ICON_SIZE / 2;
    const y = CY + RING_R * Math.sin(angle) - ICON_SIZE / 2;
    ringIcons += `<g transform="translate(${x},${y})"><svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 ${ICON_SIZE} ${ICON_SIZE}">${moonIconMarkup("r" + i, ICON_SIZE, p, f, moonHref)}</svg></g>`;
  }

  const glowFilter = `<filter id="moonWheelGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  const trackCircle = `<circle cx="${CX}" cy="${CY}" r="${trackR}" fill="none" stroke="rgba(245,230,176,0.07)" stroke-width="1.3"/>`;

  function chipGeom(text) {
    const fontSize = 13.1;
    const charW = fontSize * 0.62;
    const w = text.length * charW + 15;
    const h = 21;
    return { w, h, halfAngle: (w / 2) / trackR };
  }

  let overlay = `<defs>${glowFilter}</defs>`;

  if (merged) {
    const cardAngle = (nearestCardinal / MOON_WHEEL_N) * 2 * Math.PI - Math.PI / 2;
    const text = formatDayMonth(refDates[nearestCardinal]);
    const { w, h, halfAngle } = chipGeom(text);
    const cx0 = CX + trackR * Math.cos(cardAngle), cy0 = CY + trackR * Math.sin(cardAngle);

    const leftEdgeAngle = cardAngle - halfAngle;
    const tailStart = leftEdgeAngle - 0.42;
    const tsx = CX + trackR * Math.cos(tailStart), tsy = CY + trackR * Math.sin(tailStart);
    const tex = CX + trackR * Math.cos(leftEdgeAngle), tey = CY + trackR * Math.sin(leftEdgeAngle);

    overlay += `
      <linearGradient id="moonTrailGrad" gradientUnits="userSpaceOnUse" x1="${tsx.toFixed(1)}" y1="${tsy.toFixed(1)}" x2="${tex.toFixed(1)}" y2="${tey.toFixed(1)}">
        <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0"/>
        <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.95"/>
      </linearGradient>
      ${trackCircle}
      <path d="M ${tsx.toFixed(1)} ${tsy.toFixed(1)} A ${trackR} ${trackR} 0 0 1 ${tex.toFixed(1)} ${tey.toFixed(1)}"
            fill="none" stroke="url(#moonTrailGrad)" stroke-width="3.1" stroke-linecap="round" filter="url(#moonWheelGlow)"/>
      <rect x="${(cx0 - w/2).toFixed(1)}" y="${(cy0 - h/2).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${h/2}"
            fill="var(--color-bg-card)" stroke="var(--color-accent)" stroke-width="2.5" filter="url(#moonWheelGlow)"/>
      <text x="${cx0.toFixed(1)}" y="${(cy0+4.4).toFixed(1)}" text-anchor="middle" font-family="-apple-system, sans-serif"
            font-size="13.1" font-weight="700" fill="var(--color-accent-light)">${text}</text>
    `;

    const nearestSignedAngle = nearestSigned * 2 * Math.PI;
    if (Math.abs(nearestSignedAngle) > halfAngle) {
      const rightEdgeAngle = cardAngle + halfAngle;
      const rex = CX + trackR * Math.cos(rightEdgeAngle), rey = CY + trackR * Math.sin(rightEdgeAngle);
      const dex = CX + trackR * Math.cos(pointerAngle), dey = CY + trackR * Math.sin(pointerAngle);
      overlay += `
        <path d="M ${rex.toFixed(1)} ${rey.toFixed(1)} A ${trackR} ${trackR} 0 0 1 ${dex.toFixed(1)} ${dey.toFixed(1)}"
              fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" opacity="0.85" filter="url(#moonWheelGlow)"/>
        <g class="moon-today-dot" data-date="${formatDayMonth(now)}">
          <circle cx="${dex.toFixed(1)}" cy="${dey.toFixed(1)}" r="16" fill="transparent"/>
          <circle cx="${dex.toFixed(1)}" cy="${dey.toFixed(1)}" r="4.4" fill="var(--color-accent)" filter="url(#moonWheelGlow)"/>
        </g>
      `;
    }
  } else {
    const arcLen = 0.5;
    const startA = pointerAngle - arcLen;
    const sx = CX + trackR * Math.cos(startA), sy = CY + trackR * Math.sin(startA);
    const ex = CX + trackR * Math.cos(pointerAngle), ey = CY + trackR * Math.sin(pointerAngle);
    overlay += `
      <linearGradient id="moonTrailGrad" gradientUnits="userSpaceOnUse" x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}">
        <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0"/>
        <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.95"/>
      </linearGradient>
      ${trackCircle}
      <path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${trackR} ${trackR} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}"
            fill="none" stroke="url(#moonTrailGrad)" stroke-width="3.1" stroke-linecap="round" filter="url(#moonWheelGlow)"/>
      <g class="moon-today-dot" data-date="${formatDayMonth(now)}">
        <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="16" fill="transparent"/>
        <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="4.4" fill="var(--color-accent)" filter="url(#moonWheelGlow)"/>
      </g>
    `;
  }

  let labels = "";
  for (const i of cardinal) {
    if (merged && i === nearestCardinal) continue;
    const angle = (i / MOON_WHEEL_N) * 2 * Math.PI - Math.PI / 2;
    const lx = CX + trackR * Math.cos(angle), ly = CY + trackR * Math.sin(angle);
    const text = formatDayMonth(refDates[i]);
    const { w, h } = chipGeom(text);
    labels += `
      <rect x="${(lx - w/2).toFixed(1)}" y="${(ly - h/2).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="${h/2}"
            fill="var(--color-bg-card)" stroke="rgba(245,230,176,0.15)" stroke-width="1.3"/>
      <text x="${lx.toFixed(1)}" y="${(ly+4.4).toFixed(1)}" text-anchor="middle" font-family="-apple-system, sans-serif"
            font-size="13.1" font-weight="500" fill="var(--color-text)">${text}</text>`;
  }

  return `<svg viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    ${overlay}
    ${ringIcons}
    ${labels}
  </svg>`;
}

// Hover á "í dag"-punktinum á tunglhringnum sýnir dagsetningu dagsins í dag.
function setupMoonTooltip(wheelContainer) {
  const svg = wheelContainer.querySelector("svg");
  const dot = wheelContainer.querySelector(".moon-today-dot");
  if (!svg || !dot) return;

  const wrap = wheelContainer.closest(".moon-wheel-inner");
  if (!wrap) return;

  let tip = wrap.querySelector(".moon-tooltip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "moon-tooltip";
    tip.hidden = true;
    wrap.appendChild(tip);
  }

  const point = dot.querySelector("circle:last-child");
  const cx = parseFloat(point.getAttribute("cx"));
  const cy = parseFloat(point.getAttribute("cy"));
  const viewBoxSize = svg.viewBox.baseVal.width;

  const showTip = () => {
    const scale = svg.getBoundingClientRect().width / viewBoxSize;
    tip.textContent = `Í dag · ${dot.dataset.date}`;
    tip.style.left = `${cx * scale}px`;
    tip.style.top = `${cy * scale}px`;
    tip.hidden = false;
  };
  const hideTip = () => { tip.hidden = true; };

  dot.addEventListener("mouseenter", showTip);
  dot.addEventListener("mouseleave", hideTip);
}

function initMoonWidget() {
  const wheelContainer = document.getElementById("moon-wheel-svg");
  const phaseNameEl     = document.getElementById("moon-phase-name");
  const illumEl         = document.getElementById("moon-illum-pct");
  const timesEl         = document.getElementById("moon-times");
  const cloudEl         = document.getElementById("moon-cloud-pct");

  if (!wheelContainer) return;

  if (typeof SunCalc === "undefined") {
    phaseNameEl.textContent = "Ekki tókst að hlaða tunglagögnum. Reyndu að endurhlaða síðuna.";
    setNow("moon", "&ndash;", "Næst ekki í augnablikinu");
    return;
  }

  const now = new Date();
  const LAT = 64.2559;
  const LON = -21.1179;
  const moonHref = `${window.ASSET_BASE ?? ""}assets/images/web/moon-tight.jpg`;

  const illum = SunCalc.getMoonIllumination(now);
  const phase = illum.phase;
  const fraction = illum.fraction;

  wheelContainer.innerHTML = moonWheelSVG(now, moonHref);
  phaseNameEl.textContent = moonPhaseName(phase);
  illumEl.textContent = `${Math.round(fraction * 100)}%`;
  setNow("moon", `${Math.round(fraction * 100)}%`, `${moonPhaseName(phase)} · birta`);
  setupMoonTooltip(wheelContainer);

  const mt = SunCalc.getMoonTimes(now, LAT, LON);
  const parts = [];
  if (mt.rise) parts.push(`Rís ${formatMoonTime(mt.rise)}`);
  if (mt.set) parts.push(`Sest ${formatMoonTime(mt.set)}`);
  timesEl.textContent = parts.length ? parts.join(" · ") : "Gengur ekki niður í nótt";

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=cloud_cover&timezone=Atlantic%2FReykjavik`
  )
    .then((r) => r.json())
    .then((data) => {
      const cc = data?.current?.cloud_cover;
      cloudEl.textContent = cc != null ? `${cc}%` : "Óþekkt";
    })
    .catch(() => { cloudEl.textContent = "Óþekkt"; });
}

// ── „Horfa á upphafið“ í hero: fletta að myndbandinu og spila það ───────────
// Án þessa fletti hnappurinn bara að myndbandinu og gesturinn þurfti að smella aftur.
// Ef vafrinn leyfir ekki sjálfvirka spilun stendur myndbandið tilbúið og ekkert brotnar.
(function () {
  const btn = document.getElementById('hero-play');
  const frame = document.querySelector('#upphafid iframe');
  if (!btn || !frame) return;
  const wrap = document.getElementById('upphafid');
  // Staðsetning sem miðjar myndbandið á skjánum, en aldrei undir föstu valmyndinni
  const targetTop = () => {
    const r = wrap.getBoundingClientRect();
    return r.top + window.scrollY - Math.max(72, (window.innerHeight - r.height) / 2);
  };
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: targetTop(), behavior: 'smooth' });
    // Myndir sem hlaðast á leiðinni geta hliðrað síðunni: leiðrétta þegar flettingu lýkur,
    // og ræsa myndbandið fyrst þá (að skipta um src á meðan getur stöðvað flettinguna).
    setTimeout(() => {
      window.scrollTo({ top: targetTop(), behavior: 'smooth' });
      if (!frame.src.includes('autoplay=1')) {
        frame.src += (frame.src.includes('?') ? '&' : '?') + 'autoplay=1';
      }
    }, 900);
  });
})();

// ── Support: copy-to-clipboard ──────────────────────────────────────────────
(function () {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Sýnileg staðfesting („Afritað“ / „Afritun tókst ekki“) fyrir ofan hnappinn, ekki bara aria-label
      const flash = (cls, label) => {
        const orig = btn.dataset.origLabel || btn.getAttribute('aria-label');
        btn.dataset.origLabel = orig;
        btn.classList.remove('copied', 'copy-failed');
        btn.classList.add(cls);
        btn.setAttribute('aria-label', label);
        setTimeout(() => {
          btn.classList.remove(cls);
          btn.setAttribute('aria-label', orig);
        }, 1800);
      };
      const copy = navigator.clipboard
        ? navigator.clipboard.writeText(btn.dataset.copy)
        : Promise.reject(new Error('no clipboard'));
      copy.then(() => flash('copied', 'Afritað'))
          .catch(() => flash('copy-failed', 'Afritun tókst ekki, afritaðu handvirkt'));
    });
  });
})();

// ── Theme carousel ──────────────────────────────────────────────────────────
(function () {
  const themes = [
    { src: 'assets/images/web/theme-thjodgardur.webp',  alt: 'Landslag við Þingvallavatn',               title: 'Þingvallavatn og þjóðgarðurinn',     desc: 'Sérstaða vatnsins, sagan og staðurinn sem geymir bæði náttúru og menningararf þjóðarinnar.' },
    { src: 'assets/images/web/theme-bleikja.webp',        alt: 'Bleikja úr Þingvallavatni',                title: 'Bleikjan og afbrigði hennar',         desc: 'Eitt merkasta dæmi heimsins um hraða þróun: fjögur afbrigði bleikju sem hafa aðlagast sama vatninu á mismunandi hátt.' },
    { src: 'assets/images/web/theme-urridi.webp',         alt: 'Urriði á næturveiði í Þingvallavatni',     title: 'Urriðinn og næturveiðin',             desc: 'Stærsti urriði landsins leynist í djúpinu og kemur fram þegar myrkrið skellur á.' },
    { src: 'assets/images/web/theme-faedukedja.webp',     alt: 'Vatnabobbi úr Þingvallavatni',             title: 'Mýflugan, vatnabobbinn og vorflugan', desc: 'Smádýrin sem mynda undirstöðu fæðukeðjunnar og halda öllu vistkerfinu gangandi.' },
    { src: 'assets/images/web/theme-hornsili-murta.webp', alt: 'Murta úr Þingvallavatni',                  title: 'Hornsíli, murta og fæðukeðjan',       desc: 'Hvernig lítil dýr og smáfiskar tengja saman allt lífríki vatnsins, frá botni og upp.' },
    { src: 'assets/images/web/theme-veidiadferdir.webp',  alt: 'Veiðimaður við Þingvallavatn',             title: 'Veiðiaðferðir og lestur vatnsins',    desc: 'Hvernig á að lesa vatnið: birtu, vind, dýpi og hegðun bleikju og urriða.' },
    { src: 'assets/images/web/theme-visindi.webp',        alt: 'Líffræðingur að störfum við Þingvallavatn',title: 'Vísindi og sérfræðiþekking',          desc: 'Rannsóknir á lífríki vatnsins og því sem vísindamenn hafa lært af einu merkasta stöðuvatni heims.' },
    { src: 'assets/images/web/theme-framtid.webp',        alt: 'Alda í óveðri á Þingvallavatni',           title: 'Framtíð vatnsins',                    desc: 'Hvað bíður Þingvallavatns og hvernig getum við varðveitt þennan einstaka heim?' },
  ];

  const carousel  = document.getElementById('theme-carousel');
  if (!carousel) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const imgEl     = document.getElementById('theme-card-img');
  const titleEl   = document.getElementById('theme-card-title');
  const descEl    = document.getElementById('theme-card-desc');
  const contentEl = document.getElementById('theme-card-content');
  const nameList  = document.getElementById('theme-name-list');
  const card      = document.getElementById('theme-main-card');
  const total     = themes.length;

  let current = 0;
  let busy    = false;

  const nameBtns = themes.map((t, i) => {
    const li  = document.createElement('li');
    const btn = document.createElement('button');
    btn.className   = 'theme-name-btn' + (i === 0 ? ' is-active' : '');
    btn.type        = 'button';
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.textContent = t.title;
    btn.addEventListener('click', () => goTo(i));
    li.appendChild(btn);
    nameList.appendChild(li);
    return btn;
  });

  function goTo(idx) {
    if (busy) return;
    idx = ((idx % total) + total) % total;
    if (idx === current) return;
    busy = true;

    const t = themes[idx];
    const preload = new Image();
    preload.src = t.src;
    let imageReady = preload.complete;
    let fadeOutDone = false;

    imgEl.classList.add('is-fading');
    contentEl.classList.add('is-fading');

    const reveal = () => {
      if (!fadeOutDone || !imageReady) return;
      current = idx;
      imgEl.src             = t.src;
      imgEl.alt             = t.alt;
      titleEl.textContent   = t.title;
      descEl.textContent    = t.desc;

      nameBtns.forEach((b, i) => {
        b.classList.toggle('is-active', i === current);
        b.setAttribute('aria-pressed', i === current ? 'true' : 'false');
      });

      imgEl.classList.remove('is-fading');
      contentEl.classList.remove('is-fading');
      busy = false;
    };

    if (!imageReady) {
      preload.onload  = () => { imageReady = true; reveal(); };
      preload.onerror = () => { imageReady = true; reveal(); };
    }

    setTimeout(() => { fadeOutDone = true; reveal(); }, reducedMotion ? 0 : 280);
  }

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  let txStart = 0;
  card.addEventListener('touchstart', (e) => { txStart = e.touches[0].clientX; }, { passive: true });
  card.addEventListener('touchend',   (e) => {
    const delta = e.changedTouches[0].clientX - txStart;
    if (Math.abs(delta) > 48) goTo(delta < 0 ? current + 1 : current - 1);
  });

  let mxStart  = 0;
  let dragging = false;
  card.addEventListener('mousedown', (e) => {
    mxStart  = e.clientX;
    dragging = true;
    card.classList.add('is-dragging');
  });
  document.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    card.classList.remove('is-dragging');
    const delta = e.clientX - mxStart;
    if (Math.abs(delta) > 48) goTo(delta < 0 ? current + 1 : current - 1);
  });
  card.addEventListener('dragstart', (e) => e.preventDefault());
})();

initMoonWidget();
