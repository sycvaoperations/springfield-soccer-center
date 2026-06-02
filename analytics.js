/* ============================================================
   Springfield Soccer Center — Analytics instrumentation
   ============================================================
   Pushes a fixed, schema-driven set of GA4 events to the GTM
   dataLayer via event delegation on the real UI. No edits to
   app.js are required — this layer observes the same DOM.

   The event names + parameter keys here are the CONTRACT that the
   GTM container is built against. Do not rename without updating
   GTM in lockstep. All events are lowercase snake_case.

   Events:
     click_explore_programs      { click_location }
     select_age_group            { age_group }
     select_player_identity      { player_identity }
     view_program_card           { program_id, program_name, program_category,
                                   program_status, age_group, player_identity, click_location }
     open_program_lightbox       { program_id, program_name, program_category,
                                   program_status, age_group, player_identity }   ★ key event
     click_register_now          { program_id, program_name, program_category,
                                   program_status, destination_url, click_location } ★★ primary
     click_check_availability    { click_location, inquiry_type }
     start_rental_inquiry        { form_name, inquiry_type, click_location }
     submit_rental_inquiry       { inquiry_type, form_name, topic, page_path }
     submit_contact_form         { form_name, topic, player_age }
     click_email                 { link_url, link_text, click_location }
     click_phone                 { link_url, click_location }
     video_visible_facility_section   { reel_index }
     video_play_facility_section      { reel_index }
     video_pause_facility_section     { reel_index }
     video_progress_facility_section  { reel_index, percent }   // 25 | 50 | 75
     video_complete_facility_section  { reel_index, percent }   // 100

   Also pushed by app.js (program lightbox email capture, same contract):
     submit_notify_request       { request_type, program_id, program_name,
                                   program_category, program_status }   ★ key event
   ============================================================ */
(function () {
  "use strict";

  /* GTM/GA4 dataLayer. GTM's own snippet also creates this; we guard so the
     events queue safely even if GTM hasn't loaded (or isn't configured) yet. */
  window.dataLayer = window.dataLayer || [];
  function push(event, params) {
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
  }

  /* ---- Finder context: remember the player's current age + identity so every
     program-level event is attributable to where they were in the funnel. ---- */
  var ctx = { age_group: undefined, player_identity: undefined };

  /* Look up a program's marketing attributes from the loaded catalog. */
  function programParams(id) {
    var p = (window.PROGRAMS && window.PROGRAMS[id]) || {};
    return {
      program_id: id,
      program_name: p.title || id,
      program_category: p.cat || undefined,
      program_status: p.status || "open",
    };
  }
  function withCtx(obj) {
    obj.age_group = ctx.age_group;
    obj.player_identity = ctx.player_identity;
    return obj;
  }

  /* Section helper: which logical area a click happened in. */
  function locationOf(el) {
    if (el.closest("#rentals")) return "rentals_section";
    if (el.closest(".final")) return "final_cta";
    if (el.closest(".hero")) return "hero";
    if (el.closest(".nav")) return "nav";
    if (el.closest(".footer")) return "footer";
    if (el.closest(".pmodal")) return "program_lightbox";
    if (el.closest(".cmodal")) return "contact_modal";
    return "page";
  }

  /* The id of the program whose lightbox is currently open (for register attribution). */
  var openProgramId = null;

  /* =====================================================================
     1. DELEGATED CLICKS
     ===================================================================== */
  document.addEventListener("click", function (e) {
    var t = e.target;

    /* --- Email / phone leads (check first; they're <a> links) --- */
    var mail = t.closest && t.closest('a[href^="mailto:"]');
    if (mail) {
      push("click_email", {
        link_url: mail.getAttribute("href").replace(/^mailto:/, ""),
        link_text: (mail.textContent || "").trim(),
        click_location: locationOf(mail),
      });
      return;
    }
    var tel = t.closest && t.closest('a[href^="tel:"]');
    if (tel) {
      push("click_phone", {
        link_url: tel.getAttribute("href").replace(/^tel:/, ""),
        click_location: locationOf(tel),
      });
      return;
    }

    /* --- Register Now (program lightbox) — PRIMARY conversion --- */
    var reg = t.closest && t.closest("#pmRegister");
    if (reg) {
      push("click_register_now", Object.assign(
        programParams(openProgramId),
        { destination_url: reg.href || reg.getAttribute("href") || "", click_location: "program_lightbox" }
      ));
      return;
    }

    /* --- Explore Programs CTAs (anchor to #programs) --- */
    var explore = t.closest && t.closest('a[href="#programs"]');
    if (explore && explore.classList.contains("btn")) {
      push("click_explore_programs", { click_location: locationOf(explore) });
      /* fall through: anchor still scrolls */
    }

    /* --- Rental "Check Availability" (a [data-contact] inside #rentals) --- */
    var rentalBtn = t.closest && t.closest("#rentals [data-contact]");
    if (rentalBtn) {
      push("click_check_availability", { click_location: "rentals_section", inquiry_type: "facility_rental" });
      push("start_rental_inquiry", { form_name: "contact", inquiry_type: "facility_rental", click_location: "rentals_section" });
      return;
    }

    /* --- Age tab --- */
    var ageTab = t.closest && t.closest("#ageTabs .age-tab");
    if (ageTab) {
      var label = (ageTab.querySelector(".t-label") || ageTab).textContent.trim();
      ctx.age_group = label;
      push("select_age_group", { age_group: label });
      return;
    }

    /* --- Player-identity card --- */
    var ident = t.closest && t.closest("#identityCards .ident-card");
    if (ident && !ident.classList.contains("is-disabled")) {
      var idn = (window.IDENTITIES || []).find(function (x) { return x.id === ident.dataset.id; });
      var title = idn ? idn.title : ident.dataset.id;
      /* app.js toggles selection; mirror that so we only report the active one. */
      var willSelect = !ident.classList.contains("is-selected");
      ctx.player_identity = willSelect ? title : undefined;
      if (willSelect) push("select_player_identity", { player_identity: title });
      return;
    }

    /* --- Program card → opens the detail lightbox --- */
    var card = t.closest && t.closest("#finderResults .pcard[data-id]");
    if (card && !t.closest(".reg")) {
      openProgramId = card.dataset.id;
      push("open_program_lightbox", withCtx(programParams(openProgramId)));
      return;
    }
  }, true); /* capture phase so we run before app.js stops propagation */

  /* =====================================================================
     2. CONTACT / RENTAL FORM SUBMISSION
     ===================================================================== */
  var cForm = document.getElementById("contactForm");
  if (cForm) {
    cForm.addEventListener("submit", function () {
      /* Only count valid submissions (app.js blocks invalid ones via reportValidity). */
      if (cForm.checkValidity && !cForm.checkValidity()) return;
      var topic = (cForm.querySelector('[name="topic"]') || {}).value || "";
      var playerAge = (cForm.querySelector('[name="age"]') || {}).value || "";
      push("submit_contact_form", { form_name: "contact", topic: topic, player_age: playerAge });
      if (/rental/i.test(topic)) {
        push("submit_rental_inquiry", {
          inquiry_type: "facility_rental", form_name: "contact",
          topic: topic, page_path: location.pathname,
        });
      }
    });
  }

  /* =====================================================================
     3. PROGRAM-CARD IMPRESSIONS (view_program_card, deduped per render)
     ===================================================================== */
  var resultsEl = document.getElementById("finderResults");
  if (resultsEl && "IntersectionObserver" in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var card = en.target;
        if (seen.has(card)) { io.unobserve(card); return; }
        seen.add(card);
        io.unobserve(card);
        var id = card.dataset.id;
        if (!id) return;
        push("view_program_card", withCtx(Object.assign(programParams(id), { click_location: "program_finder" })));
      });
    }, { threshold: 0.5 });

    var observeCards = function () {
      resultsEl.querySelectorAll(".pcard[data-id]").forEach(function (c) {
        if (!seen.has(c)) io.observe(c);
      });
    };
    /* Cards are re-rendered whenever the age/identity filter changes. */
    new MutationObserver(observeCards).observe(resultsEl, { childList: true, subtree: true });
    observeCards();
  }

  /* =====================================================================
     4. FACILITY VIDEO ENGAGEMENT (the reel carousel)
     ===================================================================== */
  var carousel = document.getElementById("reelCarousel");
  if (carousel) {
    var videos = Array.prototype.slice.call(carousel.querySelectorAll("video"));
    videos.forEach(function (v, i) {
      var reel = i + 1;
      var milestones = { 25: false, 50: false, 75: false };

      v.addEventListener("play", function () { push("video_play_facility_section", { reel_index: reel }); });
      v.addEventListener("pause", function () {
        /* 'ended' also fires pause; let the ended handler own completion. */
        if (!v.ended) push("video_pause_facility_section", { reel_index: reel });
      });
      v.addEventListener("ended", function () {
        push("video_complete_facility_section", { reel_index: reel, percent: 100 });
        milestones = { 25: false, 50: false, 75: false }; /* reset for loop replays */
      });
      v.addEventListener("timeupdate", function () {
        if (!v.duration || isNaN(v.duration)) return;
        var pct = (v.currentTime / v.duration) * 100;
        [25, 50, 75].forEach(function (m) {
          if (!milestones[m] && pct >= m) {
            milestones[m] = true;
            push("video_progress_facility_section", { reel_index: reel, percent: m });
          }
        });
      });

      /* Visible-in-viewport (fires once per reel). */
      if ("IntersectionObserver" in window) {
        var vio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              push("video_visible_facility_section", { reel_index: reel });
              vio.unobserve(en.target);
            }
          });
        }, { threshold: 0.6 });
        vio.observe(v);
      }
    });
  }

  /* =====================================================================
     5. SEED INITIAL FINDER CONTEXT once the catalog + tabs are ready
     ===================================================================== */
  if (window.CATALOG_READY && window.CATALOG_READY.then) {
    window.CATALOG_READY.then(function () {
      if (window.AGE_GROUPS && window.AGE_GROUPS[0]) ctx.age_group = window.AGE_GROUPS[0].label;
    });
  }
})();
