import { Context } from "../deps.ts";
import { attemptSignup } from "./signupService.ts";

export async function signupUser(ctx: Context) {
  const result = ctx.request.body();
  let req;
  if (result.type !== "json") {
    ctx.response.status = 415;
    return;
  } else {
    req = await result.value;
  }
  if (!(req.name && req.email && req.password)) {
    ctx.response.status = 400;
    return;
  }
  try {
    await attemptSignup(req);
    ctx.response.status = 201;
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
    if (e instanceof Deno.errors.AlreadyExists) {
      ctx.response.body = "User already exists";
    }
  }
}
