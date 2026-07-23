# Design Tokens — Caltram Coffee Journal

Implementation-ready token set for an MUI **CSS-variables** theme with **light + dark** schemes.
Derived from `tokensAudit.md` (which holds the reasoning). Each row gives the **MUI path**, the
**light** value, the **dark** value, and the source `--md-*` var.

> Target build shape: `createTheme({ cssVariables: true, colorSchemes: { light: { palette }, dark: { palette } } })`.
> Rows under "augmented" require palette **module augmentation** before they type-check.

---

## 1. Palette — native MUI slots

| MUI path | light | dark | source var |
|---|---|---|---|
| `primary.main` | `#7A4A23` | `#FFB68C` | `--md-primary` |
| `primary.contrastText` | `#FFFFFF` | `#4B2400` | `--md-on-primary` |
| `secondary.main` | `#6B533F` | `#E0C2A6` | `--md-secondary` |
| `error.main` | `#BA1A1A` | `#BA1A1A` ⚠️ | `--md-error` |
| `background.default` | `#FBF7EE` | `#1A140E` | `--md-surface` |
| `background.paper` | `#F6F1E8` | `#221C15` | `--md-surface-container-low` |
| `text.primary` | `#221A12` | `#ECE3D2` | `--md-on-surface` |
| `text.secondary` | `#6B533F` | `#D0BFA6` | `--md-on-surface-variant` |
| `text.disabled` | `#A48E76` | `#998669` | `--md-outline` † |
| `divider` | `#DCCCB1` | `#4D4234` | `--md-outline-variant` |

⚠️ **`error.main` dark:** the stylesheet's dark scheme never redefines `--md-error`, so it
inherits the light red `#BA1A1A`. That red is low-contrast on the near-black dark surface. Design
decision needed — recommend a lighter dark-mode error (M3 convention is ~`#FFB4AB`). Flagged, not
auto-changed.

† **`--md-outline` does double duty** — faint text *and* component borders (outlined button,
input, segmented control). `text.disabled` covers the text use. For the border use, reference it
explicitly in `styleOverrides`, or expose it as the custom token `surface.outline` below.

---

## 2. Palette — augmented (custom) slots

These have no native MUI home (M3 "container"/"tertiary"/surface-ramp concepts). Add them via
module augmentation, then they auto-generate `--mui-palette-*` vars.

### 2a. Container roles (on `primary` / `secondary`)

| MUI path | light | dark | source var |
|---|---|---|---|
| `primary.container` | `#F6DCBA` | `#683613` | `--md-primary-container` |
| `primary.onContainer` | `#2B1700` | `#FFDBC4` | `--md-on-primary-container` |
| `secondary.container` | `#EFDFCB` | `#523F2C` | `--md-secondary-container` |
| `secondary.onContainer` | `#3A2A1C` | `#F6E0C8` | `--md-on-secondary-container` |

### 2b. Tertiary (new color group)

| MUI path | light | dark | source var |
|---|---|---|---|
| `tertiary.main` | `#715B2E` | `#E2C387` | `--md-tertiary` |
| `tertiary.container` | `#FDDFA6` | `#574215` | `--md-tertiary-container` |

> `tertiary` has no on-color / contrastText defined in the stylesheet. If you render text on
> `tertiary.main`, pick a `contrastText` (light surface text `#221A12` is a safe start) — design
> decision.

### 2c. Surface ramp (custom `surface` group)

| MUI path | light | dark | source var |
|---|---|---|---|
| `surface.dim` | `#ECE3D0` | `#1A140E` | `--md-surface-dim` |
| `surface.bright` | `#FFFCF4` | `#423A30` | `--md-surface-bright` |
| `surface.containerLowest` | `#FFFFFF` | `#140F0A` | `--md-surface-container-lowest` |
| `surface.containerLow` | `#F6F1E8` | `#221C15` | `--md-surface-container-low` |
| `surface.container` | `#F1EADB` | `#26201A` | `--md-surface-container` |
| `surface.containerHigh` | `#ECE3D0` | `#312A22` | `--md-surface-container-high` |
| `surface.containerHighest` | `#E6DAC2` | `#3C342B` | `--md-surface-container-highest` |
| `surface.outline` | `#A48E76` | `#998669` | `--md-outline` (border use, see †) |

> `surface.containerLow` duplicates `background.paper` on purpose — `background.paper` is the MUI
> contract Cards read by default; `surface.containerLow` is the named ramp step. Same value, two
> consumers.

### 2d. Misc custom

| MUI path | light | dark | source var |
|---|---|---|---|
| `scrim` | `rgba(34,26,18,0.32)` | `rgba(34,26,18,0.32)` | `--md-scrim` (inherited in dark) |
| `ruleSoft` | `#E8DDC6` | `#36302A` | `--rule-soft` |

---

## 3. Shape (`theme.shape` + custom scale)

`shape.borderRadius` is a single number → set the most-used (`12`). Keep the full scale as a
custom token group (e.g. `theme.shape.radius`) for per-component use.

| Token | value | used by |
|---|---|---|
| `shape.borderRadius` (base) | `12` | cards |
| `radius.xs` | `4px` | input |
| `radius.sm` | `8px` | chips |
| `radius.md` | `12px` | cards |
| `radius.lg` | `16px` | FAB |
| `radius.xl` | `28px` | — |
| `radius.full` | `999px` | buttons, nav pills, avatar |

---

## 4. Elevation (`theme.shadows[]`) — same in both schemes

| MUI index | value | source var |
|---|---|---|
| `shadows[0]` | `'none'` | — |
| `shadows[1]` | `0 1px 2px rgba(58,42,28,.08), 0 1px 3px 1px rgba(58,42,28,.06)` | `--md-elev-1` |
| `shadows[2]` | `0 1px 2px rgba(58,42,28,.10), 0 2px 6px 2px rgba(58,42,28,.07)` | `--md-elev-2` |
| `shadows[3]` | `0 1px 3px rgba(58,42,28,.10), 0 4px 8px 3px rgba(58,42,28,.08)` | `--md-elev-3` |
| `shadows[4]` | `0 2px 3px rgba(58,42,28,.10), 0 6px 12px 4px rgba(58,42,28,.09)` | `--md-elev-4` |
| `shadows[5..24]` | TBD — interpolate or repeat `[4]` | — |

> MUI requires all 25 entries. Decide on 5–24 (simplest: fill with `--md-elev-4`).

---

## 5. Typography (`theme.typography`)

Families:

| Token | stack |
|---|---|
| `fontFamily` (base/sans) | `'Roboto Flex', 'Roboto', system-ui, -apple-system, sans-serif` |
| serif (display) | `'Instrument Serif', Georgia, serif` |
| `fontFamilyMonospace` | `'Roboto Mono', ui-monospace, Menlo, monospace` |
| base `fontSize` | `15` |

Variants:

| MUI variant | family | size | weight | letter-spacing | line-height | source class |
|---|---|---|---|---|---|---|
| `h1` | serif | `40px` | `400` | `-0.01em` | `1.1` | `.cj-h1` |
| `h2` | sans | `22px` | `500` | `0` | `1.27` | `.cj-h2` |
| `h3` | sans | `16px` | `500` | `0.1px` | — | `.cj-h3` |
| `body1` | sans | `15px` | `400` | `0` | `1.5` | base `.cj` |
| `body2` | sans | `14px` | `400` | `0.25px` | `1.43` | `.cj-meta` |
| `overline` | sans | `11px` | `500` | `0.5px` | — uppercase | `.cj-eyebrow` |
| `overline` (alt) | sans | `11px` | `600` | `0.8px` | — uppercase | `.cj-section-h` |

> Two `overline`-like styles exist (`.cj-eyebrow` 500/0.5px vs `.cj-section-h` 600/0.8px). MUI has
> one `overline`. Pick one as `overline`; expose the other as a custom variant or a one-off.

---

## 6. Motion (`theme.transitions.easing`)

| MUI path | value | source var |
|---|---|---|
| `transitions.easing.easeInOut` (override) | `cubic-bezier(.2,0,0,1)` | `--md-ease-standard` |
| custom `easing.emphasized` | `cubic-bezier(.3,0,0,1)` | `--md-ease-emphasized` |

---

## 7. Open design decisions (resolve while implementing)

1. **Dark error color** — `#BA1A1A` is too dark on dark surface; choose a lighter shade (§1 ⚠️).
2. **`tertiary.contrastText`** — undefined; pick text color for on-tertiary (§2b).
3. **`--md-outline` split** — keep as `text.disabled` only, or also expose `surface.outline` for
   borders (§1 †, §2c).
4. **Second `overline`** — which of `.cj-eyebrow` / `.cj-section-h` owns `overline` (§5).
5. **`shadows[5..24]`** — interpolation strategy (§4).
6. **Radius scale home** — custom `theme.shape.radius.*` vs per-component `styleOverrides` (§3).

These are design calls, not code calls — settle them here before writing `theme.ts`.
