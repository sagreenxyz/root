# Slides Design Standards

> **Version 1.0** · Maintained alongside `src/layouts/SlidesLayout.astro`

This document defines the authoritative design and navigation standards for all slide-based presentations in this project.
All slide pages **must** use `SlidesLayout.astro` and conform to the structure and behaviour described here.

---

## 1. Layout

| Rule | Specification |
|------|---------------|
| **Full-screen** | Every slide occupies exactly **100 vw × 100 vh** (using `100dvh` for mobile). No content scrolls outside the viewport. |
| **No page chrome** | Slide pages use `SlidesLayout.astro`, not `Layout.astro`. The standard site header and footer are not rendered. |
| **HUD overlay** | A translucent control bar is pinned to the top of the viewport. It auto-hides after **3 seconds** of inactivity and reappears on any mouse/touch/keyboard activity. |
| **Background** | The outer `<body>` background is `#000` so black bars are invisible if a slide doesn't fill its cell. |

---

## 2. Two-Dimensional Navigation Model

Slides are organised in a **column grid**:

```
Col 0          Col 1               Col 2
┌──────────┐   ┌──────────┐        ┌──────────┐
│ Main  0  │   │ Main  1  │        │ Main  2  │
│  (row 0) │   │  (row 0) │        │  (row 0) │
└──────────┘   ├──────────┤        └──────────┘
               │ Opt.  1a │
               │  (row 1) │
               ├──────────┤
               │ Opt.  1b │
               │  (row 2) │
               └──────────┘
```

- The **horizontal axis** (X) contains **main slides** — one per column.
- The **vertical axis** (Y, downward) within a column contains **optional slides**.
- A column with no optional slides has only `row 0` (the main slide).

---

## 3. Navigation Rules

### 3.1 Horizontal navigation (main slides)

| Trigger | Behaviour |
|---------|-----------|
| **Right arrow** / **PageDown** / **Next button** / **left→right swipe** | Advance to the **next column** (next main slide). **Always resets the vertical position to row 0** — regardless of which row is currently active. |
| **Left arrow** / **PageUp** / **Prev button** / **right→left swipe** | Go to the **previous column** (previous main slide). **Always resets the vertical position to row 0**. |

> **Critical rule:** If the user is viewing an optional slide (row > 0) and presses **Right** or **Next**, they skip immediately to the **next main slide** (next column, row 0). They do **not** advance to the next optional slide in the current column.

### 3.2 Vertical navigation (optional slides)

| Trigger | Behaviour |
|---------|-----------|
| **Down arrow** / **▼ Optional button** / **top→bottom swipe** | Move **down** one row within the current column (toward optional slides). |
| **Up arrow** / **▲ Main button** / **bottom→top swipe** | Move **up** one row within the current column (back toward the main slide). |

- Down/Up navigation is **bounded** to the current column's rows. It never wraps to another column.
- Optional slides are not reachable via horizontal navigation.

### 3.3 Keyboard shortcuts

| Key | Action |
|-----|--------|
| `→` / `PageDown` | Next main slide (row 0) |
| `←` / `PageUp` | Previous main slide (row 0) |
| `↓` | Next optional slide in current column |
| `↑` | Previous / return to main slide in current column |
| `F` | Toggle fullscreen |
| `Esc` | Exit fullscreen |

---

## 4. HTML Structure

Every slide page must follow this exact DOM structure inside `SlidesLayout.astro`:

```html
<div class="slides-wrapper">

  <!-- ── Main-only column ── -->
  <div class="slide-column">
    <div class="column-inner">
      <div class="slide">
        <!-- main slide content -->
      </div>
    </div>
  </div>

  <!-- ── Column with optional slides ── -->
  <div class="slide-column">
    <div class="column-inner">

      <!-- Main slide (always first, always row 0) -->
      <div class="slide">
        <!-- main slide content -->
        <!-- optional: add a hint element -->
        <div class="optional-hint">
          <span class="arrow">↓</span>
          <span>Optional</span>
        </div>
      </div>

      <!-- Optional slide(s) below the main slide -->
      <div class="slide optional">
        <div class="back-hint">
          <span class="arrow">↑</span>
          <span>Back to main</span>
        </div>
        <!-- optional slide content -->
      </div>

    </div>
  </div>

</div>
```

### Class reference

| Class | Element | Purpose |
|-------|---------|---------|
| `.slides-wrapper` | `<div>` | Top-level flex row; translated horizontally by the engine |
| `.slide-column` | `<div>` | Clips one column to the viewport |
| `.column-inner` | `<div>` | Translated vertically by the engine |
| `.slide` | `<div>` | One 100 vw × 100 vh slide cell |
| `.slide.optional` | `<div>` | Marks an optional sub-slide; renders an amber left border |
| `.optional-hint` | `<div>` | Animated downward cue shown on a main slide with optional content |
| `.back-hint` | `<div>` | Upward cue shown at the top of an optional slide |

---

## 5. Animation

| Property | Value |
|----------|-------|
| Transition type | CSS `transform: translateX / translateY` using `window.innerWidth / window.innerHeight` pixels |
| Duration | `0.45 s` |
| Easing | `cubic-bezier(0.42, 0, 0.18, 1.0)` (slight overshoot feel) |
| Hardware acceleration | `will-change: transform` on `.slides-wrapper` and `.column-inner` |

---

## 6. Visual Design

| Token | Value |
|-------|-------|
| Accent colour | `#6366f1` (indigo-500) |
| Accent dark | `#4f46e5` (indigo-600) |
| Optional slide accent | `#f59e0b` (amber-400) |
| HUD background | `rgba(15, 23, 42, 0.65)` with `backdrop-filter: blur(6px)` |
| Slide background | `#ffffff` |
| Body background | `#000000` |

---

## 7. Accessibility

- HUD buttons carry `aria-label` attributes.
- The optional badge is visually labelled and visible to screen readers.
- Keyboard navigation covers all gestures (see §3.3).
- Fullscreen mode is exposed via a button and the `F` key.

---

## 8. Responsive / Mobile

- Slides always fill `100dvh` to avoid the mobile browser chrome jump.
- Swipe left/right triggers horizontal navigation (threshold: 40 px, dominant axis).
- Swipe up/down triggers vertical navigation (threshold: 40 px, dominant axis).
- Touch events are passive to avoid scroll-jank.

---

## 9. Adding a New Slides Page

1. Create `src/pages/<path>/my-topic-slides.astro`.
2. Import `SlidesLayout` instead of `Layout`:
   ```astro
   import SlidesLayout from '../../../layouts/SlidesLayout.astro';
   ```
3. Wrap all content in `<SlidesLayout title="…" backHref="…" backLabel="…">`.
4. Nest content in `.slides-wrapper > .slide-column > .column-inner > .slide` as described in §4.
5. Mark optional slides with the `.optional` class.
6. Do **not** add custom scroll or keyboard handlers — the engine in `SlidesLayout.astro` handles everything.

---

## 10. Left Legend / Process Indicator

Some slide presentations include a fixed **legend panel on the left edge** of the viewport that shows the steps or phases of the topic and highlights the one currently active. This pattern is called the *process indicator*.

### 10.1 Visibility rules

| Slide position | Legend visibility |
|----------------|-------------------|
| **Title slide** (first column, `slide-title` class) | **Hidden** — the title slide is self-contained and the legend would be distracting. |
| **Intermediate slides** (all columns between first and last) | **Visible** — the legend is shown and updated in real time as the user navigates. |
| **Final slide** (last column, `slide-exam` class) | **Hidden** — the final slide is a summary / takeaways screen that stands alone. |

### 10.2 Implementation

- The panel is created programmatically in a `<script>` block and appended to `document.body` (not inside `#slides-outer`) so it is never clipped by the `overflow: hidden` container.
- After the panel is appended, read `panel.offsetWidth` synchronously and write it to the `--process-indicator-w` CSS custom property on `:root`. Slide content uses `padding-left: calc(var(--process-indicator-w, 190px) + 1.5rem)` so it is never obscured.
- Override `padding-left: 3rem` on `.slide-title` and `.slide-exam` so those slides (which hide the legend) are not over-indented.
- A `MutationObserver` watches the `.slides-wrapper` `style` attribute. In the observer callback, compute the current column and call `panel.style.display = (col === 0 || col === totalCols - 1) ? 'none' : 'flex'`.

---

*Last updated: March 2026*
