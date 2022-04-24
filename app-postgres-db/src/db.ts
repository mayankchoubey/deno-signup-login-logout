import { Client } from "../deps.ts";
import { printError } from "./utils.ts";
import cfg from "../cfg.json" assert { type: "json" };
import { TABLE_NAME, UserProfile } from "./consts.ts";

let dbConn: Client;

export async function addRecord(id: string, data: any) {
  await dbConn.queryObject(
    `INSERT INTO ${TABLE_NAME} (EMAIL, NAME, PASSWORD) VALUES ($1, $2, $3)`,
    [id, data.name, data.password],
  );
}

export async function getRecord(id: string) {
  const result = await dbConn.queryObject(
    `SELECT * FROM ${TABLE_NAME} WHERE EMAIL = $1`,
    [id],
  );
  if (result && result.rows && result.rows.length > 0) {
    return result.rows[0] as UserProfile;
  }
}

async function checkTables() {
  try {
    await dbConn.queryObject(`SELECT * FROM ${TABLE_NAME}`);
  } catch (e) {
    await dbConn.queryObject(`CREATE TABLE ${TABLE_NAME} (
        EMAIL VARCHAR(50) PRIMARY KEY,
        NAME VARCHAR(50) NOT NULL,
        PASSWORD VARCHAR(50) NOT NULL
    )`);
    console.log(
      `${TABLE_NAME} table is created in ${cfg.postgres.db} database`,
    );
  }
}

async function connectDatabase() {
  try {
    dbConn = new Client({
      user: cfg.postgres.user,
      password: cfg.postgres.password,
      hostname: cfg.postgres.host,
      port: cfg.postgres.port,
      database: cfg.postgres.db,
    });
    await dbConn.connect();
    console.log("Connected to postgres database");
    await checkTables();
  } catch (e) {
    printError("Unable to connect to database: " + e.message);
    Deno.exit(1);
  }
}

connectDatabase();
