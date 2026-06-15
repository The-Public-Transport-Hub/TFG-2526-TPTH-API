import { z } from "zod";

const booleanFromEnv = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true")

const envSchema = z.object({
  BUN_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(1),
  DB_NAME: z.string().min(1),
  MONGO_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().default(5000),
  ADMIN_API_KEY: z.string().min(32),
  DEV_API_TOKEN: z.string().min(32).optional(),
  CORS_ORIGIN: z.string().optional(),
  ENABLE_CRON: booleanFromEnv,
});

const parsedEnv = envSchema.safeParse(Bun.env);

if (!parsedEnv.success) {
  console.error("Error parsing environment variables:");
  console.error(z.treeifyError(parsedEnv.error));
  throw new Error("Invalid configuration");
}

const env = parsedEnv.data;

if (env.BUN_ENV === "production" && !env.ADMIN_API_KEY) {
  throw new Error("ADMIN_API_KEY is required")
}

export { env }
