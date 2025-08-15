import z from "zod";
import { Styles, VoiceGender, VoiceLanguage } from "../../constants/common";

export const videogeneraterZodValidation = z.object({
  title: z.string().min(1, "title is required"),
  voiceGender: z.enum(Object.keys(VoiceGender) as [keyof typeof VoiceGender]),
  voiceLanguage: z.enum(Object.keys(VoiceLanguage) as [keyof typeof VoiceLanguage]),
  style: z.nativeEnum(Styles).default(Styles.Realistic),
  seconds: z.number().min(1, "Seconds must be at least 1"),
  language : z.string().min(1, "Language is required")
})

export const lipSyncZodValidation = z.object({
  description : z.string().min(1, "Description is required"),
  character : z.string().min(1, "Character is required"),
  style: z.nativeEnum(Styles).default(Styles.Realistic),
  language: z.string().min(1, "Voice Language is required"),
  title: z.string().min(1, "title is required"),
})