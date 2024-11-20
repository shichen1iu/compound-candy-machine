import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  mintV1,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  some,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import * as fs from "fs";
import * as path from "path";

import { devB } from "./devB.json";
import bs58 from "bs58";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
);

const walletFile = JSON.parse(
  fs.readFileSync(path.join("/home/dwuw/.config/solana/id.json"), "utf-8")
);

let payer = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

for (let i = 0; i < 10; i++) {
  const recipient = generateSigner(umi);
  umi.use(keypairIdentity(recipient)).use(mplCore()).use(mplCandyMachine());

  const randomAsset = generateSigner(umi);

  const archerCandyMachineId = publicKey(
    "CjZro7Sj8P1SZV1VZTozPiLHkVr3o7EsRFjswUkHxgHY"
  );

  const archerCollection = publicKey(
    "2BmLWt3kos1cqcakhoyEXXET5rywA3TmCU3nPDysoSj7"
  );
  const archerAsset = generateSigner(umi);
  console.log("minted archer asset address", archerAsset.publicKey);

  requestAirdrop(recipient.publicKey, 0.5);

  const archerMintV1Tx = await mintV1(umi, {
    candyMachine: archerCandyMachineId,
    asset: archerAsset,
    collection: archerCollection,
    mintArgs: {
      solPayment: some({ destination: payer.publicKey }),
    },
  }).sendAndConfirm(umi);

  const archerMintV1TxSignature = bs58.encode(archerMintV1Tx.signature);
  console.log("archerMintV1TxSignature", archerMintV1TxSignature);
}

async function requestAirdrop(walletAddress: string, solAmount: number = 0.5) {
  try {
    // 连接到 devnet
    const connection = new Connection(
      "https://rpc.ankr.com/solana_devnet",
      "confirmed"
    );

    // 将钱包地址转换为 PublicKey
    const publicKey = new PublicKey(walletAddress);

    // 请求空投（金额转换为 lamports）
    const signature = await connection.requestAirdrop(
      publicKey,
      solAmount * LAMPORTS_PER_SOL
    );

    // 等待交易确认
    await connection.confirmTransaction(signature);

    console.log(`成功空投 ${solAmount} SOL 到钱包: ${walletAddress}`);
    console.log(`交易签名: ${signature}`);

    // 获取并显示最新余额
    const balance = await connection.getBalance(publicKey);
    console.log(`当前钱包余额: ${balance / LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.error("空投失败:", error);
  }
}
