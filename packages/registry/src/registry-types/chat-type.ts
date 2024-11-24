export const ChatTypeIdentifier = 'minecraft:chat_type' as const;

export interface ChatType {
  chat: Decoration;
  narration: Omit<Decoration, 'style'>;
}

export interface Decoration {
  translationKey: string;
  style?: Style;
  parameters: string[];
}

export interface Style {
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
  font?: string;
  insertion?: string;
  clickEvent?: {
    openURL?: string;
    suggestCommand?: string;
    changePage?: number;
    copyToClipboard?: string;
  };
  hoverEvent?: {
    showText?: {
      contents: string | Record<string, unknown>;
    };
    showItem?: {
      id?: `${string}:${string}`;
      count?: number;
      tag?: string;
    };
    showEntity?: {
      type: `${string}:${string}`;
      id: `${string}-${string}-${string}-${string}-${string}`;
      name?: string;
    };
  };
}
