import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  addConfigLines,
  fetchCandyMachine,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { keypairIdentity, publicKey, Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import * as fs from "fs";
import * as path from "path";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
);

const devA = JSON.parse(
  fs.readFileSync(path.join("/home/dwuw/.config/solana/id.json"), "utf-8")
);

let payer = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(devA));

umi.use(keypairIdentity(payer)).use(mplCore()).use(mplCandyMachine());

const saberCandyMachine = publicKey(
  "3vTAg4LUWRN9ua5XPsgRRd3Ko7vkZSjUvDgjL6Rhuoi7"
);

await insertItems(umi, saberCandyMachine);

// 生成配置行的辅助函数
function generateConfigLines(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    name: (start + i + 1).toString(),
    uri: "QmWZnX6gfDxeVRmL51gyxXkRaeRYS86MNipoNYdVer7Wky",
  }));
}

// 批量插入函数
async function insertItems(
  umi: Umi,
  candyMachineAddress: string,
  totalItems: number = 1500,
  batchSize: number = 10
) {
  console.log(`开始插入 ${totalItems} 个 items...`);

  // 获取 Candy Machine
  const candyMachine = await fetchCandyMachine(
    umi,
    publicKey(candyMachineAddress)
  );

  let itemsLoaded = Number(candyMachine.itemsLoaded);
  console.log(`当前已加载: ${itemsLoaded} items`);

  while (itemsLoaded < totalItems) {
    const remainingItems = totalItems - itemsLoaded;
    const currentBatchSize = Math.min(batchSize, remainingItems);

    console.log(
      `正在插入 items ${itemsLoaded + 1} 到 ${
        itemsLoaded + currentBatchSize
      }...`
    );

    try {
      await addConfigLines(umi, {
        candyMachine: candyMachine.publicKey,
        index: itemsLoaded,
        configLines: generateConfigLines(itemsLoaded, currentBatchSize),
      }).sendAndConfirm(umi);

      itemsLoaded += currentBatchSize;
      console.log(`成功插入批次。总计已加载: ${itemsLoaded}`);

      // 添加小延迟以避免 RPC 节点限制
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`插入批次时出错: ${error}`);
      // 出错时等待更长时间后重试
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`完成! 总共插入了 ${itemsLoaded} 个 items`);
}
