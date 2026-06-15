import z from "zod";

export const adminResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    taskId: z.string(),
    status: z.literal("started"),
  }),
});
