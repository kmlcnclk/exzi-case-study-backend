const crypto = require("crypto");
const fs = require("fs");

// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: "spki",
//     format: "pem",
//   },
//   privateKeyEncoding: {
//     type: "pkcs8",
//     format: "pem",
//   },
// });

// fs.writeFileSync("public.pem", publicKey);
// fs.writeFileSync("private.pem", privateKey);

function hashUserWalletPrivateKey(walletPrivateKey) {
  const publicKey = fs.readFileSync("public.pem", "utf8");

  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(walletPrivateKey, "utf8")
  );
  return encryptedData.toString("base64");
}

function decryptHashedWalletPrivateKey(hash) {
  const encryptedBuffer = Buffer.from(hash, "base64");

  const privateKey = fs.readFileSync("private.pem", "utf8");

  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedBuffer
  );

  return decryptedData.toString("utf8");
}

const asd = hashUserWalletPrivateKey("walletPrivateKey");
console.log(asd);

const asd2 = decryptHashedWalletPrivateKey("hxDBXzVyXj3GaSHckV/u/GM0lbWf7t8K7MH+O+xeDeykoa+T9IzWSfTnmEFopcXTvxti6ZMT2fAHJtHTwQs/SfIIKgyrohRtIs1p6Xd95GRsm+xeejeBGWTsItrBW/ZNhA2DLhlkGeXqPMoHhSOzfYvgTCDJT6xh+vMgAQQPxzyQY89ok8N9Rbmg1cAoL+WHklLa+QElFKYv/TH1l6WKELoeZAFYuBL57ltD7HOtTINQVyf76rLmtCFM3r5Ba7woNozF3JjN55JIJPPHplLni7Mi+YpNDMEQ17PzPD+6oD3xIKivf95HBOigomJt6jZAaYR3tz0LL7OP3W/muL24dg==");
console.log(asd2);
