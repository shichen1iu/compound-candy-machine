import nacl from "tweetnacl";
import bs58 from "bs58";
import { secretKeyBase58 } from "./devB.json";

// 1. 设置消息和密钥
const message =
  "V1-twitter-1878979087878046142-CmkiKurupRMoURDGjgJxnbKzmgotgw8AoQ41PwVQKGRX-2.09";

// 将base58格式的私钥转换为Uint8Array

const secretKey = Uint8Array.from(bs58.decode(secretKeyBase58));

// 从私钥生成密钥对
const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);

// 2. 转换消息为Uint8Array
const messageBytes = Uint8Array.from(Buffer.from(message, "utf-8"));

// 3. 生成签名
const signature = nacl.sign.detached(messageBytes, secretKey);

// 4. 输出签名的十六进制表示
console.log("Signature (hex):", Buffer.from(signature).toString("hex"));
console.log("Signature (base58):", bs58.encode(signature));

// 5. 验证签名
const isValid = nacl.sign.detached.verify(
  messageBytes,
  signature,
  keyPair.publicKey
);
console.log("Signature valid:", isValid);

// 6. 输出调试信息
console.log("\nDebug Info:");
console.log("Message:", message);
console.log("SecretKey length:", secretKey.length);
console.log("PublicKey length:", keyPair.publicKey.length);
console.log("Message bytes length:", messageBytes.length);
console.log("Signature length:", signature.length);

// 7. 输出密钥信息
console.log("\nKey Info:");
console.log("SecretKey (base58):", secretKeyBase58);
console.log("PublicKey (base58):", bs58.encode(keyPair.publicKey));
