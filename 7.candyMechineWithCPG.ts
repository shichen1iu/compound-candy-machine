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
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

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

const casterCandyMachineSigner = generateSigner(umi);

const casterCollection = publicKey(
  "2BmLWt3kos1cqcakhoyEXXET5rywA3TmCU3nPDysoSj7"
);

const createCasterCandyMachineIx = await create(umi, {
  candyMachine: casterCandyMachineSigner,
  collection: casterCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
  configLineSettings: some({
    prefixName: "Caster #",
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
    tokenPayment: some({
      mint: publicKey("AMpEa5rGycyn2zC3F6wWM6khEFjNDYBFsTdkykeEkGu7"),
      amount: 1_000_000_000,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: publicKey("AMpEa5rGycyn2zC3F6wWM6khEFjNDYBFsTdkykeEkGu7"),
        owner: umi.identity.publicKey,
      })[0],
    }),
  },
});

let createCasterCandyMachineTx =
  await createCasterCandyMachineIx.sendAndConfirm(umi);

const createCasterCandyMachinesignature = bs58.encode(
  createCasterCandyMachineTx.signature
);
console.log("Caster CandyMachine Address", casterCandyMachineSigner.publicKey);
console.log(
  "Caster createCandyMachine Tx Signature",
  createCasterCandyMachinesignature
);
