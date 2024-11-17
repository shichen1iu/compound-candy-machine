import { createCollectionV1, mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  none,
  sol,
  some,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import bs58 from "bs58";

import * as fs from "fs";
import * as path from "path";
const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
);

const walletFile = JSON.parse(
  fs.readFileSync(path.join("/home/dwuw/.config/solana/id.json"), "utf-8")
);

let payer = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

umi.use(keypairIdentity(payer)).use(mplCore()).use(mplCandyMachine());

const collectionSigner = generateSigner(umi);
// console.log(collectionSigner);

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: "Saber",
  uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmcSwVwwSb3WBYP6hTvLbQeLRpVnzH9ortEbPh2UeRGCqx",
}).sendAndConfirm(umi);
console.log("Saber Collection Address", collectionSigner.publicKey);

const candyMachineSigner = generateSigner(umi);
console.log("Saber CandyMachine Address", candyMachineSigner.publicKey);

const createSaberCandyMachineIx = await create(umi, {
  candyMachine: candyMachineSigner,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
  configLineSettings: some({
    prefixName: "Saber #",
    nameLength: 4,
    prefixUri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/",
    uriLength: 50,
    isSequential: false,
  }),
  hiddenSettings: none(),
  isMutable: true,
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1), destination: payer.publicKey }),
  },
});

let createSaberCandyMachineTx = await createSaberCandyMachineIx.sendAndConfirm(
  umi
);

const createSaberCandyMachinesignature = bs58.encode(
  createSaberCandyMachineTx.signature
);
console.log(
  "Saber createCandyMachine Tx Signature",
  createSaberCandyMachinesignature
);
console.log("Saber createCandyMachine Tx", createSaberCandyMachineTx.result);
