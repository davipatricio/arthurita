import { NBTTagType, ReadableNBT, WritableNBT } from '../../packages/nbt';

const serverList = await Bun.file('./servers.dat');

const serverListBuf = Buffer.from(await serverList.arrayBuffer());
const serverListNbt = new ReadableNBT(serverListBuf);
console.log(serverListNbt.parse());

const serverListCreatedNbt = new WritableNBT().writeTag({
  name: '',
  type: NBTTagType.Compound,
  payload: [
    {
      name: 'servers',
      type: NBTTagType.List,
      itemsType: NBTTagType.Compound,
      payload: [
        {
          type: NBTTagType.Compound,
          payload: [
            {
              type: NBTTagType.Byte,
              name: 'acceptTextures',
              payload: 1
            }
          ]
        }
      ]
    }
  ]
});

console.log(new ReadableNBT(serverListCreatedNbt).parse());
