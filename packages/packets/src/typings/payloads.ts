export interface StatusResponsePayload {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample: {
      id: string;
      name: string;
    }[];
  };
  description: {
    text: string;
  };
  enforcesSecureChat: boolean;
  previewsChat: boolean;
  favicon?: string;
}

export enum PlayerSettingsChatMode {
  Enabled = 0,
  CommandsOnly = 1,
  Hidden = 2
}

export enum ServerDifficulty {
  PEACEFUL = 0,
  EASY = 1,
  NORMAL = 2,
  HARD = 3
}
