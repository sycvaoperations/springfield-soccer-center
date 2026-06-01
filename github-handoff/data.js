/* ============================================================
   Springfield Soccer Center — PROGRAM CATALOG LOADER
   ============================================================
   Programs now live in content/programs.json so a non-technical
   admin can manage them through a Git-based CMS (Pages CMS /
   Sveltia) without touching code. This file loads that JSON,
   drops anything hidden, sorts by display order, and assembles
   the catalog the site renders from.

   Each program record in programs.json supports these
   admin-editable fields:
     title     program name
     cat       category label (drives the accent color + icon)
     age       age range shown on the card
     banner    photo path
     desc      short card description
     status    "open" | "waitlist" | "coming-soon"
                 → status badge on the card + Register/Join Waitlist
                   /Notify Me button behavior
     visible   true / false  → hide a program without deleting it
     featured  true / false  → leads the "For You" row in the All tab
     order     number        → display order (low = first)
     details   (optional) rich lightbox content — tagline, facts, and a
                 markdown body. Editable in the CMS; programs without it
                 fall back to an auto-generated detail view.
   ============================================================ */

/* ---- Registration status → badge + register-button behavior ---- */
window.STATUS_META = {
  "open": {
    badge: null,
    cta: "Register",
    note: "Spots are limited — secure your place for the season.",
  },
  "waitlist": {
    badge: "Waitlist",
    cta: "Join Waitlist",
    note: "This program is currently full — join the waitlist and we'll reach out as spots open up.",
  },
  "coming-soon": {
    badge: "Coming Soon",
    cta: "Notify Me",
    note: "Registration isn't open yet — leave your details and we'll let you know the moment it is.",
  },
};

/* ---- Age-group merchandising config -------------------------------
   These map which programs surface under each age tab. They reference
   program ids; hidden or deleted programs are filtered out
   automatically when the catalog loads. The "all" tab is assembled
   dynamically from the full catalog (featured programs first), so a
   newly added program appears there with no config change. */
const AGE_GROUPS_CONFIG = [
  {
    id: "all", label: "All Programs", sub: "Every Program", dynamic: true,
    supplemental: { kind: "additional", title: "More Programs", tag: "Also Available" },
  },
  {
    id: "u3-u4", label: "U3–U4", sub: "First Touches",
    featured: ["little-boots"],
    supplemental: { kind: "next", title: "What Comes Next", tag: "The Pathway", ids: ["pre-travel"] },
  },
  {
    id: "u5-u6", label: "U5–U6", sub: "Foundations",
    featured: ["pre-travel", "summer-camps", "futsal"],
    supplemental: { kind: "additional", title: "Additional Training", tag: "Also Available", ids: ["omid"] },
  },
  {
    id: "u7-u12", label: "U7–U12", sub: "Development",
    featured: ["summer-camps", "footskills", "omid", "futsal"],
    supplemental: { kind: "elite", title: "Elite Supplemental Training", tag: "Advanced", ids: ["gk-brian", "scoring", "attacking-1v1", "first-touch"] },
  },
  {
    id: "u13-u19", label: "U13–U19", sub: "Elite",
    featured: ["summer-camps", "omid"],
    supplemental: { kind: "elite", title: "Elite Supplemental Training", tag: "Advanced", ids: ["footskills", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"] },
  },
];

/* ---- Player-identity config (independent filter, refines age) ---- */
const IDENTITIES_CONFIG = [
  {
    id: "getting-started", title: "Just Getting Started", tag: "Intro Soccer", range: "U3–U6",
    desc: "First touches, first games. Building coordination, confidence, and a love of the ball.",
    image: "assets/identity/getting-started.png",
    programs: ["little-boots", "summer-camps"],
  },
  {
    id: "developing", title: "Developing Player", tag: "Development", range: "U5–U12",
    desc: "Building the technical foundation and habits to step up into competitive play.",
    image: "assets/identity/developing.png",
    programs: ["summer-camps", "pre-travel", "omid", "footskills", "futsal", "first-touch"],
  },
  {
    id: "competitive", title: "Competitive Player", tag: "Travel Ready", range: "U7–U19",
    desc: "Sharpening the technical, tactical, and physical tools that win games at the travel level.",
    image: "assets/identity/competitive.png",
    programs: ["summer-camps", "pre-travel", "omid", "footskills", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"],
  },
  {
    id: "specialized", title: "Specialized Training", tag: "Position & Skill", range: "U7–U19",
    desc: "Position-specific and skill-specific clinics for players chasing the next level.",
    image: "assets/identity/specialized.png",
    programs: ["omid", "footskills", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"],
  },
];

/* ---- Load the catalog, then assemble the globals app.js reads ---- */
window.CATALOG_READY = fetch("content/programs.json", { cache: "no-store" })
  .then((r) => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then((json) => {
    const all = Array.isArray(json && json.programs) ? json.programs : [];
    const visible = all
      .filter((p) => p && p.id && p.visible !== false)
      .sort((a, b) => (a.order != null ? a.order : 999) - (b.order != null ? b.order : 999));

    const PROGRAMS = {};
    visible.forEach((p) => { PROGRAMS[p.id] = p; });
    window.PROGRAMS = PROGRAMS;

    const exists = (id) => Object.prototype.hasOwnProperty.call(PROGRAMS, id);

    /* Build age groups, filtering ids down to visible programs. */
    window.AGE_GROUPS = AGE_GROUPS_CONFIG
      .map((g) => {
        if (g.dynamic) {
          const featured = visible.filter((p) => p.featured).map((p) => p.id);
          const rest = visible.filter((p) => !p.featured).map((p) => p.id);
          return { ...g, featured, supplemental: { ...g.supplemental, ids: rest } };
        }
        return {
          ...g,
          featured: (g.featured || []).filter(exists),
          supplemental: { ...g.supplemental, ids: (g.supplemental.ids || []).filter(exists) },
        };
      })
      .filter((g) => (g.featured && g.featured.length) || (g.supplemental.ids && g.supplemental.ids.length));

    /* Build identities, filtering their program lists down to visible. */
    window.IDENTITIES = IDENTITIES_CONFIG
      .map((idn) => ({ ...idn, programs: idn.programs.filter(exists) }))
      .filter((idn) => idn.programs.length);
  })
  .catch((err) => {
    console.error("Could not load program catalog (content/programs.json):", err);
    window.PROGRAMS = {};
    window.AGE_GROUPS = [];
    window.IDENTITIES = [];
  });
