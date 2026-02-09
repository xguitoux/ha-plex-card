# Plex Card for Home Assistant

A custom Lovelace card for Home Assistant to display Plex media information.

## Installation

### HACS (Recommended)

1. Open HACS
2. Go to "Frontend"
3. Click the menu in the top right and select "Custom repositories"
4. Add this repository URL and select "Lovelace" as the category
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download `ha-plex-card.js` from the [latest release](https://github.com/xguitoux/ha-plex-card/releases/latest)
2. Copy it to `config/www/community/ha-plex-card/`
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/community/ha-plex-card/ha-plex-card.js
    type: module
```

4. Restart Home Assistant

## Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:ha-plex-card
entity: sensor.plex_now_playing
name: Plex show playing
show_header: true
show_title: true
show_episode_info: true
show_progress: true
show_progress_percent: true
```

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| entity | string | **Required** | Entity ID of your Plex sensor (e.g., `sensor.plex_now_playing`) |
| name | string | `Plex show playing` | Card name |
| show_header | boolean | `true` | Show/hide card header with state badge |
| show_title | boolean | `true` | Show/hide media title above poster |
| show_episode_info | boolean | `true` | Show/hide season and episode numbers (S01E02) |
| show_progress | boolean | `true` | Show/hide progress bar |
| show_progress_percent | boolean | `true` | Show/hide percentage on progress bar |

### Expected Sensor Attributes

The sensor should have the following attributes:

- `title` - Episode or media title
- `show_poster` - URL to show/series poster (displayed in the card)
- `poster` - URL to episode poster (fallback if show_poster not available)
- `progress_percent` - Playback progress (0-100)
- `state` - Current state (playing, paused, buffering, idle, etc.)

Example sensor state:
```yaml
friendly_name: plex-now-playing
device: Linux
episode_number: 2
show_poster: https://your-plex-server/library/metadata/1801/thumb/...
poster: https://your-plex-server/library/metadata/1804/thumb/...
state: buffering
title: Le vase de Xiang
progress_percent: 37.6
```

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Lint

```bash
npm run lint
```

## License

MIT License
