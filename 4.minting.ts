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

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
);

const walletFile = JSON.parse(
  fs.readFileSync(path.join("/home/dwuw/.config/solana/id.json"), "utf-8")
);

let payer = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

const devBprivateKey = bs58.decode(devB);
let recipient = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(devBprivateKey)
);

umi.use(keypairIdentity(recipient)).use(mplCore()).use(mplCandyMachine());

const archerCandyMachineId = publicKey(
  "CjZro7Sj8P1SZV1VZTozPiLHkVr3o7EsRFjswUkHxgHY"
);
const archerCollection = publicKey(
  "2BmLWt3kos1cqcakhoyEXXET5rywA3TmCU3nPDysoSj7"
);
const archerAsset = generateSigner(umi);

const archerMintV1Tx = await mintV1(umi, {
  candyMachine: archerCandyMachineId,
  asset: archerAsset,
  collection: archerCollection,
  mintArgs: {
    solPayment: some({ destination: payer.publicKey }),
  },
}).sendAndConfirm(umi);
console.log("minted archer asset address", archerAsset.publicKey);
const archerMintV1TxSignature = bs58.encode(archerMintV1Tx.signature);
console.log("archerMintV1TxSignature", archerMintV1TxSignature);
// console.log("mintV1TxResult", mintV1Tx.result);

const saberCandyMachineId = publicKey(
  "3vTAg4LUWRN9ua5XPsgRRd3Ko7vkZSjUvDgjL6Rhuoi7"
);
const saberCollection = publicKey(
  "CQRnfDn2iLnEf8oiA8Nr9HkNNwufSoNH7f4LhQtCmQwn"
);
const saberAsset = generateSigner(umi);

const saberMintV1Tx = await mintV1(umi, {
  candyMachine: saberCandyMachineId,
  asset: saberAsset,
  collection: saberCollection,
  mintArgs: {
    solPayment: some({ destination: payer.publicKey }),
  },
}).sendAndConfirm(umi);
console.log("minted saber asset address", saberAsset.publicKey);
const saberMintV1TxSignature = bs58.encode(saberMintV1Tx.signature);
console.log("saberMintV1TxSignature", saberMintV1TxSignature);
// console.log("mintV1TxResult", mintV1Tx.result);
