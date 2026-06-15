import z from "zod";

export const lineParamsSchema = z.object({
  id: z.string().min(1),
});
