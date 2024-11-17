import { base58 } from "@metaplex-foundation/umi/serializers";

import bs58 from "bs58";

import { devB } from "./devB.json";

const privateKey = bs58.decode(devB);
console.log(privateKey);
