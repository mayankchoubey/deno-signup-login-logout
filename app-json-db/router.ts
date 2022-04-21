import { Application, Context, Router } from "../deps.ts";
import { configure, renderFile } from "../deps.ts";
import cfg from "../cfg.json" assert { type: "json" };
import { signupUser } from "./signupController.ts";
import { loginUser, logoutUser } from "./loginController.ts";
import { getUserProfile } from "./userController.ts";

export async function start() {
  configure({ views: "./public" });
  const router = new Router();
  router
    .get("/", (ctx) => ctx.response.redirect("./index.html"))
    .get(
      "/index.html",
      (ctx) => sendFile(ctx, "index.eta", { siteName: cfg.siteName }),
    )
    .get(
      "/login.html",
      (ctx) => sendFile(ctx, "login.eta", { siteName: cfg.siteName }),
    )
    .get(
      "/signup.html",
      (ctx) => sendFile(ctx, "signup.eta", { siteName: cfg.siteName }),
    )
    .get(
      "/app.html",
      (ctx) => sendFile(ctx, "app.eta", { siteName: cfg.siteName }),
    )
    .post("/signup", (ctx) => signupUser(ctx))
    .post("/login", (ctx) => loginUser(ctx))
    .get("/logout", (ctx) => logoutUser(ctx))
    .get("/userProfile", (ctx) => getUserProfile(ctx));


  const app = new Application();

  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log(`Server started on ${cfg.serverPort}`);
  await app.listen({ port: cfg.serverPort });
}

async function sendFile(ctx: Context, fileName: string, data: any) {
  const file = await renderFile(`${fileName}`, data) as string;
  ctx.response.body = file;
  ctx.response.headers.set("Content-Type", "text/html");
}
