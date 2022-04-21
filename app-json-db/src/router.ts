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
    .post("/signup", (ctx) => signupUser(ctx))
    .post("/login", (ctx) => loginUser(ctx))
    .get("/logout", (ctx) => logoutUser(ctx))
    .get("/userProfile", (ctx) => getUserProfile(ctx))
    .get("/(.*\..*)", (ctx) => sendFile(ctx, { siteName: cfg.siteName }));

  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log(`Server started on ${cfg.serverPort}`);
  await app.listen({ port: cfg.serverPort });
}

async function sendFile(ctx: Context, data: any) {
    const fileName = ctx.request.url.pathname.split(".")[0]+".eta";
    const file = await renderFile(`${fileName}`, data) as string;
    ctx.response.body = file;
    ctx.response.headers.set("Content-Type", "text/html");
}
