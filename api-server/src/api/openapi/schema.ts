import z from "zod";

const ApiSchema = z.object({
  name : z.string().min(1).max(100),
})

export { ApiSchema };