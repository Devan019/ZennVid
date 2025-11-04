import z from "zod";

export const paginationSchema = z.object({
  page : z.number({message : "page no is required"}),
  limit : z.number({message : "limit is required"}),
  search: z.string().optional(),
  createdAt : z.string().optional()
})