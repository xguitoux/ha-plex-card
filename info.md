# Plex Card

A beautiful custom Lovelace card for Home Assistant to display your Plex media information.

## Features

- 🖼️ **Large centered show poster** - Display your media artwork prominently
- 📝 **Customizable display** - Show/hide title, progress bar, and percentage
- 📊 **Progress tracking** - Visual progress bar with optional percentage overlay
- 🎬 **Episode information** - Display season and episode numbers (S01E02 format)
- 🎨 **State indicators** - Color-coded badges for playing, paused, buffering, idle states
- ⚙️ **Visual editor** - Configure your card directly in the Home Assistant UI

## Quick Start

Add the card to your Lovelace dashboard:

```yaml
type: custom:ha-plex-card
entity: sensor.plex_now_playing
```

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `entity` | Plex sensor entity ID | Required |
| `name` | Card title | `"Plex"` |
| `show_header` | Show header with state badge | `true` |
| `show_title` | Show media title above poster | `true` |
| `show_progress` | Show progress bar | `true` |
| `show_progress_percent` | Show percentage on bar | `true` |

## Required Sensor Attributes

Your Plex sensor should provide:
- `title` - Episode/media title
- `show_title` - Series title (optional)
- `season_number` - Season number (optional)
- `episode_number` - Episode number (optional)
- `show_poster` - Poster image URL
- `progress_percent` - Playback progress (0-100)
- `state` - Playback state (playing, paused, buffering, idle, unavailable)

For more information, see the [README](https://github.com/your-username/ha-plex-card).
