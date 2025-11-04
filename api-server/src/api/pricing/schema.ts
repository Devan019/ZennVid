import z from "zod";

export const creditZodValidation = z.object({
  credits : z.number({message:"credits are required"}),
  paymentId : z.string({message: "payment id is required"}),
  amount : z.number({message : "transcation is required"})
})