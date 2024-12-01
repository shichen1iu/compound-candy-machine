import {
  createCollection,
  create,
  fetchAsset,
  fetchAssetsByCollection,
  fetchCollection,
  mplCore,
  createV2,
} from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
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

umi.use(keypairIdentity(payer)).use(mplCore());

const testCollectionSigner = generateSigner(umi);

await createCollection(umi, {
  collection: testCollectionSigner,
  name: "Test Collection",
  uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmVkDi61XfpdG7fZibX6tRx17rHmxyH3PHJVBChcRhkhQx",
}).sendAndConfirm(umi);

console.log("Test Collection Address", testCollectionSigner.publicKey);
// console.log("Test Collection Info", testCollectionSigner);

const testAsset = generateSigner(umi);

const testUnknownAuthority = generateSigner(umi);
let createSaberAssettx = await create(umi, {
  asset: testAsset,
  // collection: testCollectionSigner,
  authority: testCollectionSigner,
  // authority: testUnknownAuthority,
  name: "Test Asset",
  owner: publicKey(payer.publicKey),
  updateAuthority: testCollectionSigner.publicKey,
  uri: "https://gray-managing-penguin-864.mypinata.cloud/ipfs/QmVkDi61XfpdG7fZibX6tRx17rHmxyH3PHJVBChcRhkhQx",
}).sendAndConfirm(umi);

const createSaberAssetSignature = bs58.encode(createSaberAssettx.signature);
console.log("Saber Asset Address", testAsset.publicKey);
console.log(
  "singer:Collection Authoirty Signer Tx Signature",
  createSaberAssetSignature
);
// console.log("singer:Unknown Authority Signer Tx Signature", createSaberAssetSignature);

const collection = await fetchCollection(umi, testCollectionSigner.publicKey);

console.log("Collection Info", collection);

const fetchedAsset = await fetchAsset(umi, testAsset.publicKey);

console.log("Fetch Asset", fetchedAsset);

await new Promise((resolve) => setTimeout(resolve, 1000));

const assetsByCollection = await fetchAssetsByCollection(
  umi,
  testCollectionSigner.publicKey,
  {
    skipDerivePlugins: false,
  }
);

console.log("FetchAssets By Collection", assetsByCollection);
