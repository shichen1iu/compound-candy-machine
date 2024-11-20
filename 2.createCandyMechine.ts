import {
  generateSigner,
  keypairIdentity,
  none,
  publicKey,
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

umi.use(keypairIdentity(payer)).use(mplCandyMachine());

const archerCandyMachineSigner = generateSigner(umi);

const archerCollection = publicKey(
  "2BmLWt3kos1cqcakhoyEXXET5rywA3TmCU3nPDysoSj7"
);

const createArcherCandyMachineIx = await create(umi, {
  candyMachine: archerCandyMachineSigner,
  collection: archerCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
  configLineSettings: some({
    prefixName: "Archer #",
    nameLength: 4,
    prefixUri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/",
    uriLength: 50,
    isSequential: true,
  }),
  hiddenSettings: none(),
  guards: {
    edition: { editionStartOffset: 1 },
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1), destination: payer.publicKey }),
  },
});

let createArcherCandyMachineTx =
  await createArcherCandyMachineIx.sendAndConfirm(umi);

const createArcherCandyMachinesignature = bs58.encode(
  createArcherCandyMachineTx.signature
);
console.log("Archer CandyMachine Address", archerCandyMachineSigner.publicKey);
console.log(
  "Archer createCandyMachine Tx Signature",
  createArcherCandyMachinesignature
);

// Create Saber Candy Machine
const saberCandyMachineSigner = generateSigner(umi);

const saberCollection = publicKey(
  "CQRnfDn2iLnEf8oiA8Nr9HkNNwufSoNH7f4LhQtCmQwn"
);

const createSaberCandyMachineIx = await create(umi, {
  candyMachine: saberCandyMachineSigner,
  collection: saberCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1500,
  authority: umi.identity.publicKey,
  configLineSettings: some({
    prefixName: "Saber #",
    nameLength: 4,
    prefixUri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/",
    uriLength: 50,
    isSequential: true,
  }),
  hiddenSettings: none(),
  guards: {
    edition: { editionStartOffset: 1 },
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
console.log("Saber CandyMachine Address", saberCandyMachineSigner.publicKey);
console.log(
  "Saber createCandyMachine Tx Signature",
  createSaberCandyMachinesignature
);
