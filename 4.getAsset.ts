import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { das } from '@metaplex-foundation/mpl-core-das';

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
).use(dasApi());

const assetId = publicKey("7d7QxrNHaPaaiZ3jjPBoMkyrDm4TxsGjM1MUK7K4C6Sr");

const asset = await das.getAsset(umi, assetId);
console.log(asset);