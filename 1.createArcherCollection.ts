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
  name: "Archer",
  uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmWzExvH4RRfgLrdGeLQtN2Dcy1g8trwpKuDuBg1nT9p5R",
}).sendAndConfirm(umi);
console.log("Archer Collection Address", collectionSigner.publicKey);

const candyMachineSigner = generateSigner(umi);
console.log("Archer CandyMachine Address", candyMachineSigner.publicKey);

const createArcherCandyMachineIx = await create(umi, {
  candyMachine: candyMachineSigner,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 3000,
  authority: umi.identity.publicKey,
  configLineSettings: some({
    prefixName: "Archer #",
    nameLength: 4,
    prefixUri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/",
    uriLength: 50,
    isSequential: false,
  }),
  hiddenSettings: none(),
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1), destination: payer.publicKey }),
  },
});

let createArcherCandyMachineTx =
  await createArcherCandyMachineIx.sendAndConfirm(umi);

const createArcherCandyMachinesignature = bs58.encode(
  createArcherCandyMachineTx.signature
);
console.log(
  "Archer createCandyMachine Tx Signature",
  createArcherCandyMachinesignature
);
console.log("Archer createCandyMachine Tx", createArcherCandyMachineTx.result);
