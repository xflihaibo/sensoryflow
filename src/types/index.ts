export type SensoryMode = 'reading' | 'coding' | 'creative' | 'zen' | 'galaxy' | 'off';

export interface SensorySettings {
  mode: SensoryMode;
  intensity: number;
  enableSpotlight: boolean;
  enableVelocity: boolean;
  enableTimeAware: boolean;
}

export interface SyncMessage {
  type: 'UPDATE_SETTINGS' | 'MODE_CHANGED' | 'GET_SETTINGS';
  payload?: any;
}
