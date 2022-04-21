const DB_PATH = "./localdb/users.json";

export async function addRecord(id: string, data: any) {
  const file = JSON.parse(await Deno.readTextFile(DB_PATH));
  file[id] = data;
  await Deno.writeTextFile(DB_PATH, JSON.stringify(file));
}

export async function getRecord(id: string) {
  const file = JSON.parse(await Deno.readTextFile(DB_PATH));
  return file[id];
}

async function checkDatabase() {
  try {
    await Deno.stat(DB_PATH);
  } catch (e) {
    await Deno.writeTextFile(DB_PATH, JSON.stringify({}));
  }
}

checkDatabase();
