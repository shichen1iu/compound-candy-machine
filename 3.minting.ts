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
  "5s2ZmtF1bQuH1yGZP3qNgMq8u2P4M4eLm3YXoEMcvrdy"
);
const archerCollection = publicKey(
  "BKQFp7a4XuJ1vNvLxgynEC9UTRA74V4xCyhsQEq8TQUr"
);
const asset = generateSigner(umi);
console.log("minted archerasset address", asset.publicKey);

const mintV1Tx = await mintV1(umi, {
  candyMachine: archerCandyMachineId,
  asset,
  collection: archerCollection,
  mintArgs: {
    solPayment: some({ destination: payer.publicKey }),
  },
}).sendAndConfirm(umi);

const mintV1TxSignature = bs58.encode(mintV1Tx.signature);
console.log("mintV1TxSignature", mintV1TxSignature);
console.log("mintV1TxResult", mintV1Tx.result);
