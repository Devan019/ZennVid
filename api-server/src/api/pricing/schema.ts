import z from "zod";

export const creditZodValidation = z.object({
  credits : z.number({message:"credits are required"})
})