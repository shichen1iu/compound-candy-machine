import {
  create,
  createCollection,
  createCollectionV1,
  createCollectionV2,
  createPluginV2,
  fetchCollection,
  fetchCollectionV1,
  mplCore,
  pluginAuthority,
} from "@metaplex-foundation/mpl-core";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import * as fs from "fs";
import * as path from "path";
const umi = createUmi(
  "https://long-alpha-asphalt.solana-devnet.quiknode.pro/470df79f25671af1057b47b4dc09b8c3b51b7ddf"
);

const walletFile = JSON.parse(
  fs.readFileSync(path.join("/home/dwuw/.config/solana/id.json"), "utf-8")
);

let payer = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

umi.use(keypairIdentity(payer)).use(mplCore());

const payerSigner = createSignerFromKeypair(umi, payer);

const archerCollectionSigner = generateSigner(umi);
const saberCollectionSigner = generateSigner(umi);

await createCollection(umi, {
  collection: archerCollectionSigner,
  name: "Archer",
  uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmVkDi61XfpdG7fZibX6tRx17rHmxyH3PHJVBChcRhkhQx",
  payer: payerSigner,
  plugins: [
    {
      type: "MasterEdition",
      maxSupply: 1000,
      name: "Archer Master Edition",
      uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmVkDi61XfpdG7fZibX6tRx17rHmxyH3PHJVBChcRhkhQx",
    },
  ],
}).sendAndConfirm(umi);

console.log("Archer Collection Address", archerCollectionSigner.publicKey);

await createCollection(umi, {
  collection: saberCollectionSigner,
  name: "Saber",
  uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmWZnX6gfDxeVRmL51gyxXkRaeRYS86MNipoNYdVer7Wky",
  payer: payerSigner,
  plugins: [
    {
      type: "MasterEdition",
      maxSupply: 1500,
      name: "Saber Master Edition",
      uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmWZnX6gfDxeVRmL51gyxXkRaeRYS86MNipoNYdVer7Wky",
    },
  ],
}).sendAndConfirm(umi);

console.log("Saber Collection Address", saberCollectionSigner.publicKey);

// const collection = await fetchCollection(umi, archerCollectionSigner.publicKey);

// console.log("Collection Info", collection);

// for (let i = 0; i < 5; i++) {
//     const asset = generateSigner(umi);
//     await create(umi, {
//         asset: asset,
//         collection: archerCollectionSigner,
//         name: "Archer Asset",
//         uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmVkDi61XfpdG7fZibX6tRx17rHmxyH3PHJVBChcRhkhQx",
//     }).sendAndConfirm(umi);
// }
