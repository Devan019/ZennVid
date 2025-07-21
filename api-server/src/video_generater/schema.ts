import z from "zod";
import { Styles, VoiceGender, VoiceLanguage } from "../constants/common";

export const videogeneraterZodValidation = z.object({
  title : z.string().min(1, "title is required"),
  videoLength: z.number().min(1, "Video length must be at least 1 second"),
  voiceGender : z.nativeEnum(VoiceGender).default(VoiceGender.Female),
  voiceLanguage : z.nativeEnum(VoiceLanguage).default(VoiceLanguage.EnglishIndia),
  frameSize : z.string().default("640x480"),
  style : z.nativeEnum(Styles).default(Styles.Realistic)
})