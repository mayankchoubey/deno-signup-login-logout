import { getRecord } from "./db.ts";

export async function getUser(email: string) {
  const rec = await getRecord(email);
  if (!rec) {
    throw new Deno.errors.NotFound();
  }
  return rec;
}
