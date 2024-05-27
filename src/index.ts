import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  sls: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Content-Length"],
  })
);

app.post("/set", async (ctx) => {
  const { key, value } = await ctx.req.json();
  await ctx.env.sls.put(key, value.toString());
  ctx.status(200);
  return ctx.text("Key-value pair set successfully");
});

app.post("/get", async (ctx) => {
  const { key }: { key: string } = await ctx.req.json();
  const value = await ctx.env.sls.get(key);
  if (value === null) {
    ctx.status(404);
    return ctx.text("Key not found");
  }
  ctx.status(200);
  return ctx.text(value);
});

export default app;
