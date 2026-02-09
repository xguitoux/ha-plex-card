## What's Changed

<!-- Describe the changes in this release -->

## Installation

### HACS (Recommended)
1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click the menu (⋮) and select "Custom repositories"
4. Add this repository URL
5. Install "Plex Card"
6. Restart Home Assistant

### Manual
1. Download `ha-plex-card.js` from the assets below
2. Copy to `config/www/community/ha-plex-card/`
3. Add resource in Home Assistant:
   ```yaml
   resources:
     - url: /local/community/ha-plex-card/ha-plex-card.js
       type: module
   ```
4. Restart Home Assistant

## Configuration

```yaml
type: custom:ha-plex-card
entity: sensor.plex_now_playing
show_header: true
show_title: true
show_progress: true
show_progress_percent: true
```

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
