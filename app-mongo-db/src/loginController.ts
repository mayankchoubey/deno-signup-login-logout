import { Context } from "../deps.ts";
import { attemptLogin } from "./loginService.ts";
import { validateToken } from "./utils.ts";

export async function loginUser(ctx: Context) {
  const result = ctx.request.body();
  let req;
  if (result.type !== "json") {
    ctx.response.status = 415;
    return;
  } else {
    req = await result.value;
  }
  if (!(req.email && req.password)) {
    ctx.response.status = 400;
    return;
  }
  try {
    const token = await attemptLogin(req);
    ctx.response.body = { token };
  } catch (e) {
    ctx.response.status = 401;
    if (e instanceof Deno.errors.NotFound) {
      ctx.response.body = "User does not exists";
    } else if (e instanceof Deno.errors.PermissionDenied) {
      ctx.response.body = "Wrong password";
    }
  }
}

export async function logoutUser(ctx: Context) {
  const token = ctx.request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    ctx.response.status = 401;
    return;
  }
  const email = await validateToken(token);
  if (!email) {
    ctx.response.status = 401;
    return;
  }
  localStorage.setItem(token, "1");
  ctx.response.status = 200;
}
