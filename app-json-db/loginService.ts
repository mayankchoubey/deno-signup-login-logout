import { getRecord } from "./db.ts";
import { LoginData } from "./consts.ts";
import { getHash, getToken } from "./utils.ts";

export async function attemptLogin(loginData: LoginData) {
  const rec = await getRecord(loginData.email);
  if (!rec) {
    throw new Deno.errors.NotFound();
  }
  const passwordHash = await getHash(loginData.password);
  if (passwordHash !== rec.password) {
    throw new Deno.errors.PermissionDenied();
  }
  const token = await getToken(loginData.email);
  return token;
}
