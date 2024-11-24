import { NBTTagType, WritableNBT, type AllNBTTags, type NBTTagCompound } from '@arthurita/nbt';
import type { CachedEntries } from '../registries/1.20.3-incomplete';
import chatTypeRegistry from '#assets/chat-type.json';

let cached: CachedEntries | null = null;

export namespace ChatType {
  export const Identifier = 'minecraft:chat_type' as const;
  // chat	Compound Tag	The chat decoration.	See Decoration.
  // narration	Compound Tag	The narration decoration.
  export interface Payload {
    chat: Decoration;
    narration: Omit<Decoration, 'style'>;
  }

  // Name	Type	Meaning	Values
  // translation_key	String Tag	The translation key representing the chat format. It can also be a formatting string directly.	Example: "chat.type.text", which translates to "<%s> %s".
  // style	Optional Compound Tag	Optional styling to be applied on the final message.
  // Not present in the narration decoration.

  // See Text formatting#Styling fields.
  // parameters	List Tag of String Tag	Placeholders used when formatting the string given by the translation_key field.	Can be either:
  // sender, for the name of the player sending the message.
  // target, for the name of the player receiving the message, which may be empty.
  // content, for the actual message.
  export interface Decoration {
    translation_key: string;
    style?: Style;
    parameters: string[];
  }

  export interface Style {
    color?: string;
    bold?: number;
    italic?: number;
    underlined?: number;
    strikethrough?: number;
    obfuscated?: number;
    font?: string;
    insertion?: string;
    clickEvent?: {
      open_url?: string;
      run_command?: string;
      suggest_command?: string;
      change_page?: number;
      copy_to_clipboard?: string;
    };
    hoverEvent?: {
      show_text?: {
        contents: string | Record<string, unknown>;
      };
      show_item?: {
        id?: `${string}:${string}`;
        count?: number;
        tag?: string;
      };
      show_entity?: {
        type: `${string}:${string}`;
        id: `${string}-${string}-${string}-${string}-${string}`;
        name?: string;
      };
    };
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(chatTypeRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: ChatType.create(value)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    const chat: NBTTagCompound = {
      name: 'chat',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'translation_key',
          type: NBTTagType.String,
          payload: payload.chat.translation_key
        },
        {
          name: 'parameters',
          type: NBTTagType.List,
          itemsType: NBTTagType.String,
          payload: payload.chat.parameters.map((data) => ({
            name: '',
            type: NBTTagType.String,
            payload: data
          }))
        }
      ]
    };

    if (payload.chat.style) {
      const style: NBTTagCompound = {
        name: 'style',
        type: NBTTagType.Compound,
        payload: []
      };

      if (payload.chat.style.color) {
        style.payload.push({
          name: 'color',
          type: NBTTagType.String,
          payload: payload.chat.style.color
        });
      }

      if (payload.chat.style.bold) {
        style.payload.push({
          name: 'bold',
          type: NBTTagType.Byte,
          payload: payload.chat.style.bold
        });
      }

      if (payload.chat.style.italic) {
        style.payload.push({
          name: 'italic',
          type: NBTTagType.Byte,
          payload: payload.chat.style.italic
        });
      }

      if (payload.chat.style.underlined) {
        style.payload.push({
          name: 'underlined',
          type: NBTTagType.Byte,
          payload: payload.chat.style.underlined
        });
      }

      if (payload.chat.style.strikethrough) {
        style.payload.push({
          name: 'strikethrough',
          type: NBTTagType.Byte,
          payload: payload.chat.style.strikethrough
        });
      }

      if (payload.chat.style.obfuscated) {
        style.payload.push({
          name: 'obfuscated',
          type: NBTTagType.Byte,
          payload: payload.chat.style.obfuscated
        });
      }

      if (payload.chat.style.font) {
        style.payload.push({
          name: 'font',
          type: NBTTagType.String,
          payload: payload.chat.style.font
        });
      }

      if (payload.chat.style.insertion) {
        style.payload.push({
          name: 'insertion',
          type: NBTTagType.String,
          payload: payload.chat.style.insertion
        });
      }

      if (payload.chat.style.clickEvent) {
        const clickEvent: NBTTagCompound = {
          name: 'clickEvent',
          type: NBTTagType.Compound,
          payload: []
        };

        if (payload.chat.style.clickEvent.open_url) {
          clickEvent.payload.push({
            name: 'open_url',
            type: NBTTagType.String,
            payload: payload.chat.style.clickEvent.open_url
          });
        }

        if (payload.chat.style.clickEvent.run_command) {
          clickEvent.payload.push({
            name: 'run_command',
            type: NBTTagType.String,
            payload: payload.chat.style.clickEvent.run_command
          });
        }

        if (payload.chat.style.clickEvent.suggest_command) {
          clickEvent.payload.push({
            name: 'suggest_command',
            type: NBTTagType.String,
            payload: payload.chat.style.clickEvent.suggest_command
          });
        }

        if (payload.chat.style.clickEvent.change_page) {
          clickEvent.payload.push({
            name: 'change_page',
            type: NBTTagType.Int,
            payload: payload.chat.style.clickEvent.change_page
          });
        }

        if (payload.chat.style.clickEvent.copy_to_clipboard) {
          clickEvent.payload.push({
            name: 'copy_to_clipboard',
            type: NBTTagType.String,
            payload: payload.chat.style.clickEvent.copy_to_clipboard
          });
        }
        style.payload.push(clickEvent);
      }

      // TODO: hover event

      chat.payload.push(style);
    }

    const narration: NBTTagCompound = {
      name: 'narration',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'translation_key',
          type: NBTTagType.String,
          payload: payload.narration.translation_key
        },
        {
          name: 'parameters',
          type: NBTTagType.List,
          itemsType: NBTTagType.String,
          payload: payload.narration.parameters.map((data) => ({
            name: '',
            type: NBTTagType.String,
            payload: data
          }))
        }
      ]
    };

    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: []
    };

    data.payload.push(chat);
    data.payload.push(narration);

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
