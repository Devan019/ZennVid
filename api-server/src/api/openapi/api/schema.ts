import z from "zod";

const ApiKeySchema = z.object({
  key : z.string().min(1),
})

const TranslaterSchema = z.object({
  text : z.string().min(1),
  language : z.string().min(1)
})

const AudioGenSchema = z.object({
  text : z.string().min(1),
  voice : z.string().min(1),
})

const CaptionGenSchema = z.object({
  audio : z.string().min(1),
  language : z.string().min(1),
})

export { ApiKeySchema, TranslaterSchema, AudioGenSchema, CaptionGenSchema };