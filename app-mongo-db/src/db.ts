import { Collection, MongoClient } from "../deps.ts";
import { printError } from "./utils.ts";
import cfg from "../cfg.json" assert { type: "json" };
import { COLLECTION_NAME, UserSchema } from "./consts.ts";

let dbConn: Collection<UserSchema>;

export async function addRecord(id: string, data: any) {
  await dbConn.insertOne({
    _id: id,
    ...data,
  });
}

export async function getRecord(id: string) {
  return await dbConn.findOne({ _id: id });
}

async function connectDatabase() {
  const mongoPath =
    `mongodb://${cfg.mongo.user}:${cfg.mongo.password}@${cfg.mongo.host}:${cfg.mongo.port}/${cfg.mongo.db}`;
  try {
    const client = new MongoClient();
    await client.connect(mongoPath);
    const db = client.database(cfg.mongo.db);
    dbConn = db.collection<UserSchema>(COLLECTION_NAME);
    console.log("Connected to mongo database");
  } catch (e) {
    printError("Unable to connect to database: " + e.message);
    Deno.exit(1);
  }
}

connectDatabase();
