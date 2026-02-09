# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HA-Plex-Card is a custom Lovelace card for Home Assistant that displays Plex media information. It's built as a TypeScript web component using Lit and compiled to a single JavaScript file for Home Assistant.

## Build Commands

```bash
# Install dependencies
npm install

# Build (production - minified, no sourcemaps)
npm run build

# Watch mode (development - with sourcemaps, auto-rebuild on changes)
npm run watch

# Lint TypeScript files
npm run lint
```

The build outputs to `dist/ha-plex-card.js`, which is the file Home Assistant loads.

## Architecture

### Component Structure

- **Main component**: `src/ha-plex-card.ts` - Single-file Lit web component that extends `LitElement`
- **Types**: `src/types.ts` - TypeScript interfaces (currently duplicated in main file, should be consolidated)
- **Build entry**: Rollup bundles from `src/ha-plex-card.ts` to `dist/ha-plex-card.js`

### Key Dependencies

- **Lit**: Web component framework (uses decorators: `@customElement`, `@property`, `@state`)
- **custom-card-helpers**: Home Assistant types and utilities (`HomeAssistant`, `LovelaceCardConfig`)
- **Rollup**: Build system that bundles TypeScript → single ES module

### Component Registration

The card registers itself in two ways:
1. As a custom element via `@customElement('ha-plex-card')` decorator
2. In Home Assistant's card picker via `window.customCards.push()`

### Configuration Schema

Card accepts these options:
- `entity` (required): Plex sensor entity ID
- `name`: Card title (default: "Plex show playing")
- `show_header`: Show/hide header with state badge (default: true)
- `show_title`: Show/hide media title above poster (default: true)
- `show_progress`: Show/hide progress bar with percentage (default: true)

### Expected Sensor Attributes

The card expects a Home Assistant entity with these attributes:
- `title`: Media title (displayed above poster if show_title is true)
- `show_poster`: Series/show poster URL (primary poster source)
- `poster`: Episode/movie poster URL (fallback if show_poster unavailable)
- `progress_percent`: Playback progress (0-100, displayed above progress bar)
- `state`: Playback state (playing, paused, buffering, idle, unavailable)

### State Handling

States map to colors and icons:
- `playing` → green (`mdi:play`)
- `paused` → orange (`mdi:pause`)
- `buffering` → blue (`mdi:loading`)
- `idle` → gray (`mdi:stop`)
- `unavailable` → red (`mdi:alert-circle`)

## Development Workflow

### Testing Changes Locally

1. Run `npm run watch` to enable auto-rebuild
2. Symlink or copy `dist/ha-plex-card.js` to Home Assistant's `www/ha-plex-card/` directory
3. Add resource in HA: Settings → Dashboards → Resources → `/local/ha-plex-card/ha-plex-card.js`
4. Hard refresh browser (Ctrl+Shift+R) after changes

See DEVELOPMENT.md for detailed setup instructions.

### Build Configuration

- **Rollup** (`rollup.config.mjs`): Bundles TypeScript with plugins for node resolution, CommonJS, TypeScript compilation, JSON imports, and Terser minification (production only)
- **TypeScript** (`tsconfig.json`): Targets ES2020, uses decorators (`experimentalDecorators`), outputs to `dist/`
- **ESLint** (`eslint.config.mjs`): TypeScript-specific rules, warns on `any`, errors on unused vars (except `_` prefix)

## Card Layout

The card displays elements in this order:
1. **Header** (optional): Card name and state badge with color
2. **Title** (optional): Media title centered above poster
3. **Poster**: Large centered `show_poster` image (16:9 aspect ratio)
4. **Progress** (optional): Percentage text above a colored progress bar

## Code Style

- Use Lit decorators (`@property`, `@state`) for reactive properties
- Use `html` template literals for rendering
- Use `css` template literals for styles
- Error handling: Display error state in card UI rather than throwing
- Image errors: Hide broken images via `_handleImageError`

## Release Process

Per DEVELOPMENT.md:
1. Update version in `package.json`
2. Build production: `npm run build`
3. Commit and tag: `git tag v0.1.0`
4. Push with tags: `git push origin master --tags`
5. Create GitHub release with `dist/ha-plex-card.js` attached

## HACS Integration

The `hacs.json` file configures HACS to:
- Display repository name as "Plex Card"
- Show README on HACS page
- Serve `ha-plex-card.js` as the main file
