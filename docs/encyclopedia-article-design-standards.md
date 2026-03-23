# Encyclopedia Article Design Standards

> **Version 1.0** · Maintained alongside `src/pages/private/encyclopedia/`

This document defines the authoritative design and layout standards for all encyclopedia article pages in this project.
All encyclopedia article pages **must** use `Layout.astro` and conform to the three-pane structure described here.

---

## 1. Layout

| Rule | Specification |
|------|---------------|
| **Three-pane grid** | Every article page uses a CSS Grid with three columns: `240px 1fr 220px`. |
| **Left pane** | Fixed `240px` sidebar. Contains topic-specific reference panels (Quick Facts, Nursing Relevance, Patient Snapshot, etc.) and back-navigation links. Does **not** contain the Table of Contents. |
| **Middle pane** | Flexible `1fr` column. Contains the full article content: header, body sections, tables, callouts, and references. |
| **Right pane** | Fixed `220px` sidebar. Contains **only** the sticky Table of Contents (TOC) navigation. |
| **Standard layout** | All article pages use `Layout.astro`, which renders the site header and footer. |

---

## 2. Three-Pane Grid Specification

```
┌─────────────────┬───────────────────────────────┬──────────────┐
│   LEFT PANE     │         MIDDLE PANE            │  RIGHT PANE  │
│   (240 px)      │           (1 fr)               │  (220 px)    │
│                 │                                │              │
│ Quick Facts     │  Article Header                │  Contents    │
│ Nursing         │  Callout boxes                 │  1. Section  │
│   Relevance     │  Section bodies                │  2. Section  │
│ Back link(s)    │  Tables                        │  …           │
│                 │  References                    │  N. Refs     │
└─────────────────┴───────────────────────────────┴──────────────┘
```

### CSS Template

```css
.article-grid {
  display: grid;
  grid-template-columns: 240px 1fr 220px;
  gap: 2rem;
  align-items: start;
}

/* Tablet: hide right TOC sidebar, collapse left sidebar slightly */
@media (max-width: 1024px) {
  .article-grid {
    grid-template-columns: 200px 1fr;
  }
  .article-grid > aside:last-child {
    display: none;
  }
}

/* Mobile: single column */
@media (max-width: 768px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. HTML Structure

Every article page must follow this DOM structure inside `<Layout>`:

```html
<div class="article-grid">

  <!-- ── LEFT PANE: topic-specific reference panels ── -->
  <aside style="position:sticky; top:1.5rem;">

    <!-- One or more reference panels (e.g. Quick Facts, Nursing Relevance) -->
    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:0.75rem; padding:1.25rem; margin-bottom:1rem;">
      <p style="…">Panel Title</p>
      <!-- panel content -->
    </div>

    <!-- Back navigation link(s) -->
    <a href="…" style="display:block; text-align:center; …">← Back to Encyclopedia</a>

  </aside>

  <!-- ── MIDDLE PANE: article content ── -->
  <article>
    <header>…</header>
    <section id="section-id">…</section>
    <!-- … more sections … -->
    <section id="references">…</section>
  </article>

  <!-- ── RIGHT PANE: Table of Contents (sticky) ── -->
  <aside style="position:sticky; top:1.5rem;">
    <nav aria-label="Article sections" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:0.65rem; padding:1.1rem 1.25rem;">
      <p style="font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:#94a3b8; margin-bottom:0.65rem;">Contents</p>
      <ol style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.3rem;">
        {sections.map((s, i) => (
          <li>
            <a
              href={`#${s.id}`}
              style="font-size:0.82rem; color:#475569; text-decoration:none; display:block; padding:0.2rem 0; line-height:1.4;"
              onmouseover="this.style.color='#6366f1'"
              onmouseout="this.style.color='#475569'"
            >
              <span style="color:#94a3b8; margin-right:0.35rem;">{i + 1}.</span>{s.heading}
            </a>
          </li>
        ))}
        <!-- Optional: explicit References entry if the article has a references section -->
        <li>
          <a href="#references" style="font-size:0.82rem; color:#475569; text-decoration:none; display:block; padding:0.2rem 0; line-height:1.4;"
             onmouseover="this.style.color='#6366f1'" onmouseout="this.style.color='#475569'">
            <span style="color:#94a3b8; margin-right:0.35rem;">{sections.length + 1}.</span>Key References
          </a>
        </li>
      </ol>
    </nav>
  </aside>

</div>
```

---

## 4. Pane Content Rules

### 4.1 Left pane

| Rule | Detail |
|------|--------|
| **No TOC** | The Table of Contents must **not** appear in the left pane. |
| **Sticky** | The `<aside>` uses `position:sticky; top:1.5rem;` so panels stay visible while scrolling. |
| **Reference panels** | Each topic panel has a coloured background (`#fefce8`, `#eef2ff`, `#f0fdf4`, etc.), a `1px` border, `0.75rem` border-radius, and `1.25rem` padding. |
| **Back link** | At minimum, one back-navigation link (`← Back to Encyclopedia`) must appear at the bottom of the left pane. Additional back links may be included (e.g. `← Parent Article`). |

### 4.2 Middle pane (article)

| Rule | Detail |
|------|--------|
| **Article header** | Each article begins with a `<header>` containing a category badge, the `<h1>` title, a subtitle paragraph, and metadata tags. |
| **Sections** | Body content is divided into `<section id="…">` elements, each with an `<h2>` heading. Every section must have a unique, stable `id` attribute matching the TOC link. |
| **References** | Articles include a `<section id="references">` at the bottom. |

### 4.3 Right pane (TOC)

| Rule | Detail |
|------|--------|
| **TOC only** | The right `<aside>` contains **only** the `<nav aria-label="Article sections">` element. No other panels. |
| **Sticky** | Same `position:sticky; top:1.5rem;` as the left pane. |
| **Link style** | Links use `font-size:0.82rem; color:#475569;` with hover colour `#6366f1` (indigo-500). Section numbers are rendered in `color:#94a3b8`. |
| **aria-label** | The `<nav>` must have `aria-label="Article sections"` for accessibility. |

---

## 5. Visual Design Tokens

| Token | Value |
|-------|-------|
| Accent colour | `#6366f1` (indigo-500) |
| Accent dark | `#4f46e5` (indigo-600) |
| Sidebar background | `#f8fafc` (slate-50) |
| Border colour | `#e2e8f0` (slate-200) |
| Body text | `#334155` (slate-700) |
| Muted text | `#94a3b8` (slate-400) |
| Section number colour | `#94a3b8` (slate-400) |
| TOC link hover | `#6366f1` (indigo-500) |

---

## 6. Responsive Behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| ≥ 1025 px | Full three-pane layout: `240px 1fr 220px` |
| 769 px – 1024 px | Two-pane layout: `200px 1fr`. Right TOC sidebar is hidden (`display:none`). |
| ≤ 768 px | Single column: `1fr`. Both sidebars stack below the article. |

---

## 7. Accessibility

- Left `<aside>` and right `<aside>` are landmark elements and are automatically exposed to screen readers.
- The right TOC `<nav>` carries `aria-label="Article sections"` to distinguish it from other navigation regions.
- All `<section>` elements have unique `id` attributes so in-page anchor links work correctly.
- Back navigation links use descriptive text (e.g. `← Back to Encyclopedia`).

---

## 8. Adding a New Encyclopedia Article

1. Create `src/pages/private/encyclopedia/my-topic.astro`.
2. Import `Layout` instead of `SlidesLayout`:
   ```astro
   import Layout from '../../../layouts/Layout.astro';
   ```
3. Define a `sections` array in the frontmatter with `{ id, heading, body }` entries.
4. Wrap content in `<Layout title="…" protected={true}>`.
5. Build the three-pane grid as specified in §3.
6. Left pane: add topic-specific reference panels and a back link. **Do not add the TOC here.**
7. Middle pane: render the `<article>` with header and sections.
8. Right pane: add the sticky TOC `<aside>` as shown in §3.
9. Add the CSS block from §2 inside a `<style>` tag at the bottom of the file.
10. Create a companion slides page at `my-topic-slides.astro` (see §9).
11. Create a companion bullet-point summary page at `my-topic-summary.astro` (see §10).
12. Add a Related Topics panel to the left pane (see §11).
13. Apply American English spelling throughout (see §12).
14. Perform a merge review to check for overlap with existing articles (see §13).

---

## 9. Companion Slides Page

Every encyclopedia article **must** have an associated companion slides page. The slides page presents the same conceptual content in a condensed, presentation-ready format using `SlidesLayout`.

| Rule | Specification |
|------|---------------|
| **File name** | `my-topic-slides.astro` (append `-slides` to the article slug). |
| **Layout** | Use `SlidesLayout.astro`; do **not** use `Layout.astro`. |
| **Back-link** | Pass `backHref` pointing to the main article and use `backLabel="← Full Article"`. |
| **Content** | Distill key concepts, definitions, and clinical takeaways from the main article into main slides (one per column), with optional sub-slides for supporting detail. |
| **Forward-link** | The main article's left sidebar must include a link labelled **"📊 View as Slides"** to the companion slides page, placed above the back-to-encyclopedia link. |

See `docs/slides-design-standards.md` for the full slides structure specification.

---

## 10. Companion Bullet-Point Summary Page

Every encyclopedia article **must** also have an associated companion bullet-point summary page.

| Rule | Specification |
|------|---------------|
| **File name** | `my-topic-summary.astro` (append `-summary` to the article slug). |
| **Layout** | Use `Layout.astro` with the standard three-pane grid. |
| **Content** | Replace continuous prose sections with structured bullet-point lists. Mirror the section headings from the main article; condense each section's content into concise bullets. Full sentences are preferred over fragments. |
| **Back-link** | Include a back-navigation link labelled **"← Full Article"** pointing to the main article. |
| **Forward-link** | The main article's left sidebar must include a link labelled **"📋 Quick Summary"** to the companion summary page, placed above the back-to-encyclopedia link. |

---

## 11. Related Topics Panel

Every encyclopedia article **must** include a Related Topics panel in the left sidebar.

| Rule | Specification |
|------|---------------|
| **Placement** | Below the Nursing Relevance panel; above companion-page links and the back-to-encyclopedia link. |
| **Label** | Panel heading: **"Related Topics"** (green background: `#f0fdf4`, border `#bbf7d0`). |
| **Count** | Include **3–8** links to other encyclopedia articles directly relevant to the current page. |
| **Link format** | Prefix each link text with `→` and use the article's full title as link text. Use indigo accent colour (`#6366f1`) with underline on hover. |
| **Bidirectional maintenance** | When adding a new article, update the Related Topics panels of any existing articles that should now reference it. |

---

## 12. American English Spelling

All content **must** use American English spelling. This applies to article bodies, sidebar panels, headings, tags, and all other user-facing strings.

### Common corrections

| American English (required) | British English (not used) |
|-----------------------------|---------------------------|
| etiology | aetiology |
| anemia | anaemia |
| diarrhea | diarrhoea |
| edema | oedema |
| leukocyte | leucocyte |
| estrogen | oestrogen |
| feces | faeces |
| pediatric | paediatric |
| orthopedic | orthopaedic |
| hemoglobin | haemoglobin |
| hematology | haematology |
| gynecology | gynaecology |
| organize | organise |
| recognize | recognise |
| analyze | analyse |
| behavior | behaviour |
| color | colour |
| center | centre |
| defense | defence |
| program | programme |
| fulfill | fulfil |
| license (noun) | licence |

**Exception:** Direct quotations may retain the source's original spelling without correction or annotation.

---

## 13. Merge Review Practice

A merge review must be performed at the following trigger points:

1. **New article added** — the contributor checks whether the new content overlaps substantially with any existing article.
2. **Existing article revised** — a merge review is performed before the revision is finalised.
3. **Periodic audit** — the full encyclopedia collection is reviewed at regular intervals.

### Merge criteria

An article is a merge candidate when any of the following apply:

- More than approximately one-third of its substantive content duplicates material in another article.
- Two articles address topics that readers would naturally expect to find in a single entry.
- An article is too short to sustain the standard three-pane academic prose format without padding.

### Merge process

1. Consolidate content into the more general or higher-traffic URL.
2. Update the companion slides and summary pages for the merged article.
3. Remove the secondary article from the encyclopedia index.
4. Update the Related Topics panels of all articles that previously linked to the secondary article.
5. Note the consolidation in the primary article's Quick Facts panel.

---

*Last updated: March 2026*
