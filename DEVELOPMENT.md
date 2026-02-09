# Development Guide

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Card
```bash
# One-time build
npm run build

# Watch mode (rebuilds on changes)
npm run watch
```

### 3. Test in Home Assistant

#### Option A: Symlink (Recommended for development)
```bash
# Create the www directory if it doesn't exist
mkdir -p /path/to/homeassistant/config/www/ha-plex-card

# Symlink the dist file
ln -s $(pwd)/dist/ha-plex-card.js /path/to/homeassistant/config/www/ha-plex-card/ha-plex-card.js
```

#### Option B: Copy on each build
```bash
cp dist/ha-plex-card.js /path/to/homeassistant/config/www/ha-plex-card/
```

### 4. Add Resource to Home Assistant

Go to Settings → Dashboards → Resources (top right menu) and add:

```yaml
url: /local/ha-plex-card/ha-plex-card.js
type: module
```

Or add to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/ha-plex-card/ha-plex-card.js
      type: module
```

### 5. Add Card to Dashboard

Edit your dashboard and add the card:

```yaml
type: custom:ha-plex-card
entity: sensor.plex_now_playing
```

### 6. Reload

After adding the resource, you need to:
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. If changes don't appear, try clearing browser cache

## Project Structure

```
HA-Plex-Card/
├── src/
│   ├── ha-plex-card.ts      # Main card component
│   └── types.ts              # TypeScript types
├── dist/                     # Built files
│   └── ha-plex-card.js       # Production bundle
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── rollup.config.mjs        # Build config
└── README.md                # Documentation
```

## Features

### Current Features
- ✅ Display large centered show poster
- ✅ Show media title above poster (configurable)
- ✅ Show playback state with color-coded badge
- ✅ Progress bar with percentage displayed above (configurable)
- ✅ Configurable visibility options for title and progress

### Sensor States
The card responds to these states:
- `playing` - Green badge
- `paused` - Orange badge
- `buffering` - Blue badge
- `idle` - Gray badge
- `unavailable` - Red badge

## Debugging

### Enable Browser Console
Press F12 and check for errors in the Console tab.

### Common Issues

1. **Card not appearing**
   - Check if the resource is loaded in browser DevTools → Network tab
   - Verify the entity exists: Developer Tools → States

2. **Poster not showing**
   - Check if the poster URL is accessible
   - Verify Plex token is valid
   - Look for CORS errors in console

3. **Build errors**
   - Delete `node_modules` and run `npm install` again
   - Check TypeScript errors: `npm run lint`

## Making Changes

1. Edit files in `src/`
2. Run `npm run watch` to auto-rebuild
3. Hard refresh browser (Ctrl+Shift+R)
4. Changes should appear immediately

## Publishing

The project uses GitHub Releases for distribution. The `dist/` directory is not committed to git.

### Automated Release (Recommended)

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, or major
   ```

2. Push the version commit and create a tag:
   ```bash
   git push origin main
   git push origin --tags
   ```

3. GitHub Actions will automatically:
   - Build the project
   - Create a GitHub release
   - Attach `ha-plex-card.js` to the release
   - Generate release notes

### Manual Release

If you need to create a release manually:

1. Update version in `package.json`
2. Build: `npm run build`
3. Create and push a tag:
   ```bash
   git add package.json package-lock.json
   git commit -m "Bump version to v0.2.0"
   git tag v0.2.0
   git push origin main --tags
   ```
4. Go to GitHub → Releases → Create a new release
5. Choose the tag you just created
6. Upload `dist/ha-plex-card.js` as a release asset
7. Publish the release

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for bug fixes (backwards compatible)
