import {
  brightRed,
  createToken,
  getNumericDate,
  JWTHeader,
  verifyToken,
} from "../deps.ts";
import cfg from "../cfg.json" assert { type: "json" };

const jwtKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(cfg.jwtSecret),
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const header: JWTHeader = {
  alg: "HS512",
  typ: "JWT",
};

export function printError(msg: string) {
  console.log(`${brightRed("ERROR:")} ${msg}`);
}

export async function getHash(src: string) {
  const strBytes = new TextEncoder().encode(src);
  const rawHash = await crypto.subtle.digest("SHA-1", strBytes);
  const bufArr = new Uint8Array(rawHash);
  const hexString = Array.from(bufArr).map((b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
  return hexString;
}

export async function getToken(email: string) {
  const payload = {
    exp: getNumericDate(60),
    email,
  };
  return await createToken(header, payload, jwtKey);
}

export async function validateToken(token: string) {
  try {
    const payload = await verifyToken(token, jwtKey);
    if (!payload) {
      return;
    }
    return payload.email as string;
  } catch (e) {}
}

//Cleanup expired JWTs
setInterval(async () => {
  for (let i = 0; i < localStorage.length; i++) {
    const token = localStorage.key(i);
    if (!token) continue;
    try {
      await verifyToken(token, jwtKey);
    } catch (e) {
      localStorage.removeItem(token);
    }
  }
}, 10000);
