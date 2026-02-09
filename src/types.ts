export interface PlexCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_header?: boolean;
  show_title?: boolean;
  show_episode_info?: boolean;
  show_progress?: boolean;
  show_progress_percent?: boolean;
}

export interface PlexEntityAttributes {
  friendly_name?: string;
  episode_number?: number;
  season_number?: number;
  show_poster?: string;
  poster?: string;
  title?: string;
  show_title?: string;
  progress_percent?: number;
}
