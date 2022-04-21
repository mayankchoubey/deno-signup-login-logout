import * as router from "./src/router.ts";
import { printError } from "./src/utils.ts";
import cfg from "./cfg.json" assert { type: "json" };

async function checkAccess() {
  if (
    (await Deno.permissions.query({ name: "read", path: "./public" })).state !==
      "granted"
  ) {
    printError("Missing read permission to ./public");
    Deno.exit(1);
  }
  if (
    (await Deno.permissions.query({ name: "read", path: "./localdb" }))
      .state !== "granted"
  ) {
    printError("Missing read permission to ./localdb");
    Deno.exit(1);
  }
  if (
    (await Deno.permissions.query({ name: "write", path: "./localdb" }))
      .state !== "granted"
  ) {
    printError("Missing write permission to ./localdb");
    Deno.exit(1);
  }
  if (
    (await Deno.permissions.query({
      name: "net",
      host: `0.0.0.0:${cfg.serverPort}`,
    })).state !== "granted"
  ) {
    printError(`Missing net permission to 0.0.0.0:${cfg.serverPort}`);
    Deno.exit(1);
  }
}

await checkAccess();
router.start();
