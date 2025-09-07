import z from "zod";

const ApiKeySchema = z.object({
  key : z.string().min(1),
})

export { ApiKeySchema };