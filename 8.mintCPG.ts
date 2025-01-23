import { mintV1, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import {
  findAssociatedTokenPda,
  mplToolbox,
} from "@metaplex-foundation/mpl-toolbox";

import {
  keypairIdentity,
  PublicKey,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import * as fs from "fs";
import * as path from "path";

const umi = createUmi(
  "https://devnet.helius-rpc.com/?api-key=47fcd2c1-bfb0-4224-8257-ce200078152a"
);

const walletFile = JSON.parse(
  fs.readFileSync(path.join("/home/dwuw/.config/solana/id.json"), "utf-8")
);

let payer = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

umi.use(keypairIdentity(payer));
umi.use(mplToolbox());

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
);

const mintCPG = publicKey("AMpEa5rGycyn2zC3F6wWM6khEFjNDYBFsTdkykeEkGu7");


const token = findAssociatedTokenPda(umi, {
  mint: mintCPG,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
});

console.log("authority", umi.identity.publicKey);
console.log("CPG", mintCPG);
console.log("token", token);
await mintV1(umi, {
  mint: mintCPG,
  token,
  authority: umi.identity,
  amount: 100000000,
  tokenOwner: payer.publicKey,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi);
