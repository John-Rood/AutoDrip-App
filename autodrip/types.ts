export enum AppState {
  INITIAL = 'INITIAL',
  SELECTING_KEY = 'SELECTING_KEY',
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedImage {
  original: string; // Base64
  result: string; // Base64
  mimeType: string;
}

// Extend Window interface for the AI Studio helper
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}