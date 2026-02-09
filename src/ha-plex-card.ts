import { LitElement, html, css, TemplateResult, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { PlexCardConfig, PlexEntityAttributes } from './types';

@customElement('ha-plex-card')
export class HaPlexCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: PlexCardConfig;

  static getStubConfig(): PlexCardConfig {
    return {
      type: 'custom:ha-plex-card',
      entity: '',
      name: 'Plex show playing',
      show_header: true,
      show_title: true,
      show_episode_info: true,
      show_progress: true,
      show_progress_percent: true,
    };
  }

  public setConfig(config: PlexCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    this.config = {
      show_header: true,
      show_title: true,
      show_episode_info: true,
      show_progress: true,
      show_progress_percent: true,
      ...config,
    };
  }

  private getStateColor(state: string): string {
    const stateColors: Record<string, string> = {
      playing: 'var(--success-color, #4caf50)',
      paused: 'var(--warning-color, #ff9800)',
      buffering: 'var(--info-color, #2196f3)',
      idle: 'var(--disabled-text-color, #888)',
      unavailable: 'var(--error-color, #f44336)',
    };
    return stateColors[state.toLowerCase()] || 'var(--primary-text-color)';
  }

  private getStateIcon(state: string): string {
    const stateIcons: Record<string, string> = {
      playing: 'mdi:play',
      paused: 'mdi:pause',
      buffering: 'mdi:loading',
      idle: 'mdi:stop',
      unavailable: 'mdi:alert-circle',
    };
    return stateIcons[state.toLowerCase()] || 'mdi:help-circle';
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html``;
    }

    const entity = this.hass.states[this.config.entity];

    if (!entity) {
      return html`
        <ha-card>
          <div class="card-content error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <p>Entity not found: ${this.config.entity}</p>
          </div>
        </ha-card>
      `;
    }

    const attrs = entity.attributes as PlexEntityAttributes;
    const state = entity.state;
    const name = this.config.name || attrs.friendly_name || 'Plex show playing';

    // Always use show_poster
    const posterUrl = attrs.show_poster || attrs.poster;

    const title = attrs.title || 'No media playing';
    const showTitle = attrs.show_title;
    const seasonNumber = attrs.season_number;
    const episodeNumber = attrs.episode_number;
    const progress = attrs.progress_percent || 0;

    return html`
      <ha-card>
        ${this.config.show_header !== false
          ? html`
              <div class="card-header">
                <div class="name">${name}</div>
                <div class="state-badge" style="background-color: ${this.getStateColor(state)}">
                  <ha-icon icon="${this.getStateIcon(state)}"></ha-icon>
                  <span>${state}</span>
                </div>
              </div>
            `
          : ''}

        <div class="card-content">
          ${this.config.show_title !== false
            ? html`
                <div class="title-section">
                  ${showTitle ? html`<div class="show-title">${showTitle}</div>` : ''}
                  <div class="title">${title}</div>
                  ${this.config.show_episode_info !== false && (seasonNumber !== undefined || episodeNumber !== undefined)
                    ? html`
                        ${seasonNumber !== undefined && episodeNumber !== undefined
                          ? html`<div class="episode-info">S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}</div>`
                          : episodeNumber !== undefined
                          ? html`<div class="episode-info">Episode ${episodeNumber}</div>`
                          : ''}
                      `
                    : ''}
                </div>
              `
            : ''}

          ${posterUrl
            ? html`
                <div class="poster-container">
                  <img
                    src="${posterUrl}"
                    alt="${title}"
                    @error="${this._handleImageError}"
                  />
                </div>
              `
            : html`
                <div class="poster-placeholder">
                  <ha-icon icon="mdi:plex"></ha-icon>
                </div>
              `}

          ${this.config.show_progress !== false && progress > 0
            ? html`
                <div class="progress-section">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      style="width: ${progress}%"
                    ></div>
                    ${this.config.show_progress_percent !== false
                      ? html`<div class="progress-text">${progress.toFixed(1)}%</div>`
                      : ''}
                  </div>
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private _handleImageError(e: Event): void {
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .card-header {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--ha-card-header-background-color, var(--card-background-color));
      }

      .card-header .name {
        font-size: 1.2em;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .state-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.9em;
        font-weight: 500;
        color: white;
        text-transform: capitalize;
      }

      .state-badge ha-icon {
        --mdc-icon-size: 18px;
      }

      .card-content {
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card-content.error {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--error-color);
      }

      .poster-container {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* 16:9 aspect ratio */
        background: var(--secondary-background-color);
        overflow: hidden;
      }

      .poster-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .poster-placeholder {
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .poster-placeholder ha-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-icon-size: 64px;
        color: rgba(255, 255, 255, 0.5);
      }

      .title-section {
        padding: 16px 16px 8px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .show-title {
        font-size: 0.95em;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .title {
        font-size: 1.3em;
        font-weight: 600;
        color: var(--primary-text-color);
        line-height: 1.3;
      }

      .episode-info {
        font-size: 0.9em;
        font-weight: 600;
        color: var(--primary-color);
        margin-top: 2px;
      }

      .progress-section {
        padding: 16px;
        position: relative;
      }

      .progress-bar {
        width: 100%;
        height: 32px;
        background: #87CEEB;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
      }

      .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: rgba(70, 130, 180, 0.7);
        border-radius: 16px;
        transition: width 0.3s ease;
        z-index: 1;
      }

      .progress-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.7);
        z-index: 2;
      }
    `;
  }

  public getCardSize(): number {
    return 4;
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('ha-plex-card-editor');
  }
}

// Editor class
@customElement('ha-plex-card-editor')
export class HaPlexCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: PlexCardConfig;

  public setConfig(config: PlexCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <ha-entity-picker
          .label=${'Entity (Required)'}
          .hass=${this.hass}
          .value=${this._config.entity}
          .configValue=${'entity'}
          @value-changed=${this._valueChanged}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-textfield
          label="Name"
          .value=${this._config.name || ''}
          .configValue=${'name'}
          @input=${this._valueChanged}
        ></ha-textfield>

        <ha-formfield .label=${'Show Header'}>
          <ha-switch
            .checked=${this._config.show_header !== false}
            .configValue=${'show_header'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield .label=${'Show Title'}>
          <ha-switch
            .checked=${this._config.show_title !== false}
            .configValue=${'show_title'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield .label=${'Show Episode Info (S01E02)'}>
          <ha-switch
            .checked=${this._config.show_episode_info !== false}
            .configValue=${'show_episode_info'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield .label=${'Show Progress'}>
          <ha-switch
            .checked=${this._config.show_progress !== false}
            .configValue=${'show_progress'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield .label=${'Show Progress Percent'}>
          <ha-switch
            .checked=${this._config.show_progress_percent !== false}
            .configValue=${'show_progress_percent'}
            @change=${this._valueChanged}
          ></ha-switch>
        </ha-formfield>
      </div>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const configValue = target.configValue as keyof PlexCardConfig;

    if (!configValue) {
      return;
    }

    let value: any;
    if (target.checked !== undefined) {
      value = target.checked;
    } else {
      value = target.value;
    }

    if (this._config[configValue] === value) {
      return;
    }

    const newConfig = {
      ...this._config,
      [configValue]: value,
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static get styles(): CSSResultGroup {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px 0;
      }

      ha-entity-picker,
      ha-textfield {
        width: 100%;
      }

      ha-formfield {
        display: flex;
        align-items: center;
        padding: 8px 0;
      }
    `;
  }
}

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'ha-plex-card',
  name: 'Plex Now Playing',
  description: 'Display currently playing Plex media with poster, title, and progress',
  preview: true,
  documentationURL: 'https://github.com/xguitoux/ha-plex-card',
});

declare global {
  interface HTMLElementTagNameMap {
    'ha-plex-card': HaPlexCard;
    'ha-plex-card-editor': HaPlexCardEditor;
  }
}
