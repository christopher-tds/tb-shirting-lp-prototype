# Tie Bar · Smart Shirting landing page prototype

Coded prototype of the shirting landing page, built from the TDS prototype starter. It renders three concepts (v3, v4, v5) from one set of blocks, so a new campaign page is a new config, not new code.

```bash
npm install
npm run dev     # http://localhost:5196
npm run build   # static files in dist/
```

The review bar (top right) switches concept (v3 / v4 / v5) and viewport (Desktop / Tablet 820 / Mobile 393). `?v=v5` opens a concept directly; `?clean` hides the review bar.

## Sources

| What | Source |
|---|---|
| Blocks, layout, copy, images | Figma `xvrPbRTCGNwxpVMM01q5K0`, sections "Shirting LP · Components" and "Shirting LP · Pages" |
| Block inventory | `../tb-shirting-lp-blocks.md` |
| Tokens and breakpoints | `tb-shopify-hydrogen/app/styles/config.css`, `tds-design-governance` (core + `tb.md`) |
| Header | Measured on thetiebar.com at 393, 820 and 1440 on 2026-11-08 |

## Files

| File | What it is |
|---|---|
| `src/pages.js` | One block list per concept. Start here for a new page |
| `src/content.js` | Copy, images and alt text per block, plus placeholder products |
| `src/blocks/blocks.jsx` | One component per Figma block set (Hero, Intro, Start here, Story, Product row, Band, Find your fit, Details) |
| `src/parts/` | Base components (cards, text link, arrows, progress) and the swipe-row hook |
| `src/components/SiteHeader.jsx` | Live-parity header |
| `src/styles.css` | Tokens, then each block at base, sm-md (800) and desktop (1000+) |
| `src/review/` | Concept and viewport pickers |

## Fonts

Belizio and Poynter are licensed and kept out of the repo (`public/fonts/` is gitignored). Without them the page falls back to Roboto Slab, Roboto and Roboto Condensed, the live site's fallbacks. Libre Franklin loads from Google Fonts.

## What's placeholder

- **Products:** real names, colors, prices and photos for the 16 shirts in `src/data/products.json`, hand-copied from thetiebar.com search on 2026-11-08 (the public feed 404s on Hydrogen). It's a snapshot: refresh prices and stock before a review. Cards link to the live product pages and use each shirt's folded flat lay.
- **Fit images:** Standard and Trim use the same photo, as in the Figma file.
- **Alt text:** drafted from the photos; confirm before handoff.
