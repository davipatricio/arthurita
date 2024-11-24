import { NBTTagType, WritableNBT, type AllNBTTags } from '@arthurita/nbt';
import type { CachedEntries } from '../registries/1.20.3-incomplete';
import armorTrimMaterialRegistry from '#assets/armor-trim-material.json';

let cached: CachedEntries | null = null;

export namespace ArmorTrimMaterial {
  export const Identifier = 'minecraft:trim_material' as const;

  export interface Payload {
    asset_name: string;
    ingredient: string;
    item_model_index: number;
    override_armor_materials?: Record<string, string>;
    description:
      | string
      | {
          translate: string;
          color: string;
        };
  }

  export function entries() {
    if (cached) return cached;

    cached = Object.entries(armorTrimMaterialRegistry[Identifier]).map(([key, value]) => ({
      entryId: key,
      data: ArmorTrimMaterial.create(value)
    }));

    return cached;
  }

  export function create(payload: Payload) {
    // Name	Type	Meaning	Values
    // asset_name	String Tag	The trim color model to be rendered on top of the armor.
    // The Notchian client uses the corresponding asset located at trims/color_palettes.

    // Example: "minecraft:amethyst".
    // ingredient	String Tag	The ingredient used.
    // This has the visual effect of showing the trimmed armor model on the Smithing Table when the correct item is placed.

    // Example: "minecraft:copper_ingot".
    // item_model_index	Float Tag	Color index of the trim on the armor item when in the inventory.	Default values vary between 0.1 and 1.0.
    // override_armor_materials	Optional Compound Tag	Asset for different types of armor materials, which overrides the value specified in the asset_name field.
    // The Notchian client uses this to give a darker color shade when a trim material is applied to armor of the same material, such as iron applied to iron armor.

    // The key can be either:
    // leather
    // chainmail
    // iron
    // gold
    // diamond
    // turtle
    // netherite
    // The value accepts the same values as asset_name.

    // description	Compound Tag or String Tag	The name of the trim material to be displayed on the armor tool-tip.
    // Any styling used in this component is also applied to the trim pattern description.

    // See Text formatting.
    const data: AllNBTTags = {
      name: '',
      type: NBTTagType.Compound,
      payload: [
        {
          name: 'asset_name',
          type: NBTTagType.String,
          payload: payload.asset_name
        },
        {
          name: 'ingredient',
          type: NBTTagType.String,
          payload: payload.ingredient
        },
        {
          name: 'item_model_index',
          type: NBTTagType.Float,
          payload: payload.item_model_index
        }
      ]
    };

    if (typeof payload.description === 'string') {
      data.payload.push({
        name: 'description',
        type: NBTTagType.String,
        payload: payload.description
      });
    } else {
      data.payload.push({
        name: 'description',
        type: NBTTagType.Compound,
        payload: [
          {
            name: 'translate',
            type: NBTTagType.String,
            payload: payload.description.translate
          },
          {
            name: 'color',
            type: NBTTagType.String,
            payload: payload.description.color
          }
        ]
      });
    }

    if (payload.override_armor_materials) {
      const overrideArmorMaterials: AllNBTTags = {
        name: 'override_armor_materials',
        type: NBTTagType.Compound,
        payload: Object.entries(payload.override_armor_materials).map(([key, value]) => ({
          name: key,
          type: NBTTagType.String,
          payload: value
        }))
      };

      data.payload.push(overrideArmorMaterials);
    }

    const nbt = new WritableNBT().serialize(data);
    return nbt;
  }
}
