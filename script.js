(function () {
  const DEN = 864e5;

  // Dátum "RRRR-MM-DD" ako lokálna polnoc (bez posunu časového pásma).
  function d(s) {
    const [y, m, day] = s.split("-").map(Number);
    return new Date(y, m - 1, day);
  }
  function pridajDni(date, n) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
  }
  function rozdielDni(a, b) {
    return Math.round((b - a) / DEN);
  }
  function formatDatum(date) {
    return date.toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" });
  }
  function formatKratko(date) {
    return date.toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" });
  }
  function sklonuj(n, jeden, dvaStyri, pat) {
    if (n === 1) return `${n} ${jeden}`;
    if (n >= 2 && n <= 4) return `${n} ${dvaStyri}`;
    return `${n} ${pat}`;
  }
  const cislo = (n) => n.toLocaleString("sk-SK");

  // Kalendárne trvanie od "od" po "doExkl" (exkluzívne) ako roky, mesiace, dni.
  function trvanie(od, doExkl) {
    let r = doExkl.getFullYear() - od.getFullYear();
    let m = doExkl.getMonth() - od.getMonth();
    let dni = doExkl.getDate() - od.getDate();
    if (dni < 0) {
      m -= 1;
      dni += new Date(doExkl.getFullYear(), doExkl.getMonth(), 0).getDate();
    }
    if (m < 0) {
      r -= 1;
      m += 12;
    }
    const casti = [];
    if (r) casti.push(sklonuj(r, "rok", "roky", "rokov"));
    if (m) casti.push(sklonuj(m, "mesiac", "mesiace", "mesiacov"));
    if (dni) casti.push(sklonuj(dni, "deň", "dni", "dní"));
    return casti.join(", ") || "0 dní";
  }

  const dnes = (() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  })();

  const obdobia = TIMELINE.filter((x) => x.typ === "obdobie").map((x) => ({
    ...x,
    start: d(x.od),
    koniec: pridajDni(d(x.do), 1), // exkluzívny koniec
  }));
  const udalosti = TIMELINE.filter((x) => x.typ === "udalost").map((x) => ({ ...x, date: d(x.datum) }));

  const osStart = new Date(Math.min(...TIMELINE.map((x) => d(x.datum || x.od))));
  const osKoniec = new Date(Math.max(...obdobia.map((x) => x.koniec)));
  const pozicia = (date) => (rozdielDni(osStart, date) / rozdielDni(osStart, osKoniec)) * 100;

  function stav(start, koniec) {
    if (dnes >= koniec) return "ukoncene";
    if (dnes >= start) return "prebieha";
    return "buduce";
  }
  const STAV_TEXT = { ukoncene: "Ukončené", prebieha: "Prebieha", buduce: "Pripravuje sa" };
  const STAV_ROK = { ukoncene: "Ukončený", buduce: "Budúci" };

  function el(tag, attrs = {}, html = "") {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    e.innerHTML = html;
    return e;
  }

  // --- Súhrn ---
  const prvy = obdobia[0];
  const funkcne = obdobia.find((x) => x.skolskeRoky) || obdobia[obdobia.length - 1];
  const vedenie = Math.max(0, rozdielDni(prvy.start, dnes < osKoniec ? dnes : osKoniec));
  const celkom = rozdielDni(funkcne.start, funkcne.koniec);
  const uplynulo = Math.min(celkom, Math.max(0, rozdielDni(funkcne.start, dnes)));
  const percento = Math.round((uplynulo / celkom) * 100);
  const zostava = celkom - uplynulo;

  const stats = document.getElementById("stats");
  stats.append(
    el("div", { class: "stat" }, `<span class="stat-label">Vo vedení školy</span><span class="stat-value">${cislo(vedenie)} <span class="stat-extra">a z toho ako riaditeľ ${cislo(uplynulo)}</span></span><span class="stat-sub">dní od ${formatKratko(prvy.start)}</span>`),
    el("div", { class: "stat" }, `<span class="stat-label">Funkčné obdobie</span><span class="stat-value">${percento} %</span><span class="meter" aria-hidden="true"><span style="width:${percento}%"></span></span>`),
    el("div", { class: "stat" }, `<span class="stat-label">Do konca obdobia</span><span class="stat-value">${cislo(zostava)}</span><span class="stat-sub">dní, do ${formatKratko(d(funkcne.do))}</span>`)
  );

  // --- Proporcionálny prehľad ---
  const bar = document.getElementById("bar");
  obdobia.forEach((o) => {
    const seg = el("div", { class: `seg c-${o.farba}`, title: `${o.nazov}: ${formatKratko(o.start)} – ${formatKratko(d(o.do))}` });
    seg.style.left = pozicia(o.start) + "%";
    seg.style.width = pozicia(o.koniec) - pozicia(o.start) + "%";
    if (o.skolskeRoky) {
      for (let y = o.start.getFullYear() + 1; y < o.koniec.getFullYear(); y++) {
        const div = el("span", { class: "seg-split" });
        div.style.left = ((rozdielDni(o.start, new Date(y, 6, 1)) / rozdielDni(o.start, o.koniec)) * 100) + "%";
        seg.append(div);
      }
    }
    bar.append(seg);
  });
  udalosti.forEach((u) => {
    const m = el("span", { class: "event-dot", title: `${u.nazov}: ${formatKratko(u.date)}` });
    m.style.left = pozicia(u.date) + "%";
    bar.append(m);
  });
  if (dnes >= osStart && dnes < osKoniec) {
    const t = el("span", { class: "today-line" }, `<span class="today-flag">dnes</span>`);
    t.style.left = pozicia(dnes) + "%";
    bar.append(t);
  }

  const axis = document.getElementById("axis");
  for (let y = osStart.getFullYear() + 1; y <= osKoniec.getFullYear(); y++) {
    const tick = el("span", { class: "tick" }, String(y));
    tick.style.left = pozicia(new Date(y, 0, 1)) + "%";
    axis.append(tick);
  }

  const legend = document.getElementById("legend");
  udalosti.forEach((u) => legend.append(el("li", {}, `<span class="sw sw-event"></span><span>${u.nazov} <span class="muted">${formatKratko(u.date)}</span></span>`)));
  obdobia.forEach((o) => legend.append(el("li", {}, `<span class="sw c-${o.farba}"></span><span>${o.nazov} <span class="muted nowrap">${formatKratko(o.start)} – ${formatKratko(d(o.do))}</span></span>`)));

  // --- Podrobná časová os ---
  const tl = document.getElementById("timeline");
  const polozky = [...udalosti.map((u) => ({ ...u, start: u.date })), ...obdobia].sort((a, b) => a.start - b.start);

  polozky.forEach((p) => {
    if (p.typ === "udalost") {
      tl.append(el("li", { class: "item item-event" }, `
        <span class="node" aria-hidden="true"></span>
        <div class="item-body">
          <time datetime="${p.datum}" class="date">${formatDatum(p.date)}</time>
          <h3>${p.nazov}</h3>
          ${p.popis ? `<p>${p.popis}</p>` : ""}
        </div>`));
      return;
    }

    const s = stav(p.start, p.koniec);
    let roky = "";
    if (p.skolskeRoky) {
      const riadky = [];
      for (let y = p.start.getFullYear(); y < p.koniec.getFullYear(); y++) {
        const rs = new Date(y, 6, 1);
        const rk = new Date(y + 1, 6, 1);
        const st = stav(rs, rk);
        let pr = st === "ukoncene" ? 100 : st === "prebieha" ? Math.round((rozdielDni(rs, dnes) / rozdielDni(rs, rk)) * 100) : 0;
        riadky.push(`
          <li class="year ${st}">
            <span class="year-n">${y - p.start.getFullYear() + 1}. rok</span>
            <span class="year-name"><span class="year-prefix">Školský rok </span>${y}/${y + 1}</span>
            <span class="year-meter" aria-hidden="true"><span style="width:${pr}%"></span></span>
            <span class="year-state">${st === "prebieha" ? pr + " %" : STAV_ROK[st]}</span>
          </li>`);
      }
      roky = `<ol class="years">${riadky.join("")}</ol>`;
    }

    tl.append(el("li", { class: `item c-${p.farba} ${s}` }, `
      <span class="node" aria-hidden="true"></span>
      <div class="item-body">
        <div class="item-head">
          <span class="date"><time datetime="${p.od}">${formatDatum(p.start)}</time> – <time datetime="${p.do}">${formatDatum(d(p.do))}</time></span>
          <span class="badge ${s}">${STAV_TEXT[s]}</span>
        </div>
        <h3>${p.nazov}</h3>
        <p>${p.popis}</p>
        <p class="meta"><span class="chip">${p.stitok}</span> Trvanie: ${trvanie(p.start, p.koniec)} (${cislo(rozdielDni(p.start, p.koniec))} dní)</p>
        ${roky}
      </div>`));
  });

  document.getElementById("today").textContent = formatDatum(dnes);
})();
