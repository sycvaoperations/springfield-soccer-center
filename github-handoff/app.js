/* Springfield Soccer Center — interactions */
(function () {
  "use strict";

  /* Engage animated start-states only now that JS is running. */
  document.documentElement.classList.add("anim");

  /* ---------- Nav: shrink on scroll + mobile toggle ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );

  /* ---------- Reveal on scroll (robust to jump-scrolls) ---------- */
  const revealEls = () => Array.from(document.querySelectorAll(".reveal:not(.in)"));
  const checkReveals = () => {
    const trigger = window.innerHeight * 0.9;
    revealEls().forEach((el) => {
      const top = el.getBoundingClientRect().top;
      // reveal once it has entered the lower 90% of the viewport OR scrolled past above
      if (top < trigger) el.classList.add("in");
    });
  };
  const observeReveals = () => checkReveals();
  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", checkReveals, { passive: true });
  requestAnimationFrame(checkReveals);

  /* Safety net: after 3s reveal anything in/above the viewport that somehow
     hasn't fired — but DON'T pre-reveal below-the-fold sections, or their
     scroll-in animations would play off-screen and look broken. */
  setTimeout(() => {
    const vh = window.innerHeight;
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
      if (el.getBoundingClientRect().top < vh) el.classList.add("in");
    });
  }, 3000);

  /* ---------- Hero line reveal ---------- */
  const hero = document.querySelector(".hero");
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("ready")));

  /* ============================================================
     PROGRAM FINDER
     ============================================================ */
  const tabsEl = document.getElementById("ageTabs");
  const hintEl = document.getElementById("ageHint");
  const resultsEl = document.getElementById("finderResults");
  const REGISTER_URL = "#register";

  /* ---- Category accent + icon system (grouped into 6 type families) ---- */
  const SI = 'stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  /* Brand-aligned accent palette: SYC orange anchors it, with warm metals
     (gold, bronze) and cool brand tones (teal, steel, silver) — cohesive,
     no rainbow, still clearly distinguishable. */
  const FAMILY = {
    foundations: { color: "#1f9aa6", icon: `<svg viewBox="0 0 24 24" ${SI}><path d="M7 20h10"/><path d="M12 20V10"/><path d="M12 11C12 7.5 9.5 5 5.5 5 5.5 8.5 8 11 12 11Z"/><path d="M12 12c0-2.8 2.2-5 5.5-5 0 2.8-2.2 5-5.5 5Z"/></svg>` },
    camp:        { color: "#f26200", icon: `<svg viewBox="0 0 24 24" ${SI}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>` },
    pro:         { color: "#e0a52e", icon: `<svg viewBox="0 0 24 24" ${SI}><circle cx="12" cy="9" r="5"/><path d="M8.5 13.5 7 21l5-2.6L17 21l-1.5-7.5"/></svg>` },
    technical:   { color: "#9fb1c4", icon: `<svg viewBox="0 0 24 24" ${SI}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/></svg>` },
    futsal:      { color: "#5e84b8", icon: `<svg viewBox="0 0 24 24" ${SI}><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1-8Z"/></svg>` },
    keeper:      { color: "#c2673c", icon: `<svg viewBox="0 0 24 24" ${SI}><path d="M12 3 5 6v5.5c0 4.2 3 7.4 7 9 4-1.6 7-4.8 7-9V6l-7-3Z"/><path d="m9.2 12 2 2 3.6-3.8"/></svg>` },
  };
  const CAT_FAMILY = {
    "Foundations": "foundations", "Pathway": "foundations",
    "Camp": "camp",
    "Pro Development": "pro",
    "Ball Mastery": "technical", "Technical": "technical", "Dribbling": "technical", "Finishing": "technical",
    "Small-Sided": "futsal",
    "Goalkeeping": "keeper",
  };
  const famOf = (p) => FAMILY[CAT_FAMILY[p.cat] || "technical"];

  /* ---- Consolidated metadata → icon glyphs ---- */
  const GLY = {
    age:   `<svg viewBox="0 0 24 24" ${SI}><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.6-3.6 3.5-5.4 7-5.4S18.4 16.4 19 20"/></svg>`,
    dur:   `<svg viewBox="0 0 24 24" ${SI}><path d="M7 3h10M7 21h10"/><path d="M8 3v4.2c0 1.1.5 2.1 1.4 2.8L12 12l-2.6 2c-.9.7-1.4 1.7-1.4 2.8V21"/><path d="M16 3v4.2c0 1.1-.5 2.1-1.4 2.8L12 12l2.6 2c.9.7 1.4 1.7 1.4 2.8V21"/></svg>`,
    sched: `<svg viewBox="0 0 24 24" ${SI}><rect x="3.5" y="4.5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8.5 2.5v4M15.5 2.5v4"/></svg>`,
    time:  `<svg viewBox="0 0 24 24" ${SI}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>`,
    who:   `<svg viewBox="0 0 24 24" ${SI}><circle cx="9" cy="9" r="3"/><path d="M3.5 19c.5-3 2.7-4.6 5.5-4.6M16 14.2A3 3 0 1 0 16 8.4M14 19c.4-2.4 2-4 4.5-4.2"/></svg>`,
  };
  function metaKind(m) {
    if (/\d+\s*-?\s*weeks?\b/i.test(m)) return "dur";
    if (/\b(am|pm)\b/i.test(m) || /\d{1,2}:\d{2}/.test(m)) return "time";
    if (/parent|player|adult|family/i.test(m)) return "who";
    return "sched";
  }
  function metaRow(p) {
    let out = `<span class="m m-lead">${GLY.age}<span>${p.age}</span></span>`;
    p.meta.forEach((m) => { out += `<span class="m">${GLY[metaKind(m)]}<span>${m}</span></span>`; });
    return out;
  }

  const isMobileCards = () => window.matchMedia("(max-width: 640px)").matches;

  function programCard(id, opts) {
    opts = (typeof opts === "object" && opts) ? opts : { hero: !!opts };
    const p = PROGRAMS[id];
    if (!p) return "";
    const f = famOf(p);
    const fam = CAT_FAMILY[p.cat] || "technical";
    const a11y = `data-id="${id}" data-fam="${fam}" style="--fam:${f.color}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${p.title} — view details"`;
    // On mobile every card uses the rich hero layout so they all look the same.
    const heroLayout = opts.hero || isMobileCards();
    if (heroLayout) {
      const flag = opts.flag ? `<span class="pcard-flag">&#9733; Best Match</span>` : "";
      return `
        <article class="pcard is-hero reveal" ${a11y}>
          <div class="pcard-media">
            <img src="${p.banner}" alt="" loading="lazy" />
            <span class="pcard-badge">${f.icon}</span>
            ${flag}
          </div>
          <div class="pcard-main">
            <div class="pcat">${p.cat}</div>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <div class="meta">${metaRow(p)}</div>
            <span class="pcard-cta">View Details <span class="arr">&rarr;</span></span>
          </div>
        </article>`;
    }
    return `
      <article class="pcard reveal" ${a11y}>
        <div class="pcard-media">
          <img src="${p.banner}" alt="" loading="lazy" />
          <span class="pcard-tag">${f.icon}<span>${p.cat}</span></span>
        </div>
        <div class="pcard-main">
          <h3>${p.title}</h3>
          <p class="pcard-desc">${p.desc}</p>
          <div class="meta">${metaRow(p)}</div>
          <span class="pcard-cta">View Details <span class="arr">&rarr;</span></span>
        </div>
      </article>`;
  }

  const swipeHint = (n) => n > 1
    ? `<div class="swipe-hint" aria-hidden="true"><span class="sh-track sh-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/><path d="M21 6l-6 6 6 6"/></svg></span>Swipe for more<span class="sh-track sh-r"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/><path d="M3 6l6 6-6 6"/></svg></span></div>`
    : "";

  function groupBlock(label, tag, ids, accentLabel, opts) {
    opts = opts || {};
    let cards, gridCls = "card-grid";
    if (opts.hero && ids.length) {
      cards = programCard(ids[0], { hero: true, flag: true }) + ids.slice(1).map((id) => programCard(id, {})).join("");
      gridCls += " has-hero";
    } else {
      cards = ids.map((id) => programCard(id, {})).join("");
    }
    const inner = `<div class="${gridCls}">${cards}</div>${swipeHint(ids.length)}`;
    const labelHTML = accentLabel
      ? label.replace(accentLabel, `<span class="o">${accentLabel}</span>`)
      : label;
    return `
      <div class="group-block">
        <div class="group-head reveal">
          <span class="gtag">${tag}</span>
          <span class="glabel">${labelHTML}</span>
          <span class="group-rule"></span>
        </div>
        ${inner}
      </div>`;
  }

  /* ---- Finder state: age group + optional player-identity filter ---- */
  const identityCardsEl = document.getElementById("identityCards");
  const identityClearEl = document.getElementById("identityClear");
  let activeGroup = null;
  let activeIdentity = null;

  const identityById = (id) => IDENTITIES.find((x) => x.id === id);
  const groupProgramIds = (g) =>
    [...g.featured, ...g.supplemental.ids].filter((v, i, a) => a.indexOf(v) === i);
  function matchesForIdentity(group, ident) {
    const inAge = new Set(groupProgramIds(group));
    return ident.programs.filter((id) => inAge.has(id));
  }

  function filteredBlock(ident, group, ids) {
    const t = ident.title.split(" ");
    const glabel = t.slice(0, -1).join(" ") + ` <span class="o">${t[t.length - 1]}</span>`;
    const cards = programCard(ids[0], { hero: true, flag: true }) + ids.slice(1).map((id) => programCard(id, {})).join("");
    return `
      <div class="group-block">
        <div class="group-head reveal">
          <span class="gtag">${ident.tag}</span>
          <span class="glabel">${glabel}</span>
          <span class="group-rule"></span>
          <span class="group-count">${ids.length} program${ids.length > 1 ? "s" : ""} &middot; ${group.label}</span>
        </div>
        <div class="card-grid has-hero">${cards}</div>${swipeHint(ids.length)}
      </div>`;
  }

  function emptyBlock(ident, group) {
    return `
      <div class="finder-empty reveal">
        <p>No <strong>${ident.title}</strong> programs for <strong>${group.label}</strong> just yet.</p>
        <button class="finder-empty-btn" type="button" data-clear-identity>View all ${group.label} programs <span class="arr">&rarr;</span></button>
      </div>`;
  }

  function updateHint() {
    if (!hintEl) return;
    const g = activeGroup;
    if (activeIdentity) {
      const ident = identityById(activeIdentity);
      const n = matchesForIdentity(g, ident).length;
      hintEl.textContent = n
        ? `Showing ${n} ${ident.title} program${n > 1 ? "s" : ""} for ${g.label}.`
        : `No ${ident.title} programs for ${g.label} yet.`;
      return;
    }
    const sup = g.supplemental;
    const hintMap = {
      elite: "Featured programs plus elite supplemental training for " + g.label + ".",
      additional: "Featured programs plus additional training options for " + g.label + ".",
      next: "Programs for " + g.label + " — plus the pathway waiting ahead.",
    };
    hintEl.textContent = hintMap[sup.kind] || "Programs for " + g.label + ".";
  }

  function renderResults() {
    let html;
    if (activeIdentity) {
      const ident = identityById(activeIdentity);
      const ids = matchesForIdentity(activeGroup, ident);
      html = ids.length ? filteredBlock(ident, activeGroup, ids) : emptyBlock(ident, activeGroup);
    } else {
      const featured = groupBlock("Featured Programs", "For You", activeGroup.featured, "Featured", { hero: true });
      const sup = activeGroup.supplemental;
      const accentMap = { elite: "Elite", additional: "Additional", next: "Next" };
      const supplemental = groupBlock(sup.title, sup.tag, sup.ids, accentMap[sup.kind] || "");
      html = featured + supplemental;
    }
    resultsEl.style.opacity = "0";
    resultsEl.style.transform = "translateY(12px)";
    setTimeout(() => {
      resultsEl.innerHTML = html;
      resultsEl.style.opacity = "1";
      resultsEl.style.transform = "none";
      observeReveals(resultsEl);
    }, 160);
    updateHint();
  }

  /* ---- Player-identity cards (independent filter, refines the age group) ---- */
  function buildIdentityCards() {
    identityCardsEl.innerHTML = IDENTITIES.map((idn) => `
      <div class="ident-card" data-id="${idn.id}" role="button" tabindex="0" aria-pressed="false" aria-label="Filter programs by ${idn.title}">
        <img class="ident-img" src="${idn.image}" alt="${idn.title}" loading="lazy" />
        <div class="ident-scrim"></div>
        <div class="ident-glow"></div>
        <span class="ident-dot"></span>
        <div class="ident-body">
          <h4 class="ident-title">${idn.title}</h4>
          <div class="ident-extra">
            <p class="ident-desc">${idn.desc}</p>
          </div>
        </div>
      </div>`).join("");

    Array.from(identityCardsEl.querySelectorAll(".ident-card")).forEach((card) => {
      const id = card.dataset.id;
      card.addEventListener("click", () => toggleIdentity(id));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleIdentity(id); }
      });
    });
  }

  function toggleIdentity(id) {
    const card = identityCardsEl.querySelector(`.ident-card[data-id="${id}"]`);
    if (card && card.classList.contains("is-disabled")) return;
    activeIdentity = activeIdentity === id ? null : id;
    syncIdentityUI();
    renderResults();
  }

  function clearIdentity() {
    if (!activeIdentity) return;
    activeIdentity = null;
    syncIdentityUI();
    renderResults();
  }

  function syncIdentityUI() {
    const inAge = new Set(groupProgramIds(activeGroup));
    IDENTITIES.forEach((idn) => {
      const card = identityCardsEl.querySelector(`.ident-card[data-id="${idn.id}"]`);
      if (!card) return;
      const disabled = idn.programs.filter((p) => inAge.has(p)).length === 0;
      card.classList.toggle("is-disabled", disabled);
      card.classList.toggle("is-selected", activeIdentity === idn.id);
      card.setAttribute("aria-pressed", activeIdentity === idn.id ? "true" : "false");
      if (disabled) card.setAttribute("aria-disabled", "true");
      else card.removeAttribute("aria-disabled");
    });
    if (identityClearEl) identityClearEl.hidden = !activeIdentity;
  }

  /* ---- Segmented pill tab bar with sliding indicator ---- */
  function moveIndicator(btn) {
    const ind = tabsEl.querySelector(".age-ind");
    if (!ind || !btn) return;
    ind.style.width = btn.offsetWidth + "px";
    ind.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  function buildTabs() {
    const ind = document.createElement("span");
    ind.className = "age-ind";
    tabsEl.appendChild(ind);
    AGE_GROUPS.forEach((g, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "age-tab" + (i === 0 ? " active" : "");
      b.innerHTML = `<span class="t-label">${g.label}</span>`;
      b.addEventListener("click", () => {
        tabsEl.querySelectorAll(".age-tab").forEach((t) => t.classList.remove("active"));
        b.classList.add("active");
        moveIndicator(b);
        activeGroup = g;
        // Drop the identity filter if it has no programs in the new age group.
        if (activeIdentity) {
          const ident = identityById(activeIdentity);
          if (matchesForIdentity(activeGroup, ident).length === 0) activeIdentity = null;
        }
        syncIdentityUI();
        renderResults();
      });
      tabsEl.appendChild(b);
    });
    requestAnimationFrame(() => moveIndicator(tabsEl.querySelector(".age-tab.active")));
  }

  /* The catalog loads asynchronously from content/programs.json — wait for
     it before building the finder, so AGE_GROUPS / IDENTITIES are ready. */
  window.CATALOG_READY.then(() => {
    if (!window.AGE_GROUPS || !window.AGE_GROUPS.length) return;
    activeGroup = AGE_GROUPS[0];
    buildTabs();
    buildIdentityCards();
    syncIdentityUI();
    renderResults();
    resultsEl.style.transition = "opacity .4s var(--ease), transform .4s var(--ease)";
    if (identityClearEl) identityClearEl.addEventListener("click", clearIdentity);
    let wasMobileCards = isMobileCards();
    window.addEventListener("resize", () => {
      moveIndicator(tabsEl.querySelector(".age-tab.active"));
      const m = isMobileCards();
      if (m !== wasMobileCards) { wasMobileCards = m; renderResults(); }
    });
    window.addEventListener("load", () => moveIndicator(tabsEl.querySelector(".age-tab.active")));
    requestAnimationFrame(() => moveIndicator(tabsEl.querySelector(".age-tab.active")));
  });

  /* ============================================================
     PROGRAM DETAIL LIGHTBOX
     ============================================================ */
  const modal = document.getElementById("programModal");
  const pmBanner = document.getElementById("pmBanner");
  const pmCat = document.getElementById("pmCat");
  const pmTitle = document.getElementById("pmTitle");
  const pmFacts = document.getElementById("pmFacts");
  const pmContent = document.getElementById("pmContent");
  const pmRegister = document.getElementById("pmRegister");
  const pmDialog = modal.querySelector(".pmodal-dialog");
  let lastFocus = null;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Build a sensible facts list for programs without authored details
  function fallbackFacts(p) {
    const facts = [{ label: "Age Groups", value: p.age }];
    p.meta.forEach((m) => {
      let label = "Details";
      if (/per week|x\s*\/|1x|2x|3x/i.test(m)) label = "Frequency";
      else if (/\d+\s*-?\s*week/i.test(m)) label = "Duration";
      else if (/night|sat|sun|mon|tue|wed|thu|fri|&/i.test(m)) label = "Schedule";
      else if (/\d/.test(m) && /(am|pm|–|-|:)/i.test(m)) label = "Time";
      facts.push({ label, value: m });
    });
    return facts;
  }

  /* Render a markdown detail body (headings, bullet lists, paragraphs).
     The first paragraph is treated as the lead. Kept deliberately small —
     it covers what the CMS body field produces. */
  function renderMarkdown(md) {
    const blocks = String(md || "")
      .replace(/\r\n/g, "\n")
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
    let leadUsed = false;
    let out = "";
    blocks.forEach((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length && lines.every((l) => /^[-*]\s+/.test(l));
      if (isList) {
        out += `<ul class="pm-list">${lines
          .map((l) => `<li>${esc(l.replace(/^[-*]\s+/, ""))}</li>`)
          .join("")}</ul>`;
        return;
      }
      if (lines.length === 1 && /^#{1,6}\s+/.test(lines[0])) {
        out += `<h4 class="pm-h">${esc(lines[0].replace(/^#{1,6}\s+/, ""))}</h4>`;
        return;
      }
      const text = lines.join(" ");
      if (!leadUsed) { leadUsed = true; out += `<p class="pm-lead">${esc(text)}</p>`; }
      else out += `<p>${esc(text)}</p>`;
    });
    return out;
  }

  function openProgram(id) {
    const p = PROGRAMS[id];
    if (!p) return;
    const d = p.details || {};
    const facts = (d.facts && d.facts.length) ? d.facts : fallbackFacts(p);
    const bodyHTML = d.body ? renderMarkdown(d.body) : `<p class="pm-lead">${esc(p.desc)}</p>`;

    pmBanner.innerHTML = p.banner
      ? `<img class="pm-banner-img" src="${esc(p.banner)}" alt="${esc(d.title || p.title)}" />`
      : `<image-slot id="pm-banner-${id}" fit="cover" src="assets/facility-banner.png" placeholder="${esc(d.bannerPlaceholder || "Drop a banner photo for this program")}"></image-slot>`;
    pmCat.textContent = d.kicker || p.cat;
    pmTitle.textContent = d.title || p.title;
    pmFacts.innerHTML = facts
      .map((f) => `<div class="pm-fact"><span class="pm-fact-l">${esc(f.label)}</span><span class="pm-fact-v">${esc(f.value)}</span></div>`)
      .join("");
    pmContent.innerHTML =
      bodyHTML +
      (d.tagline ? `<p class="pm-tagline">${esc(d.tagline)}</p>` : "");

    /* Registration status drives the footer button + note. */
    const sm = (window.STATUS_META || {})[p.status || "open"] || (window.STATUS_META || {}).open || { cta: "Register", note: "" };
    pmRegister.innerHTML = `${esc(sm.cta)} <span class="arr">&rarr;</span>`;
    pmRegister.href = REGISTER_URL;
    const footNote = modal.querySelector(".pm-foot-note");
    if (footNote && sm.note) footNote.textContent = sm.note;

    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    pmDialog.scrollTop = 0;
    modal.querySelector(".pmodal-close").focus({ preventScroll: true });
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Open on card click (ignore the Register quick-action)
  resultsEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-clear-identity]")) { clearIdentity(); return; }
    if (e.target.closest(".reg")) return;
    const card = e.target.closest(".pcard");
    if (card && card.dataset.id) openProgram(card.dataset.id);
  });
  // Keyboard: Enter / Space on a focused card
  resultsEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".pcard");
    if (card && card.dataset.id) { e.preventDefault(); openProgram(card.dataset.id); }
  });

  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  /* ============================================================
     CONTACT LIGHTBOX
     ============================================================ */
  const cModal = document.getElementById("contactModal");
  if (cModal) {
    const cForm = document.getElementById("contactForm");
    const cSuccess = document.getElementById("contactSuccess");
    let cLastFocus = null;

    const openContact = () => {
      cLastFocus = document.activeElement;
      cForm.hidden = false;
      cSuccess.hidden = true;
      cModal.classList.add("open");
      cModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const first = cForm.querySelector("input");
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    };
    const closeContact = () => {
      cModal.classList.remove("open");
      cModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (cLastFocus && cLastFocus.focus) cLastFocus.focus({ preventScroll: true });
    };

    // Any [data-contact] trigger opens the lightbox
    document.querySelectorAll("[data-contact]").forEach((t) =>
      t.addEventListener("click", (e) => { e.preventDefault(); openContact(); }));

    cModal.querySelectorAll("[data-cclose]").forEach((el) =>
      el.addEventListener("click", closeContact));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && cModal.classList.contains("open")) closeContact();
    });

    cForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!cForm.reportValidity()) return;
      cForm.hidden = true;
      cSuccess.hidden = false;
    });
  }

  /* ============================================================
     OUR APPROACH — overlap (coverflow) reel carousel, 3 reels
     Center reel is front & full-size; prev/next peek behind, tilted.
     No auto-scroll. Arrows / dots / swipe / click-a-side navigate.
     Each slide is a drop target (or save assets/reel-N.mp4).
     ============================================================ */
  const carousel = document.getElementById("reelCarousel");
  if (carousel) {
    const flow = carousel.querySelector(".reel-coverflow");
    const slides = Array.from(carousel.querySelectorAll(".reel-slide"));
    const dotsWrap = carousel.querySelector(".reel-dots");
    const curEl = carousel.querySelector(".reel-count .cur");
    const totEl = carousel.querySelector(".reel-count .tot");
    const total = slides.length;
    let idx = 0, dragging = false, startX = 0, deltaX = 0;
    let soundOn = false; // start muted; user can unmute

    totEl.textContent = String(total).padStart(2, "0");

    // dots
    slides.forEach((s, i) => {
      const d = document.createElement("button");
      d.className = "reel-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Reel " + (i + 1));
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    // transform per relative position (-1 left, 0 center, +1 right)
    const POSE = {
      "0":  { t: "translate(-50%,-50%) scale(1) rotateY(0deg)",                 z: 3, o: 1,   f: "none" },
      "-1": { t: "translate(-50%,-50%) translateX(-42%) scale(.76) rotateY(24deg)",  z: 2, o: .8, f: "brightness(.6)" },
      "1":  { t: "translate(-50%,-50%) translateX(42%) scale(.76) rotateY(-24deg)",  z: 2, o: .8, f: "brightness(.6)" },
    };

    // pause every reel + reset their play overlays (no autoplay)
    function pauseAll() {
      slides.forEach((s) => {
        const v = s.querySelector("video");
        if (v && !v.paused) v.pause();
        s.classList.remove("is-playing");
      });
    }
    function layout() {
      slides.forEach((s, i) => {
        const rel = ((i - idx + 1 + total) % total) - 1; // -1, 0, 1 for 3 slides
        const p = POSE[String(rel)] || POSE["1"];
        s.style.transform = p.t;
        s.style.zIndex = p.z;
        s.style.opacity = p.o;
        s.style.filter = p.f;
        s.classList.toggle("is-center", rel === 0);
        s.setAttribute("aria-hidden", rel === 0 ? "false" : "true");
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
      curEl.textContent = String(idx + 1).padStart(2, "0");
    }
    function go(n) { pauseAll(); idx = (n + total) % total; layout(); }

    // sound toggle (applies to all reels; only the centered one plays)
    function applySound() {
      carousel.classList.toggle("sound-on", soundOn);
      slides.forEach((s) => { const v = s.querySelector("video"); if (v) v.muted = !soundOn; });
    }
    carousel.querySelectorAll(".reel-mute").forEach((btn) =>
      btn.addEventListener("click", (e) => { e.stopPropagation(); soundOn = !soundOn; applySound(); }));

    carousel.querySelector(".reel-nav.prev").addEventListener("click", () => go(idx - 1));
    carousel.querySelector(".reel-nav.next").addEventListener("click", () => go(idx + 1));

    // per-slide video / drop wiring + click-to-focus on side reels
    slides.forEach((slide, i) => {
      const video = slide.querySelector("video");
      const drop = slide.querySelector(".reel-drop");
      const input = slide.querySelector('input[type="file"]');
      const playBtn = slide.querySelector(".reel-play");

      const show = (src) => {
        video.src = src;
        video.muted = !soundOn;
        video.style.display = "block";
        drop.classList.add("hide");
        slide.classList.add("has-video");
        // no autoplay — wait for the play button / video click
      };
      fetch("assets/reel-" + (i + 1) + ".mp4", { method: "HEAD" })
        .then((r) => { if (r.ok) show("assets/reel-" + (i + 1) + ".mp4"); })
        .catch(() => {});
      const use = (f) => { if (f && f.type.startsWith("video/")) show(URL.createObjectURL(f)); };

      // reflect real play/pause state on the slide (drives the overlay)
      video.addEventListener("play", () => slide.classList.add("is-playing"));
      video.addEventListener("pause", () => slide.classList.remove("is-playing"));

      const togglePlay = () => {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      };
      if (playBtn) playBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });

      // clicking a side reel focuses it; on the center reel the drop opens the
      // file picker (empty) or toggles play (loaded)
      drop.addEventListener("click", (e) => {
        if (!slide.classList.contains("is-center")) { e.stopPropagation(); go(i); return; }
        input.click();
      });
      slide.addEventListener("click", (e) => {
        if (e.target.closest(".reel-mute") || e.target.closest(".reel-play")) return;
        if (!slide.classList.contains("is-center")) { go(i); return; }
        if (slide.classList.contains("has-video")) togglePlay();
      });
      input.addEventListener("change", (e) => use(e.target.files[0]));
      ["dragenter", "dragover"].forEach((ev) =>
        drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("dragover"); }));
      ["dragleave", "drop"].forEach((ev) =>
        drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("dragover"); }));
      drop.addEventListener("drop", (e) => use(e.dataTransfer.files[0]));
    });

    // pointer swipe
    flow.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".reel-nav")) return;
      dragging = true; startX = e.clientX; deltaX = 0;
    });
    window.addEventListener("pointermove", (e) => { if (dragging) deltaX = e.clientX - startX; });
    window.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(deltaX) > 50) go(idx + (deltaX < 0 ? 1 : -1));
    });

    applySound();
    layout();
  }

  /* ---------- Subtle hero parallax ---------- */
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg && !document.body.classList.contains("nomotion")) {
    window.addEventListener("scroll", () => {
      const y = Math.min(window.scrollY, 900);
      heroBg.style.transform = `translateY(${y * 0.18}px) scale(1.06)`;
    }, { passive: true });
  }
})();
