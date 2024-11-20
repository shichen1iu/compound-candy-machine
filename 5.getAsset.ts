import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { das } from '@metaplex-foundation/mpl-core-das';
import { fetchAssetsByCollection } from "@metaplex-foundation/mpl-core";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
).use(dasApi());

const archerAsset = publicKey("oicUPh1gVBav6bDrU8eYnLscb9MfTMxGhC849JcDG47");

const asset = await das.getAsset(umi, archerAsset);
// console.log(asset);

const archerCollection = publicKey(
  "2BmLWt3kos1cqcakhoyEXXET5rywA3TmCU3nPDysoSj7"
);
const saberCollection = publicKey(
  "CQRnfDn2iLnEf8oiA8Nr9HkNNwufSoNH7f4LhQtCmQwn"
);
const archerCollectionInfo = await das.getCollection(umi, archerCollection);
// console.log("archer collection", collection);

const archerAssets = await fetchAssetsByCollection(umi, archerCollection);
// console.log("archer assets", archerAssets);

const saberCollectionInfo = await das.getCollection(umi, saberCollection);
const saberAssets = await fetchAssetsByCollection(umi, saberCollection);
console.log("saber assets", saberAssets);
