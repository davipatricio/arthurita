import { NBT, NBTType } from '../../packages/nbt';

const serverList = await Bun.file('./servers.dat');
const serverListBuf = Buffer.from(await serverList.arrayBuffer());

const serverListNbt = new NBT(serverListBuf);
console.log(serverListNbt.parse());

const serverListCreatedNbt = new NBT().writeTag({
  name: '',
  type: NBTType.TAG_Compound,
  payload: [
    {
      name: 'servers',
      type: NBTType.TAG_List,
      itemsType: NBTType.TAG_Compound,
      payload: [
        {
          type: NBTType.TAG_Compound,
          payload: [
            {
              type: NBTType.TAG_Byte,
              name: 'acceptTextures',
              payload: 1
            }
          ]
        }
      ]
    }
  ]
});
console.log(serverListCreatedNbt.parse());
