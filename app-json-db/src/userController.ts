import { Context } from "../deps.ts";
import { getUser } from "./userService.ts";
import { validateToken } from "./utils.ts";

export async function getUserProfile(ctx: Context) {
  const token = ctx.request.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    ctx.response.status = 401;
    return;
  }
  if (localStorage.getItem(token)) {
    ctx.response.status = 401;
    return;
  }
  const email = await validateToken(token);
  if (!email) {
    ctx.response.status = 401;
    return;
  }
  try {
    const userData = await getUser(email);
    ctx.response.body = { name: userData.name, email: userData.email };
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
    if (e instanceof Deno.errors.NotFound) {
      ctx.response.body = "User does not exists";
    }
  }
}
