#!/usr/bin/env node
/**
 * scripts/generate-programs-seo.js
 *
 * Reads content/programs.json ({ "programs": [...] }) and injects a visible,
 * crawlable HTML section into index.html between:
 *   <!-- PROGRAMS_SEO_START -->  ...  <!-- PROGRAMS_SEO_END -->
 *
 * If markers don't exist the section is appended just before </body>.
 *
 * Run:   node scripts/generate-programs-seo.js
 * CI:    .github/workflows/build-programs.yml  (after JSON bundle step)
 *
 * Real field names (programs.json):
 *   id, title, cat, age, desc, status, visible, order
 *   details.facts[].{label,value}, details.body (markdown)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.join(__dirname, '..');
const PROGRAMS_SRC = path.join(ROOT, 'content', 'programs.json');
const INDEX_HTML   = path.join(ROOT, 'index.html');
const SITE_URL     = 'https://www.springfieldsoccercenter.com';
const ORG_NAME     = 'Springfield Soccer Center';
const ADDRESS = {
  street:  '8704 Morrissette Dr',
  city:    'Springfield',
  state:   'VA',
  zip:     '22152',
  country: 'US',
};
const PHONE = '+1-703-339-3796';

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 1. Load & validate programs
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
if (!fs.existsSync(PROGRAMS_SRC)) {
  console.error(`ERROR: ${PROGRAMS_SRC} not found. Run the programs-build step first.`);
  process.exit(1);
}

const raw      = fs.readFileSync(PROGRAMS_SRC, 'utf8').replace(/\0/g, '').trim();
const parsed   = JSON.parse(raw);
const all      = Array.isArray(parsed) ? parsed : (parsed.programs || []);

// Filter out hidden programs, sort by order ascending
const programs = all
  .filter(p => p.visible !== false)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

if (programs.length === 0) {
  console.warn('WARNING: No visible programs found â no SEO section generated.');
  process.exit(0);
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 2. Helpers
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// Strip common markdown so it reads cleanly as plain text
function stripMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^#{1,6}\s+/gm, '')   // headings
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
}

const STATUS_LABELS = {
  'open':         'Enrolling Now',
  'waitlist':     'Waitlist Open',
  'coming-soon':  'Coming Soon',
};

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 3. Build JSON-LD Course schema per program
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function buildSchema(p, desc) {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'Course',
    name:       p.title,
    description: desc || `${p.title} at ${ORG_NAME} in Springfield, VA.`,
    url:        `${SITE_URL}/#programs`,
    provider: {
      '@type': 'SportsOrganization',
      name:    ORG_NAME,
      url:     SITE_URL,
      telephone: PHONE,
      address: {
        '@type':         'PostalAddress',
        streetAddress:   ADDRESS.street,
        addressLocality: ADDRESS.city,
        addressRegion:   ADDRESS.state,
        postalCode:      ADDRESS.zip,
        addressCountry:  ADDRESS.country,
      },
    },
    courseMode:       'onsite',
    educationalLevel: p.age || '',
    inLanguage:       'en',
    keywords: [
      'soccer',
      p.cat || '',
      p.age ? `ages ${p.age}` : '',
      'Springfield VA',
      'Northern Virginia',
      'youth soccer',
    ].filter(Boolean).join(', '),
  };

  // Pull schedule from details.facts if present
  const scheduleFact = (p.details && p.details.facts || [])
    .find(f => /schedule|day|time/i.test(f.label));
  if (scheduleFact) {
    schema.courseSchedule = { '@type': 'Schedule', description: scheduleFact.value };
  }

  return JSON.stringify(schema, null, 2);
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 4. Build one <article> per program
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function buildProgramArticle(p) {
  // Prefer short desc; fall back to stripped details.body
  const desc = p.desc || stripMarkdown(p.details && p.details.body) || '';
  const statusLabel = STATUS_LABELS[p.status] || p.status || '';

  return `
  <article class="ssc-program-index-item" data-program-id="${esc(p.id)}" data-status="${esc(p.status)}">
    <script type="application/ld+json">
${buildSchema(p, desc)}
    </script>
    <h3>${esc(p.title)}</h3>
    <p class="ssc-program-meta">\
${p.cat ? `<span class="ssc-program-category">${esc(p.cat)}</span>` : ''}\
${p.age ? ` &middot; <span class="ssc-program-age">Ages ${esc(p.age)}</span>` : ''}\
 &middot; <span class="ssc-program-status">${esc(statusLabel)}</span></p>${desc ? `
    <p class="ssc-program-description">${esc(desc)}</p>` : ''}
  </article>`;
}

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 5. Assemble the full section
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const START_MARKER = '<!-- PROGRAMS_SEO_START -->';
const END_MARKER   = '<!-- PROGRAMS_SEO_END -->';

const articlesHtml = programs.map(buildProgramArticle).join('\n');

const seoSection = `${START_MARKER}
<!--
  AUTO-GENERATED by scripts/generate-programs-seo.js â DO NOT EDIT MANUALLY.
  Source: content/programs.json | Rebuilt on every push to main.
  Anti-cloaking: this section contains the SAME titles and descriptions
  shown in the interactive program cards. It is hidden on desktop (â¥768px)
  ONLY because the card grid already displays identical content there.
  DO NOT add keywords or copy that users cannot see â that would be cloaking.
-->
<section id="programs-index" class="ssc-program-index" aria-label="All Programs at Springfield Soccer Center">
  <h2>Youth Soccer Programs in Springfield, VA</h2>
  <p>Springfield Soccer Center offers year-round indoor soccer training for youth players
  in Springfield, Fairfax County, and Northern Virginia â including goalkeeper training,
  futsal clinics, player academies, soccer camps, and facility rentals.</p>
${articlesHtml}
</section>
${END_MARKER}`;

// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 6. Inject into index.html
// ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
if (!fs.existsSync(INDEX_HTML)) {
  console.error(`ERROR: ${INDEX_HTML} not found.`);
  process.exit(1);
}

let html = fs.readFileSync(INDEX_HTML, 'utf8').replace(/\0/g, '');

const startIdx = html.indexOf(START_MARKER);
const endIdx   = html.indexOf(END_MARKER);

if (startIdx !== -1 && endIdx !== -1) {
  html = html.substring(0, startIdx) +
         seoSection +
         html.substring(endIdx + END_MARKER.length);
  console.log(`â Replaced existing SEO section (${programs.length} programs).`);
} else {
  if (!html.includes('</body>')) {
    console.error('ERROR: index.html has no </body> tag.');
    process.exit(1);
  }
  html = html.replace('</body>', `\n${seoSection}\n</body>`);
  console.log(`â Inserted SEO section for the first time (${programs.length} programs).`);
}

fs.writeFileSync(INDEX_HTML, html, 'utf8');
console.log(`Done â index.html updated at ${new Date().toISOString()}`);

// Print a quick preview of generated titles
console.log('\nPrograms included:');
programs.forEach(p => console.log(`  [${p.status}] ${p.title}`));
