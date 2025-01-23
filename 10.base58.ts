import { base58 } from "@metaplex-foundation/umi/serializers";
import { publicKey } from "@metaplex-foundation/umi/serializers";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

import { devB } from "./devB.json";

const privateKey = bs58.decode(devB);
console.log(`[${Keypair.fromSecretKey(privateKey).publicKey}]`);
console.log(`[${Keypair.fromSecretKey(privateKey).secretKey}]`);
