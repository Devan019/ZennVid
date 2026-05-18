import z from "zod";
import { Styles, VoiceGender, VoiceLanguage } from "../../constants/common";

export const videogeneraterZodValidation = z.object({
  title: z.string().min(1, "title is required"),
  voiceGender: z.enum(Object.keys(VoiceGender) as [keyof typeof VoiceGender]),
  voiceLanguage: z.enum(Object.keys(VoiceLanguage) as [keyof typeof VoiceLanguage]),
  style: z.nativeEnum(Styles).default(Styles.Realistic)
})

export const lipSyncZodValidation = z.object({
  description : z.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  character : z.string().min(1, "Character is required"),
  style: z.nativeEnum(Styles).default(Styles.Realistic),
  title: z.string().min(1, "title is required"),
})