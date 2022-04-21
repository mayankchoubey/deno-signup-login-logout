import { addRecord, getRecord } from "./db.ts";
import { UserProfile } from "./consts.ts";
import { getHash } from "./utils.ts";

export async function attemptSignup(userData: UserProfile) {
  const rec = await getRecord(userData.email);
  if (rec) {
    throw new Deno.errors.AlreadyExists();
  }
  const dbRec = { ...userData };
  dbRec.password = await getHash(userData.password);
  await addRecord(userData.email, dbRec);
}
