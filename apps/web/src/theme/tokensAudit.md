# Token Audit — Caltram Coffee Journal

Design artifact extracted from the project stylesheet (Material 3 / "Material You" on a
warm coffee palette). Purpose: map the existing `--md-*` CSS custom properties onto an MUI
theme so `cj-*` markup can migrate to MUI components without losing the visual language.

> **Status:** analysis only. The `theme.ts` implementation is intentionally left to be written
> by hand (see §7).

---

## 0. The core mismatch (read first)

The stylesheet is **Material 3 (Material You)**. MUI v7's default palette implements
**Material Design 2**. They are *not* the same token model, so extraction is **not 1:1** — a
large set of M3 roles has no native home in MUI's palette and needs a strategy (see §6).

| Your model (M3) | MUI default model (M2) |
|---|---|
| `primary` + `on-primary` + `primary-container` + `on-primary-container` | `primary.main` + `primary.contrastText` *(no container concept)* |
| `tertiary` (+ container) | ❌ doesn't exist |
| 8-step surface ramp (`surface`, `-dim`, `-bright`, `-container-lowest…highest`) | `background.default` + `background.paper` *(only 2)* |
| `outline` + `outline-variant` | `divider` + `action.*` *(roughly)* |
| 2 color schemes (light / dark) | `colorSchemes` (CSS-vars theme) |

> **Scope decision:** this project uses MUI's **CSS theme variables** (`cssVariables: true`)
> with **two** schemes — `light` and `dark`. (The stylesheet also defines a `sepia` scheme;
> it is intentionally out of scope here and omitted from this audit.)

---

## 1. Color tokens — light mode (`:root`)

### 1a. Maps cleanly to MUI native slots

| CSS var | hex | Role | MUI slot |
|---|---|---|---|
| `--md-primary` | `#7A4A23` | brand action | `palette.primary.main` |
| `--md-on-primary` | `#FFFFFF` | text on primary | `palette.primary.contrastText` |
| `--md-secondary` | `#6B533F` | secondary brand | `palette.secondary.main` |
| `--md-error` | `#BA1A1A` | error | `palette.error.main` |
| `--md-surface` | `#FBF7EE` | page bg | `palette.background.default` |
| `--md-surface-container-low` | `#F6F1E8` | card bg (`.cj-card`) | `palette.background.paper` |
| `--md-on-surface` | `#221A12` | body text | `palette.text.primary` |
| `--md-on-surface-variant` | `#6B533F` | muted text / labels | `palette.text.secondary` |
| `--md-outline-variant` | `#DCCCB1` | hairlines (`.cj-rule`, borders) | `palette.divider` |
| `--md-outline` | `#A48E76` | stronger border / faint text | `palette.text.disabled` *(closest fit — see note)* |

> **Note on `--md-outline`:** it does double duty — placeholder/faint text **and**
> outlined-button/input borders. `text.disabled` covers the text use; the border use is
> referenced explicitly in component `styleOverrides`. Don't force it into a single slot.

### 1b. NO native MUI slot — needs palette augmentation (the M3 "extras")

| CSS var | hex | Used by | Suggested custom home |
|---|---|---|---|
| `--md-primary-container` | `#F6DCBA` | tonal buttons, active nav, avatar, FAB | `palette.primary.container` |
| `--md-on-primary-container` | `#2B1700` | text on the above | `palette.primary.onContainer` |
| `--md-secondary-container` | `#EFDFCB` | segmented "on" state | `palette.secondary.container` |
| `--md-on-secondary-container` | `#3A2A1C` | text on above | `palette.secondary.onContainer` |
| `--md-tertiary` | `#715B2E` | honey accent | `palette.tertiary.main` *(new color group)* |
| `--md-tertiary-container` | `#FDDFA6` | — | `palette.tertiary.container` |
| `--md-surface-dim` | `#ECE3D0` | — | `palette.surface.dim` *(custom group)* |
| `--md-surface-bright` | `#FFFCF4` | — | `palette.surface.bright` |
| `--md-surface-container-lowest` | `#FFFFFF` | — | `palette.surface.containerLowest` |
| `--md-surface-container` | `#F1EADB` | row hover, nav links bg | `palette.surface.container` |
| `--md-surface-container-high` | `#ECE3D0` | chips/tags, icon-btn hover | `palette.surface.containerHigh` |
| `--md-surface-container-highest` | `#E6DAC2` | chip hover | `palette.surface.containerHighest` |
| `--md-scrim` | `rgba(34,26,18,.32)` | overlays | `palette.scrim` (or feed MUI `Backdrop`) |

Augmentation technique to study: <https://mui.com/material-ui/customization/palette/#typescript>

### 1c. Legacy aliases — DO NOT tokenize

These are pointers to other vars (`var(--md-…)`), kept only for backward-compat with old
markup. They carry no new value — skip them:

`--bg`, `--bg-2`, `--surface`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--accent`,
`--accent-soft`, `--tag`

**Exception:** `--rule-soft` (`#E8DDC6`) *is* a unique value → custom `palette.ruleSoft`
(or a `divider` variant).

---

## 2. Color tokens — light & dark schemes

Two schemes in scope: `:root` = light, `[data-theme="dark"]` = dark. Both become keys under
`colorSchemes` (see §6). Dark is a **full** override — every role is redefined.

### Full role table (light → dark)

| Role | light | dark |
|---|---|---|
| `primary` | `#7A4A23` | `#FFB68C` |
| `on-primary` | `#FFFFFF` | `#4B2400` |
| `primary-container` | `#F6DCBA` | `#683613` |
| `on-primary-container` | `#2B1700` | `#FFDBC4` |
| `secondary` | `#6B533F` | `#E0C2A6` |
| `secondary-container` | `#EFDFCB` | `#523F2C` |
| `on-secondary-container` | `#3A2A1C` | `#F6E0C8` |
| `tertiary` | `#715B2E` | `#E2C387` |
| `tertiary-container` | `#FDDFA6` | `#574215` |
| `surface` | `#FBF7EE` | `#1A140E` |
| `surface-dim` | `#ECE3D0` | `#1A140E` |
| `surface-bright` | `#FFFCF4` | `#423A30` |
| `surface-container-lowest` | `#FFFFFF` | `#140F0A` |
| `surface-container-low` | `#F6F1E8` | `#221C15` |
| `surface-container` | `#F1EADB` | `#26201A` |
| `surface-container-high` | `#ECE3D0` | `#312A22` |
| `surface-container-highest` | `#E6DAC2` | `#3C342B` |
| `on-surface` | `#221A12` | `#ECE3D2` |
| `on-surface-variant` | `#6B533F` | `#D0BFA6` |
| `outline` | `#A48E76` | `#998669` |
| `outline-variant` | `#DCCCB1` | `#4D4234` |
| `rule-soft` | `#E8DDC6` | `#36302A` |

Multi-scheme refs:
- <https://mui.com/material-ui/customization/css-theme-variables/usage/>
- <https://mui.com/material-ui/customization/dark-mode/#built-in-support-for-color-schemes>

---

## 3. Shape tokens (→ `theme.shape`, NOT palette)

| CSS var | value | Used by |
|---|---|---|
| `--md-radius-xs` | `4px` | input radius (`.cj-field` input) |
| `--md-radius-sm` | `8px` | chips |
| `--md-radius-md` | `12px` | **cards** → set `theme.shape.borderRadius: 12` |
| `--md-radius-lg` | `16px` | FAB |
| `--md-radius-xl` | `28px` | — |
| `--md-radius-full` | `999px` | buttons, nav pills |

`shape.borderRadius` is a **single number**. Set the common one (`12`), keep the full scale as
custom tokens or apply per-component in `styleOverrides`.
Ref: <https://mui.com/material-ui/customization/theme-components/>

---

## 4. Elevation tokens (→ `theme.shadows[]`)

| CSS var | value | MUI home |
|---|---|---|
| `--md-elev-1` | `0 1px 2px rgba(58,42,28,.08), 0 1px 3px 1px rgba(58,42,28,.06)` | `theme.shadows[1]` |
| `--md-elev-2` | `0 1px 2px rgba(58,42,28,.10), 0 2px 6px 2px rgba(58,42,28,.07)` | `theme.shadows[2]` |
| `--md-elev-3` | `0 1px 3px rgba(58,42,28,.10), 0 4px 8px 3px rgba(58,42,28,.08)` | `theme.shadows[3]` |
| `--md-elev-4` | `0 2px 3px rgba(58,42,28,.10), 0 6px 12px 4px rgba(58,42,28,.09)` | `theme.shadows[4]` |

`theme.shadows` is a **25-entry array** (index 0–24) and MUI requires all 25. Override 1–4 with
these warm-tinted values; decide how to fill 5–24. They are warm-tinted (`rgba(58,42,28,…)`) on
purpose — don't let MUI's cool-gray defaults leak through.

---

## 5. Typography & motion

### Typography (→ `theme.typography`)

Three families:
- **Display / headings:** `Instrument Serif` (serif)
- **Body / UI:** `Roboto Flex` (sans) — the base `fontFamily`
- **Mono / code:** `Roboto Mono`

| Class | size / weight / spacing / line-height | MUI variant candidate |
|---|---|---|
| base `.cj` | 15px / 400 / 0 / 1.5 | `body1` (set base `fontSize`) |
| `.cj-h1` | 40px / 400 / -0.01em / 1.1 — **serif** | `h1` (override `fontFamily`) |
| `.cj-h2` | 22px / 500 / 0 / 1.27 | `h2` or `h5` |
| `.cj-h3` | 16px / 500 / 0.1px | `h3` or `h6` |
| `.cj-eyebrow` | 11px / 500 / 0.5px / uppercase | `overline` |
| `.cj-section-h` | 11px / 600 / 0.8px / uppercase | `overline` (2nd variant) |
| `.cj-meta` | 14px / 400 / 0.25px / 1.43 | `body2` |

Custom variants (serif display): <https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants>

### Motion (→ `theme.transitions.easing`)

| CSS var | value | MUI home |
|---|---|---|
| `--md-ease-standard` | `cubic-bezier(.2,0,0,1)` | `transitions.easing.easeInOut` (override) |
| `--md-ease-emphasized` | `cubic-bezier(.3,0,0,1)` | custom easing key |

### Density (NOT tokens — a runtime mode)

`[data-density="cozy"|"compact"]` toggles `--pad-x/-y`, `--gap`, `--row-h`, `--type-step`. This
is a spacing/density switch, not palette/typography. MUI's nearest concept is component `size`
props + `theme.spacing`.

| var | cozy | compact |
|---|---|---|
| `--pad-x` | `28px` | `18px` |
| `--pad-y` | `28px` | `16px` |
| `--gap` | `22px` | `12px` |
| `--row-h` | `64px` | `50px` |
| `--type-step` | `0` | `-1px` |

Ref: <https://mui.com/material-ui/customization/density/>

---

## 6. Architecture (decided): CSS theme variables, light + dark

Approach: **`createTheme` with `cssVariables: true` and a `colorSchemes` object holding `light`
and `dark`.** MUI emits the `--mui-*` custom properties; switching schemes flips an attribute on
`<html>` (the `data-theme` analog) and the browser resolves via the cascade — no React re-render.
This formalizes the CSS-custom-property model the stylesheet already uses by hand.

Things this implies for the build:
- Each role from §1 has a `light` and a `dark` value (§2) → goes under `colorSchemes.light.palette`
  and `colorSchemes.dark.palette`.
- Components reference colors via `theme.vars.palette.*` (resolves to a `var(--mui-…)` string),
  **not** literal hex.
- Augmented roles (§1b — `primary.container`, `tertiary`, `surface.*`, etc.) auto-generate
  matching `--mui-palette-*` vars once the palette types are augmented.

Refs:
- Overview — <https://mui.com/material-ui/customization/css-theme-variables/overview/>
- Usage / `theme.vars` — <https://mui.com/material-ui/customization/css-theme-variables/usage/>
- Attribute & scheme config — <https://mui.com/material-ui/customization/css-theme-variables/configuration/#customizing-attributes>

---

## 7. Remaining work (implementation — to be written by hand)

1. Study **module augmentation** to legally add `primary.container`, `secondary.container`,
   `tertiary`, `surface.*`, `scrim`, `ruleSoft` to the palette types.
2. Build the theme via `createTheme({ cssVariables: true, colorSchemes: { light, dark } })`
   from the §1–§5 tables.
3. Wire `ThemeProvider` + `CssBaseline` and verify one atom (`.cj-btn` → `MuiButton`) in the
   sandbox page.

Reference docs:
- Theming overview — <https://mui.com/material-ui/customization/theming/>
- Default theme inspector — <https://mui.com/material-ui/customization/default-theme/>
- Palette — <https://mui.com/material-ui/customization/palette/>
- Theme components / `styleOverrides` — <https://mui.com/material-ui/customization/theme-components/>
- `ThemeProvider` — <https://mui.com/material-ui/api/theme-provider/>
- `CssBaseline` — <https://mui.com/material-ui/react-css-baseline/>
